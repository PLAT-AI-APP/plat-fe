import { getResourceImageUrl } from "@/lib/file";
import { PlatBlock, PlatSegment, parsePlat } from "@/lib/platParse";
import {
  CharacterCreateFormValues,
  ScenarioDifficulty,
} from "@/schema/character.schema";

type ScenarioFormValue = CharacterCreateFormValues["scenarios"][number];
type ScenarioContentItem = ScenarioFormValue["contents"][number];
type DecodedScenarioContent = Pick<
  ScenarioFormValue,
  "description" | "difficulty" | "contents"
>;

const DIFFICULTY_CODE: Record<ScenarioDifficulty, string> = {
  EASY: "E",
  NORMAL: "N",
  HARD: "H",
  VERY_HARD: "V",
};

const DIFFICULTY_FROM_CODE: Record<string, ScenarioDifficulty> = {
  E: "EASY",
  N: "NORMAL",
  H: "HARD",
  V: "VERY_HARD",
};

/** description에 메타 블록의 종료 시퀀스가 그대로 섞여 들어가면 파싱이 깨지므로 방어합니다. */
const sanitizeMetaValue = (value: string) => value.replace(/\]\]/g, "] ]");

/** {{user}} 등 인라인 토큰을 표시용 텍스트로 되돌립니다. 실제 유저명 치환은 아직 미구현이라 토큰 그대로 남깁니다. */
const segmentsToText = (segments: PlatSegment[]) =>
  segments
    .map((segment) => (segment.type === "TEXT" ? segment.value : "{{user}}"))
    .join("");

/**
 * 폼에 입력된 시나리오 데이터를 .plat v2 마크업 문자열로 합칩니다.
 * 백엔드 scenarios[].content(자유 텍스트, 최대 5000자)로 그대로 전송됩니다.
 */
export const encodeScenarioContent = (scenario: ScenarioFormValue): string => {
  const description = scenario.description?.trim();
  const metaDesc = description ? `[[d=${sanitizeMetaValue(description)}]]` : "";

  const difficulty = scenario.difficulty;
  const metaDifficulty = difficulty
    ? `[[f=${DIFFICULTY_CODE[difficulty]}]]`
    : "";

  const blocks = (scenario.contents ?? []).map((item) => {
    // asset의 value는 미리보기용 base64/URL이라 그대로 보낼 수 없으므로 fileId를 씁니다.
    const value =
      item.type === "asset"
        ? String(item.assetImageFileId ?? "").trim()
        : item.value?.trim();

    if (!value) return "";

    switch (item.type) {
      case "action":
        return `*${value}*`;
      case "chat":
        return `"${value}"`;
      case "userChat":
        return `'${value}'`;
      case "asset":
        return `{{img:${value}}}`;
      default:
        return "";
    }
  });

  return [metaDesc, metaDifficulty, ...blocks].filter(Boolean).join("\n\n");
};

/**
 * 백엔드가 돌려준 .plat v2 문자열을 시나리오 수정 폼이 바로 쓸 수 있는 형태로 되돌립니다.
 */
export const decodeScenarioContent = (
  content: string,
): DecodedScenarioContent => {
  const blocks = parsePlat(content);

  let description = "";
  let difficulty: ScenarioDifficulty = "NORMAL";
  const contents: ScenarioContentItem[] = [];

  blocks.forEach((block: PlatBlock, index) => {
    if (block.type === "META") {
      if (block.key === "d") description = block.value;
      if (block.key === "f") {
        difficulty = DIFFICULTY_FROM_CODE[block.value] ?? "NORMAL";
      }
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

  return { description, difficulty, contents };
};
