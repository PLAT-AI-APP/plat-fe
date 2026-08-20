import type { HashtagCategory } from "@/api/hashtag/getHashtagList";

// 태그 사이드바/추가 모달에서 카테고리를 폴더로 묶어 보여줄 때의 노출 순서
export const HASHTAG_CATEGORY_ORDER: HashtagCategory[] = [
  "GENRE",
  "SPECIES",
  "CHARACTER",
  "APPEARANCE",
  "PERSONALITY",
  "RELATIONSHIP",
  "NARRATIVE",
  "JOB",
  "SPECIAL",
];

// 카테고리별 폴더 제목 번역 키 (tagSidebar 네임스페이스)
export const HASHTAG_CATEGORY_FOLDER_TITLE_KEYS: Record<
  HashtagCategory,
  string
> = {
  GENRE: "folderGenre",
  SPECIES: "folderSpecies",
  CHARACTER: "folderCharacter",
  APPEARANCE: "folderAppearance",
  PERSONALITY: "folderPersonality",
  RELATIONSHIP: "folderRelationship",
  NARRATIVE: "folderNarrative",
  JOB: "folderJob",
  SPECIAL: "folderSpecial",
};
