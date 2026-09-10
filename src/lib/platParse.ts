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
 * 파싱된 세그먼트를 화면에 보여줄 문자열로 합칩니다. {{user}}(ASSET_USER)는
 * 실제로 보고 있는 사람의 이름으로 치환합니다 — 시나리오를 편집하는 폼처럼
 * 토큰을 그대로 남겨야 하는 자리에는 쓰지 말고, 채팅방/미리보기처럼 "누군가에게
 * 보여주는" 자리에서만 사용하세요.
 */
export const segmentsToDisplayText = (
  segments: PlatSegment[],
  userDisplayName: string,
) =>
  segments
    .map((segment) => {
      if (segment.type === "TEXT") return segment.value;
      if (segment.type === "ASSET_USER") return userDisplayName;
      return `{{${segment.assetType}:${segment.code}}}`;
    })
    .join("");

/**
 * 대사류 블록(DIALOGUE / USER_DIALOGUE / NARRATIVE) 내부 문자열에서
 * {{user}}, {{img:code}} 같은 인라인 토큰을 찾아 일반 텍스트와 분리합니다.
 */
function parseInlineTokens(raw: string): PlatSegment[] {
  const segments: PlatSegment[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  INLINE_TOKEN_REGEX.lastIndex = 0;
  while ((match = INLINE_TOKEN_REGEX.exec(raw)) !== null) {
    if (match.index > cursor) {
      segments.push({ type: "TEXT", value: raw.slice(cursor, match.index) });
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
    segments.push({ type: "TEXT", value: raw.slice(cursor) });
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

  if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
    return {
      type: "NARRATIVE",
      segments: parseInlineTokens(trimmed.slice(1, -1)),
    };
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
  return { type: "NARRATIVE", segments: [{ type: "TEXT", value: trimmed }] };
}

/**
 * source에서 index가 가리키는 블록이 여는 기호부터 닫는 기호까지 몇 글자인지
 * 찾아 그 끝 위치를 반환합니다. 닫는 기호가 없으면(잘못 작성된 블록) 문자열
 * 끝까지를 그 블록으로 봅니다.
 */
const findBlockEnd = (
  source: string,
  index: number,
  { open, close }: { open: string; close: string },
) => {
  let i = index + open.length;
  while (i < source.length && !startsWithAt(source, i, close)) i++;
  if (i < source.length) i += close.length; // 닫는 기호까지 포함

  return i;
};

/**
 * 메인 파서: 공백을 건너뛰며 각 위치가 BLOCK_DELIMITERS 중 어떤 기호로
 * 시작하는지 보고, 맞는 게 있으면 그 블록의 끝까지, 없으면(순수 텍스트)
 * 다음 블록이 시작되기 전까지를 한 덩어리로 잘라 parseBlock에 넘깁니다.
 */
export function parsePlat(source: string): PlatBlock[] {
  const blocks: PlatBlock[] = [];
  let i = 0;

  while (i < source.length) {
    while (i < source.length && /\s/.test(source[i])) i++;
    if (i >= source.length) break;

    const start = i;
    const delimiter = BLOCK_DELIMITERS.find((rule) =>
      startsWithAt(source, i, rule.open),
    );

    if (delimiter) {
      i = findBlockEnd(source, i, delimiter);
    } else {
      // 다음 블록의 시작 기호를 만날 때까지 일반 텍스트로 취급합니다.
      while (
        i < source.length &&
        !BLOCK_DELIMITERS.some((rule) => startsWithAt(source, i, rule.open))
      ) {
        i++;
      }
    }

    const block = parseBlock(source.slice(start, i));
    if (block) blocks.push(block);
  }

  return blocks;
}
