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
 * 인라인 토큰 파서 (NARRATIVE 내부용)
 */
function parseInlineTokens(raw: string): PlatSegment[] {
  const segments: PlatSegment[] = [];
  const tokenRegex = /\{\{([^}]+)\\}\}/g;
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
 * 개별 블록 파서
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

  // ASSET 블록: {{type:code}}
  const assetBlockRegex = /^\{\{([^}]+)\}\}$/;
  const assetMatch = assetBlockRegex.exec(trimmed);
  if (assetMatch) {
    const inner = assetMatch[1];
    if (inner.includes(":")) {
      const colonIdx = inner.indexOf(":");
      const assetType = inner.slice(0, colonIdx);
      const code = inner.slice(colonIdx + 1);
      if (assetType === "img") return { type: "ASSET_IMG", code };
      return { type: "ASSET_BLOCK", assetType, code };
    }
  }

  // 매칭되는 형식이 없으면 일반 텍스트를 NARRATIVE로 처리
  return { type: "NARRATIVE", segments: [{ type: "TEXT", value: trimmed }] };
}

/**
 * 메인 파서: 블록 구분자 없이 시작/끝 기호만으로 블록을 분리합니다.
 */
export function parsePlat(source: string): PlatBlock[] {
  const blocks: PlatBlock[] = [];
  let i = 0;
  const len = source.length;

  while (i < len) {
    // 1. 앞선 공백 및 줄바꿈 스킵
    while (i < len && /\s/.test(source[i])) i++;
    if (i >= len) break;

    const start = i;

    // 2. 블록 타입 판별 및 끝 지점 찾기

    // CASE A: NARRATIVE (*)
    if (source[i] === "*") {
      i++;
      while (i < len && source[i] !== "*") i++;
      if (i < len) i++; // 닫는 * 포함
    }
    // CASE B: DIALOGUE (")
    else if (source[i] === '"') {
      i++;
      while (i < len && source[i] !== '"') i++;
      if (i < len) i++; // 닫는 " 포함
    }
    // CASE C: ASSET ({{)
    else if (source[i] === "{" && source[i + 1] === "{") {
      i += 2;
      while (i < len && !(source[i] === "}" && source[i + 1] === "}")) i++;
      if (i < len) i += 2; // 닫는 }} 포함
    }
    // CASE D: FALLBACK (기호 없는 일반 텍스트)
    else {
      while (i < len) {
        // 다음 블록의 시작 기호를 만나면 중단
        if (
          source[i] === "*" ||
          source[i] === '"' ||
          (source[i] === "{" && source[i + 1] === "{")
        )
          break;
        i++;
      }
    }

    const raw = source.slice(start, i);
    const block = parseBlock(raw);
    if (block) blocks.push(block);
  }

  return blocks;
}
