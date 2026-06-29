// 시나리오 프리뷰에 쌓이는 콘텐츠의 렌더링 종류를 구분합니다.
export type ScenarioType = "chat" | "userChat" | "action" | "asset";

// 개별 시나리오 콘텐츠 아이템 정의
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
