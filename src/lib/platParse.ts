// ============================================================
// .plat 포맷 파서
// ============================================================
// 블록 타입:
//   DIALOGUE   : "..."          캐릭터 대사 (단일라인)
//   NARRATIVE  : *...* 상황묘사 (멀티라인, 내부 \n\n 허용)
//   ASSET_IMG  : {{img:url}}    이미지 단독 블록
//
// 인라인 토큰 (NARRATIVE 내부):
//   {{user}}                    유저 이름 치환
// ============================================================

export type PlatSegment =
  | { type: "TEXT"; value: string }
  | { type: "ASSET_USER" }
  | { type: "ASSET_INLINE"; assetType: string; code: string };

export type PlatBlock =
  | { type: "DIALOGUE"; content: string }
  | { type: "NARRATIVE"; segments: PlatSegment[] }
  | { type: "ASSET_IMG"; code: string }
  | { type: "ASSET_BLOCK"; assetType: string; code: string };

/**
 * 1. 인라인 토큰 파서 (NARRATIVE 내부용)
 * {{user}} 또는 {{type:code}} 패턴을 찾아 분리합니다.
 */
function parseInlineTokens(raw: string): PlatSegment[] {
  const segments: PlatSegment[] = [];
  const tokenRegex = /\{\{([^}]+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "TEXT", value: raw.slice(lastIndex, match.index) });
    }

    const inner = match[1];

    if (inner === "user") {
      segments.push({ type: "ASSET_USER" });
    } else if (inner.includes(":")) {
      const colonIdx = inner.indexOf(":");
      const assetType = inner.slice(0, colonIdx);
      const code = inner.slice(colonIdx + 1);
      segments.push({ type: "ASSET_INLINE", assetType, code });
    } else {
      segments.push({ type: "TEXT", value: match[0] });
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < raw.length) {
    segments.push({ type: "TEXT", value: raw.slice(lastIndex) });
  }

  return segments;
}

/**
 * 2. 개별 블록 파서
 * 텍스트 한 덩어리가 어떤 타입(대사, 지문, 에셋)인지 판별합니다.
 */
function parseBlock(raw: string): PlatBlock | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // DIALOGUE: "..."
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return { type: "DIALOGUE", content: trimmed.slice(1, -1) };
  }

  // NARRATIVE: *...*
  if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
    const inner = trimmed.slice(1, -1);
    const segments = parseInlineTokens(inner);
    return { type: "NARRATIVE", segments };
  }

  // ASSET 블록: {{img:url}} (단독 라인)
  const assetBlockRegex = /^\{\{([^}]+)\}\}$/;
  const assetMatch = assetBlockRegex.exec(trimmed);
  if (assetMatch) {
    const inner = assetMatch[1];
    if (inner.includes(":")) {
      const colonIdx = inner.indexOf(":");
      const assetType = inner.slice(0, colonIdx);
      const code = inner.slice(colonIdx + 1);

      if (assetType === "img") {
        return { type: "ASSET_IMG", code };
      }
      return { type: "ASSET_BLOCK", assetType, code };
    }
  }

  // 매칭되는 형식이 없으면 일반 텍스트를 NARRATIVE(지문)로 취급
  return { type: "NARRATIVE", segments: [{ type: "TEXT", value: trimmed }] };
}

/**
 * 3. 메인 파서 (외부에서 호출)
 * 전체 문자열을 블록 단위로 쪼개어 PlatBlock 배열을 반환합니다.
 */
export function parsePlat(source: string): PlatBlock[] {
  const blocks: PlatBlock[] = [];
  let i = 0;
  const len = source.length;

  while (i < len) {
    // 앞선 줄바꿈 및 공백 스킵
    while (i < len && (source[i] === "\n" || source[i] === " ")) i++;
    if (i >= len) break;

    const start = i;

    // NARRATIVE 블록 특수 처리 (*로 시작하면 닫는 *까지 줄바꿈 무시하고 읽음)
    if (source[i] === "*") {
      i++; // 여는 * 건너뜀
      while (i < len && source[i] !== "*") i++;
      if (i < len && source[i] === "*") i++; // 닫는 * 포함

      const raw = source.slice(start, i);
      const block = parseBlock(raw);
      if (block) blocks.push(block);
    }
    // 그 외 일반 블록 (대사, 에셋 등)
    else {
      // \n\n(빈 줄)이 나타날 때까지 읽음
      while (i < len) {
        if (source[i] === "\n" && source[i + 1] === "\n") break;
        i++;
      }
      const raw = source.slice(start, i);
      const block = parseBlock(raw.trim());
      if (block) blocks.push(block);

      // 블록 구분자(\n\n) 건너뜀
      if (i < len && source[i] === "\n") i += 2;
    }
  }

  return blocks;
}
