// .env의 NEXT_PUBLIC_API_MOCKING 하나로 목업을 켜고 끕니다.
// 표기 차이로 목업이 안 켜졌다고 오해하지 않도록 자주 쓰는 값들을 함께 허용합니다.
// 브라우저(MSWProvider)와 서버 컴포넌트(문서 사이트 데이터 레이어)가 같은 판단을 쓰도록 여기 둔다.
const MOCKING_ENABLED_VALUES = ["enabled", "true", "1", "on"];

export const isMockingEnabled = MOCKING_ENABLED_VALUES.includes(
  (process.env.NEXT_PUBLIC_API_MOCKING ?? "").trim().toLowerCase(),
);
