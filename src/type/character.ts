// 기초 리터럴 타입 분리
export type ScenarioType = "chat" | "action" | "asset";

// 개별 콘텐츠 아이템 정의
export interface ScenarioContentItem {
  id: number;
  type: ScenarioType;
  value: string;
}

// 시나리오 그룹 정의
export interface ScenarioItem {
  name: string;
  contents: ScenarioContentItem[];
}

// 에셋 아이템 정의
export interface CharacterAsset {
  assetFile: File | null;
  assetImage: string;
  assetName: string;
  assetSituation: string;
}

// 메인 폼 스키마
export interface CharacterCreateFormValues {
  // 프로필
  representativeImage: string;
  title: string;
  name: string;
  characterIntroduce: string;

  // 상세 설정
  characterDetailSetting: string;

  // 탭별 데이터 (배열)
  asset: CharacterAsset[];
  scenarios: ScenarioItem[];
  tagList: { name: string }[];

  // 메타 설정
  isPublic: boolean;
  characterDescription: string;
  tendency: string;
  category: string;
}
