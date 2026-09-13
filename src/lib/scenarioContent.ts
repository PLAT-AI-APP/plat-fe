import { getResourceImageUrl } from "@/lib/file";
import { PlatBlock, PlatSegment, parsePlat } from "@/lib/platParse";

/**
 * character.schema.ts의 동명 타입과 구조적으로 동일하게 맞춰 둡니다(중복 정의).
 * character.schema.ts가 합산 길이 검증을 위해 이 파일의 encodeScenarioContent를
 * 값으로 import하는데, 반대로 여기서 그 schema의 타입을 가져오면 zod의 스키마
 * 타입 추론이 자기 자신을 참조하는 순환 타입 에러(TS2456)가 됩니다.
 */
export interface ScenarioContentItem {
  id: string;
  type: "chat" | "userChat" | "action" | "asset";
  value: string;
  assetImageFileId?: string | number | null;
}

export interface ScenarioFormValue {
  description?: string;
  contents?: ScenarioContentItem[];
}

/** decodeScenarioContent는 항상 채워서 반환하므로 optional이 아닌 필수 필드로 못 박습니다. */
interface DecodedScenarioContent {
  contents: ScenarioContentItem[];
}

/**
 * 역슬래시 자체와 이 블록의 구분자로 쓰이는 문자를 이스케이프합니다.
 * 기존 역슬래시부터 먼저 이스케이프해야, 뒤이어 넣는 구분자용 역슬래시가
 * 이중으로 다시 이스케이프되지 않습니다.
 */
const escapeDelimiter = (value: string, delimiter: string) =>
  value.replaceAll("\\", "\\\\").replaceAll(delimiter, `\\${delimiter}`);

/** {{user}} 등 인라인 토큰을 표시용 텍스트로 되돌립니다. 실제 유저명 치환은 아직 미구현이라 토큰 그대로 남깁니다. */
const segmentsToText = (segments: PlatSegment[]) =>
  segments
    .map((segment) => (segment.type === "TEXT" ? segment.value : "{{user}}"))
    .join("");

/**
 * 폼에 입력된 시나리오 데이터를 .plat v2 마크업 문자열로 합칩니다.
 * 백엔드 scenarios[].content(자유 텍스트, 최대 5000자)로 그대로 전송됩니다.
 * description/난이도는 이제 다루지 않습니다(설명은 별도 필드, 난이도는 더 이상 보내지 않음).
 */
export const encodeScenarioContent = (scenario: ScenarioFormValue): string => {
  const blocks = (scenario.contents ?? []).map((item) => {
    // asset의 value는 미리보기용 base64/URL이라 그대로 보낼 수 없으므로 fileId를 씁니다.
    const value =
      item.type === "asset"
        ? String(item.assetImageFileId ?? "").trim()
        : item.value?.trim();

    if (!value) return "";

    // 값 안에 구분자 문자가 그대로 있으면 findBlockEnd가 첫 번째로 만나는 걸
    // 닫는 기호로 오인해 블록이 중간에서 끊깁니다. 역슬래시로 이스케이프해서
    // (기존 역슬래시도 먼저 이스케이프) 사용자가 입력한 글자를 한 글자도 안
    // 바꾸면서 파싱만 안전하게 만듭니다. parsePlat/parseInlineTokens이 짝을
    // 이뤄 다시 원래 글자로 되돌립니다.
    switch (item.type) {
      case "action":
        return `*${escapeDelimiter(value, "*")}*`;
      case "chat":
        return `"${escapeDelimiter(value, '"')}"`;
      case "userChat":
        return `'${escapeDelimiter(value, "'")}'`;
      case "asset":
        return `{{img:${value}}}`;
      default:
        return "";
    }
  });

  return blocks.filter(Boolean).join("\n\n");
};

/**
 * 백엔드가 돌려준 .plat v2 문자열을 시나리오 수정 폼이 바로 쓸 수 있는 형태로 되돌립니다.
 * description/난이도는 이제 다루지 않습니다. 과거 데이터에 남아있는 [[f=...]] 같은
 * 메타 블록은 그냥 건너뜁니다(더 이상 의미를 해석하지 않음).
 */
export const decodeScenarioContent = (
  content: string,
): DecodedScenarioContent => {
  const blocks = parsePlat(content);

  const contents: ScenarioContentItem[] = [];

  blocks.forEach((block: PlatBlock, index) => {
    if (block.type === "META") {
      return;
    }

    const id = `restored-${index}`;

    if (block.type === "NARRATIVE") {
      contents.push({
        id,
        type: "action",
        value: segmentsToText(block.segments),
      });
    } else if (block.type === "DIALOGUE") {
      contents.push({
        id,
        type: "chat",
        value: segmentsToText(block.segments),
      });
    } else if (block.type === "USER_DIALOGUE") {
      contents.push({
        id,
        type: "userChat",
        value: segmentsToText(block.segments),
      });
    } else if (block.type === "ASSET_IMG") {
      // 미리보기는 fileId로 렌더링용 URL을 다시 만들어 채웁니다.
      contents.push({
        id,
        type: "asset",
        value: getResourceImageUrl(block.code, "UNIVERSE_ASSET"),
        assetImageFileId: block.code,
      });
    }
  });

  return { contents };
};
