// ============================================================
// .plat 포맷 파서 (v2)
// ============================================================
// 메타 블록:
//   META       : [[key=value]]   시나리오 설명(d)/난이도(f) 등 대화 로그가 아닌 정보
//
// 블록 타입:
//   DIALOGUE      : "..."        캐릭터 대사
//   USER_DIALOGUE : '...'        유저 대사
//   NARRATIVE     : *...*        상황묘사 (멀티라인, 내부 \n\n 허용)
//   ASSET_IMG     : {{img:code}} 이미지 단독 블록
//
// 인라인 토큰 (DIALOGUE / USER_DIALOGUE / NARRATIVE 내부 공통):
//   {{user}}                    유저 이름 치환
//
// 처리 흐름: parsePlat(원문) → 블록 단위로 자름 → parseBlock(블록 하나)이
// 앞뒤 기호(", ', *, [[, {{)로 타입을 정하고, 대사류는 내부를
// parseInlineTokens로 한 번 더 훑어 {{user}} 같은 인라인 토큰을 분리합니다.
// ============================================================

export type PlatSegment =
  | { type: "TEXT"; value: string }
  | { type: "ASSET_USER" }
  | { type: "ASSET_INLINE"; assetType: string; code: string };

export type PlatBlock =
  | { type: "DIALOGUE"; segments: PlatSegment[] }
  | { type: "USER_DIALOGUE"; segments: PlatSegment[] }
  | { type: "NARRATIVE"; segments: PlatSegment[] }
  | { type: "ASSET_IMG"; code: string }
  | { type: "ASSET_BLOCK"; assetType: string; code: string }
  | { type: "META"; key: string; value: string };

/**
 * 블록을 감싸는 여는/닫는 기호 목록입니다. parsePlat의 메인 루프가 이 표를
 * 그대로 순회하며 "지금 위치가 어떤 블록으로 시작하는지"를 판단합니다 —
 * 블록 종류를 새로 추가/변경할 때는 이 표만 고치면 됩니다.
 */
const BLOCK_DELIMITERS = [
  { open: "*", close: "*" }, // NARRATIVE
  { open: '"', close: '"' }, // DIALOGUE
  { open: "'", close: "'" }, // USER_DIALOGUE
  { open: "[[", close: "]]" }, // META
  { open: "{{", close: "}}" }, // ASSET (이미지 등)
] as const;

const INLINE_TOKEN_REGEX = /\{\{([^}]+)\}\}/g;
const META_REGEX = /^\[\[([a-zA-Z0-9_]+)=([\s\S]*)\]\]$/;
const ASSET_BLOCK_REGEX = /^\{\{([^}]+)\}\}$/;

const startsWithAt = (source: string, index: number, token: string) =>
  source.startsWith(token, index);

/**
 * 일반 텍스트 한가운데의 {{user}} 는 이미지·메타 같은 블록의 시작이 아니라 이름 자리다.
 * 블록으로 잘라 내면 한 문장이 세 줄로 갈라지고, 떨어져 나온 토큰은 이름으로 바뀌지 않는다.
 */
const isUserTokenAt = (source: string, index: number) =>
  startsWithAt(source, index, "{{user}}");

/** index 에서 시작하는 블록 기호. {{user}} 는 블록이 아니므로 없는 것으로 본다. */
const findDelimiterAt = (source: string, index: number) =>
  isUserTokenAt(source, index)
    ? undefined
    : BLOCK_DELIMITERS.find((rule) => startsWithAt(source, index, rule.open));

/** "img:fileId" 처럼 "타입:코드" 형태인 토큰 내용을 나눕니다. 콜론이 없으면 null. */
const splitAssetToken = (
  inner: string,
): { assetType: string; code: string } | null => {
  const colonIndex = inner.indexOf(":");
  if (colonIndex === -1) return null;

  return {
    assetType: inner.slice(0, colonIndex),
    code: inner.slice(colonIndex + 1),
  };
};

/**
 * 이름 뒤에 붙는 조사 [받침 있을 때, 없을 때]. AI 는 이름을 {{user}} 토큰으로만 쓰므로 받침을 몰라
 * "{{user}}를", "{{user}}가" 처럼 조사를 고정해 쓴다. 이름이 정해진 화면에서 받침에 맞춘다.
 */
const JOSA_PAIRS = [
  ["은", "는"],
  ["이", "가"],
  ["을", "를"],
  ["과", "와"],
  ["이랑", "랑"],
  ["이라", "라"],
  ["아", "야"],
];
const JOSA_LOOKUP = new Map<string, readonly string[]>();
for (const pair of JOSA_PAIRS) for (const josa of pair) JOSA_LOOKUP.set(josa, pair);

// 조사 뒤가 한글이면 "아니", "이상" 같은 다른 낱말이므로 건드리지 않는다. 조사 뒤에 다시 붙는 글자(는·도·만…)만 허용한다.
const NAME_JOSA = new RegExp(
  `^(으로|${JOSA_PAIRS.flat()
    .sort((a, b) => b.length - a.length)
    .join("|")}|로)(?=[^가-힣]|$|[는도만의요서])`,
);

/**
 * 이름 바로 뒤 글자가 조사면 이름의 받침에 맞춰 바꿉니다. 한글로 끝나는 이름만 보정하고,
 * 영문·숫자 이름이나 조사가 아닌 글자는 AI 가 쓴 그대로 둡니다.
 */
const fitJosa = (name: string, after: string) => {
  const code = name.charCodeAt(name.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return after;

  const match = NAME_JOSA.exec(after);
  if (!match) return after;

  const jong = code % 28;
  const josa = match[1];
  const fitted =
    josa === "으로" || josa === "로"
      ? jong && jong !== 8 // 받침 ㄹ 은 받침 없는 이름처럼 "로" 를 쓴다
        ? "으로"
        : "로"
      : JOSA_LOOKUP.get(josa)![jong ? 0 : 1];

  return fitted + after.slice(josa.length);
};

/** 글 안의 {{user}} 를 이름으로 바꾸고 바로 뒤에 붙은 조사를 이름 받침에 맞춥니다. */
export const fillUserName = (text: string, name: string) => {
  const parts = text.split("{{user}}");
  let result = parts[0];
  for (let i = 1; i < parts.length; i += 1) result += name + fitJosa(name, parts[i]);

  return result;
};

/**
 * 파싱된 세그먼트를 화면에 보여줄 문자열로 합칩니다. {{user}}(ASSET_USER)는
 * 실제로 보고 있는 사람의 이름으로 치환합니다 — 시나리오를 편집하는 폼처럼
 * 토큰을 그대로 남겨야 하는 자리에는 쓰지 말고, 채팅방/미리보기처럼 "누군가에게
 * 보여주는" 자리에서만 사용하세요.
 * userDisplayName 이 없으면(비로그인) 이름을 임의로 채우지 않고 {{user}} 원문을 그대로 남깁니다.
 */
export const segmentsToDisplayText = (
  segments: PlatSegment[],
  userDisplayName?: string,
) => {
  let text = "";
  let afterUser = false;

  for (const segment of segments) {
    if (segment.type === "TEXT") {
      text += afterUser && userDisplayName ? fitJosa(userDisplayName, segment.value) : segment.value;
      afterUser = false;
    } else if (segment.type === "ASSET_USER") {
      text += userDisplayName ?? "{{user}}";
      afterUser = true;
    } else {
      text += `{{${segment.assetType}:${segment.code}}}`;
      afterUser = false;
    }
  }

  return text;
};

/**
 * encodeScenarioContent가 구분자 문자·역슬래시 앞에 붙인 역슬래시를 지워
 * 사용자가 원래 입력한 글자 그대로 되돌립니다.
 */
const unescapeDelimiters = (raw: string) => raw.replace(/\\(.)/g, "$1");

/**
 * 대사류 블록(DIALOGUE / USER_DIALOGUE / NARRATIVE) 내부 문자열에서
 * {{user}}, {{img:code}} 같은 인라인 토큰을 찾아 일반 텍스트와 분리합니다.
 */
function parseInlineTokens(raw: string, shouldUnescape = true): PlatSegment[] {
  const unescape = shouldUnescape ? unescapeDelimiters : (value: string) => value;
  const segments: PlatSegment[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  INLINE_TOKEN_REGEX.lastIndex = 0;
  while ((match = INLINE_TOKEN_REGEX.exec(raw)) !== null) {
    if (match.index > cursor) {
      segments.push({
        type: "TEXT",
        value: unescape(raw.slice(cursor, match.index)),
      });
    }

    const inner = match[1];
    if (inner === "user") {
      segments.push({ type: "ASSET_USER" });
    } else {
      const asset = splitAssetToken(inner);
      segments.push(
        asset ? { type: "ASSET_INLINE", ...asset } : { type: "TEXT", value: match[0] },
      );
    }

    cursor = INLINE_TOKEN_REGEX.lastIndex;
  }

  if (cursor < raw.length) {
    segments.push({ type: "TEXT", value: unescape(raw.slice(cursor)) });
  }

  return segments;
}

/** 여는/닫는 기호를 뗀 블록 하나(예: `"안녕"`, `*문이 열린다*`)를 PlatBlock으로 해석합니다. */
function parseBlock(raw: string): PlatBlock | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return { type: "DIALOGUE", segments: parseInlineTokens(trimmed.slice(1, -1)) };
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return {
      type: "USER_DIALOGUE",
      segments: parseInlineTokens(trimmed.slice(1, -1)),
    };
  }

  if (trimmed.startsWith("*")) {
    // 닫는 별표가 빠진 묘사도 묘사다. 별표는 기호일 뿐 글자로 보여 주지 않는다.
    const inner = trimmed.endsWith("*") && trimmed.length > 1 ? trimmed.slice(1, -1) : trimmed.slice(1);
    return { type: "NARRATIVE", segments: parseInlineTokens(inner.trim()) };
  }

  const metaMatch = META_REGEX.exec(trimmed);
  if (metaMatch) {
    return { type: "META", key: metaMatch[1], value: metaMatch[2] };
  }

  const assetMatch = ASSET_BLOCK_REGEX.exec(trimmed);
  if (assetMatch) {
    const asset = splitAssetToken(assetMatch[1]);
    if (asset) {
      return asset.assetType === "img"
        ? { type: "ASSET_IMG", code: asset.code }
        : { type: "ASSET_BLOCK", assetType: asset.assetType, code: asset.code };
    }
  }

  // 위 어떤 형식에도 안 맞는 텍스트는 그냥 지문(NARRATIVE)으로 취급합니다.
  // 기호 없는 글에 섞인 {{user}} 도 이름으로 바뀌도록 인라인 토큰을 나눈다. 원문의 역슬래시는 그대로 둔다.
  return { type: "NARRATIVE", segments: parseInlineTokens(trimmed, false) };
}

type BlockDelimiter = (typeof BLOCK_DELIMITERS)[number];

/**
 * source에서 index가 가리키는 블록이 여는 기호부터 닫는 기호까지 몇 글자인지
 * 찾아 그 끝 위치를 반환합니다. 닫는 기호가 없으면(잘못 작성됐거나 아직 도착
 * 중인 블록) 문자열 끝까지를 그 블록으로 보고 closed를 false로 둡니다.
 */
const findBlockEnd = (
  source: string,
  index: number,
  { open, close }: BlockDelimiter,
) => {
  let i = index + open.length;
  while (i < source.length && !startsWithAt(source, i, close)) {
    // 상황 묘사는 닫는 별표를 빠뜨려도 다음 블록을 삼키지 않게, 빈 줄 뒤에 새 블록이 시작되면 거기서 끊는다.
    if (open === "*") {
      if (paragraphBreakBeforeBlockAt(source, i) !== null) return { end: i, closed: false };
    }
    // 역슬래시로 이스케이프된 문자(예: \")는 닫는 기호로 오인하지 않도록
    // 한 쌍(역슬래시+다음 한 글자)을 통째로 건너뜁니다.
    i += source[i] === "\\" ? 2 : 1;
  }

  const closed = i < source.length;
  if (closed) i += close.length; // 닫는 기호까지 포함

  return { end: i, closed };
};

/**
 * index 가 빈 줄(문단 경계)이고 그 뒤 첫 글자가 새 블록의 여는 기호면 그 기호의 위치, 아니면 null.
 *
 * 모델이 `*묘사` 를 닫지 않고 빈 줄 뒤에 다음 블록을 쓰면, 닫는 별표를 다음 묘사의 여는 별표에서 찾아 그 사이 대사까지
 * 한 묘사로 묶고 뒤로 별표 짝이 하나씩 밀린다. 묘사 안의 빈 줄은 허용하므로, 빈 줄 뒤가 새 블록일 때만 끊는다.
 */
const paragraphBreakBeforeBlockAt = (source: string, index: number) => {
  const match = /^\n[ \t]*\n\s*/.exec(source.slice(index));
  if (!match) return null;
  const next = index + match[0].length;
  return next < source.length && findDelimiterAt(source, next) ? next : null;
};

/**
 * 줄 머리말 형식. 한 줄(또는 이어진 줄)이 `[행동] …` 이면 지문, `[대사] …` 이면 캐릭터 대사다.
 * 시나리오 시드처럼 따옴표·별표 없이 쓴 글이 이 형식이라, 모르면 통째로 지문 하나로 그려진다.
 * 이 형식에서는 글 안의 따옴표·별표가 기호가 아니라 그냥 글자다(`'작별 인사하기'` 등).
 */
const LABELED_START_REGEX = /^\s*\[(행동|대사)\]/;
const LABEL_LINE_REGEX = /(?:^|\n)[ \t]*\[(행동|대사)\][ \t]*/g;

const isLabeledSource = (source: string) => LABELED_START_REGEX.test(source);

/** 대사 안쪽을 감싼 따옴표는 말풍선이 따로 그리므로 벗긴다. */
const stripWrappingQuotes = (text: string) => {
  const match = /^["“”]([\s\S]*)["“”]$/.exec(text);
  return match ? match[1] : text;
};

function parseLabeled(source: string): PlatBlock[] {
  const blocks: PlatBlock[] = [];
  const pushText = (label: string, raw: string) => {
    const text = raw.trim();
    if (!text) return;

    if (label === "대사") {
      blocks.push({
        type: "DIALOGUE",
        segments: parseInlineTokens(stripWrappingQuotes(text), false),
      });
      return;
    }

    blocks.push({ type: "NARRATIVE", segments: parseInlineTokens(text, false) });
  };

  const pushChunk = (label: string, raw: string) => {
    // 이미지 토큰만 있는 줄은 글 사이에서 이미지 블록으로 따로 그린다.
    let pending: string[] = [];
    const flush = () => {
      pushText(label, pending.join("\n"));
      pending = [];
    };

    for (const line of raw.split("\n")) {
      const assetMatch = ASSET_BLOCK_REGEX.exec(line.trim());
      const asset = assetMatch ? splitAssetToken(assetMatch[1]) : null;

      if (!asset) {
        pending.push(line);
        continue;
      }

      flush();
      blocks.push(
        asset.assetType === "img"
          ? { type: "ASSET_IMG", code: asset.code }
          : { type: "ASSET_BLOCK", assetType: asset.assetType, code: asset.code },
      );
    }

    flush();
  };

  let label = "행동";
  let cursor = 0;
  for (const match of source.matchAll(LABEL_LINE_REGEX)) {
    const index = match.index ?? 0;
    // 머리말 앞에 남은 글은 앞선 머리말의 이어진 줄이다.
    pushChunk(label, source.slice(cursor, index));
    label = match[1];
    cursor = index + match[0].length;
  }
  pushChunk(label, source.slice(cursor));

  return blocks;
}

/**
 * 메인 파서: 공백을 건너뛰며 각 위치가 BLOCK_DELIMITERS 중 어떤 기호로
 * 시작하는지 보고, 맞는 게 있으면 그 블록의 끝까지, 없으면(순수 텍스트)
 * 다음 블록이 시작되기 전까지를 한 덩어리로 잘라 parseBlock에 넘깁니다.
 */
export function parsePlat(source: string): PlatBlock[] {
  if (isLabeledSource(source)) return parseLabeled(source);

  const blocks: PlatBlock[] = [];
  let i = 0;

  while (i < source.length) {
    while (i < source.length && /\s/.test(source[i])) i++;
    if (i >= source.length) break;

    const start = i;
    const delimiter = findDelimiterAt(source, i);

    if (delimiter) {
      const { end, closed } = findBlockEnd(source, i, delimiter);
      i = end;
      // 닫히지 않은 묘사 끝에 대사가 붙어 있으면(`*문을 나선다 (웃으며) "또 와요"`) 묘사와 대사로 나눈다.
      if (delimiter.open === "*" && !closed) {
        const body = source.slice(start + 1, end);
        const quoteAt = body.indexOf('"');
        if (quoteAt > 0) {
          const narrative = parseBlock(`*${body.slice(0, quoteAt).trimEnd()}*`);
          if (narrative) blocks.push(narrative);
          blocks.push(...parsePlat(body.slice(quoteAt)));
          continue;
        }
      }
    } else {
      // 다음 블록의 시작 기호를 만날 때까지 일반 텍스트로 취급합니다.
      while (i < source.length && !findDelimiterAt(source, i)) {
        // {{user}} 는 한 덩어리로 건너뛴다. 안의 글자가 블록 기호로 오인되지 않게 한다.
        i += isUserTokenAt(source, i) ? "{{user}}".length : 1;
      }
    }

    const block = parseBlock(source.slice(start, i));
    if (block) blocks.push(block);
  }

  return blocks;
}

/** 끝에 반쯤 걸린 인라인 토큰(`{{us`, `{{img:ab}`)과 토큰·이스케이프의 첫 글자. */
const PARTIAL_INLINE_TOKEN_REGEX = /\{\{[^}]*\}?$/;
const PARTIAL_TAIL_CHAR_REGEX = /[{[\\]$/;

/**
 * 아직 도착 중인 원문의 마지막 블록을 미리 닫아 둡니다.
 *
 * 닫는 기호가 오기 전의 블록을 parsePlat에 그대로 넘기면 `"안녕` 처럼 여는 따옴표만 있는
 * 대사가 따옴표째 지문으로 그려졌다가, 닫는 따옴표가 오는 순간 말풍선으로 바뀌어 화면이 튄다.
 * 여는 기호를 보고 어떤 블록인지 먼저 정해 두고, 반쯤 온 `{{...}}` 는 완성될 때까지 숨깁니다.
 */
const closePendingBlock = (source: string) => {
  let i = 0;
  let lastStart = -1;
  let lastDelimiter: BlockDelimiter | null = null;
  let isLastClosed = true;

  while (i < source.length) {
    while (i < source.length && /\s/.test(source[i])) i++;
    if (i >= source.length) break;

    lastStart = i;
    const delimiter = findDelimiterAt(source, i);

    if (delimiter) {
      const { end, closed } = findBlockEnd(source, i, delimiter);
      i = end;
      lastDelimiter = delimiter;
      isLastClosed = closed;
    } else {
      while (i < source.length && !findDelimiterAt(source, i)) {
        i += isUserTokenAt(source, i) ? "{{user}}".length : 1;
      }
      lastDelimiter = null;
      isLastClosed = false;
    }
  }

  if (lastStart === -1 || isLastClosed) return source;

  const head = source.slice(0, lastStart);

  // 이미지·메타 블록은 닫히기 전에는 그릴 수 있는 게 없다.
  if (lastDelimiter && (lastDelimiter.open === "{{" || lastDelimiter.open === "[[")) {
    return head;
  }

  const tail = source
    .slice(lastStart)
    .replace(PARTIAL_INLINE_TOKEN_REGEX, "")
    .replace(PARTIAL_TAIL_CHAR_REGEX, "");

  if (!lastDelimiter) return head + tail;

  // 여는 기호만 온 상태라면 빈 말풍선을 그리지 않는다.
  if (tail.length <= lastDelimiter.open.length) return head;

  return head + tail + lastDelimiter.close;
};

/**
 * 스트리밍으로 받는 중인 원문을 파싱합니다. 글자가 올 때마다 원문이 바뀌므로
 * parsePlatCached의 캐시를 쓰지 않습니다(한 응답이 캐시를 전부 밀어낸다).
 */
export function parsePlatStreaming(source: string): PlatBlock[] {
  // 줄 머리말 형식은 따옴표가 기호가 아니라 미리 닫을 블록이 없다. 반쯤 온 토큰만 숨긴다.
  if (isLabeledSource(source)) {
    return parsePlat(source.replace(PARTIAL_INLINE_TOKEN_REGEX, ""));
  }

  return parsePlat(closePendingBlock(source));
}

const PLAT_PARSE_CACHE_LIMIT = 200;
const platParseCache = new Map<string, PlatBlock[]>();

/** 가상 목록에서 재마운트되는 메시지의 반복 파싱 방지를 위한 제한형 캐시 */
export function parsePlatCached(source: string): PlatBlock[] {
  const cachedBlocks = platParseCache.get(source);

  if (cachedBlocks) {
    // 최근 사용 항목을 뒤로 옮겨 오래 사용하지 않은 결과부터 제거
    platParseCache.delete(source);
    platParseCache.set(source, cachedBlocks);
    return cachedBlocks;
  }

  const blocks = parsePlat(source);
  platParseCache.set(source, blocks);

  if (platParseCache.size > PLAT_PARSE_CACHE_LIMIT) {
    const oldestSource = platParseCache.keys().next().value;
    if (oldestSource !== undefined) platParseCache.delete(oldestSource);
  }

  return blocks;
}
