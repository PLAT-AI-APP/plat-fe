// 기초 리터럴 타입 분리
export type ScenarioType = "chat" | "action" | "asset";

// 개별 콘텐츠 아이템 정의
export interface ScenarioContentItem {
  id: string;
  type: ScenarioType;
  value: string;
}

export interface CharacterScenario {
  scenarioId: string;
  name: string;
  situation: string;
  firstDialogue: string;
  lang: string;
}
