export interface AIModelType {
  /** ChatModelOption.name(enum 이름). 채팅 요청에 이 값을 보냅니다. */
  id: string;
  /** 선택 버튼에 짧게 보여줄 이름 (예: "Sonnet 4.6") */
  name: string;
  /** 목록에 보여줄 전체 이름 (예: "Claude Sonnet 4.6") */
  label: string;
  provider: ChatModelOption["provider"];
  icon: string; // 아이콘 경로 또는 이름
  /** chatUI 번역 키. 있으면 서버 설명보다 우선합니다(서버 설명은 한국어 한 벌뿐이라). */
  descriptionKey?: string;
  /** 번역 키가 없는 모델을 위한 서버 설명 문구. */
  description?: string;
  price?: number; // 현재 가격 (할인가 포함)
  originalPrice?: number; // 원래 가격 (할인이 있을 때만)
  discountRate?: number; // 할인율 (단위: %)
  unit?: string; // 단위 (예: "채팅")
}

/** 캐릭터 응답 타입 */
interface AssistantMessageType {
  id: string;
  role: "assistant";
  characterName: string;
  profileImage: string;
  content: string; // "대사" {img:...} 지문 형태
  /** 아직 스트림으로 받는 중인 응답. 반쯤 온 원문을 그리는 방식과 버튼 노출이 달라집니다. */
  isStreaming?: boolean;
}

/** 유저 응답 타입 */
interface UserMessageType {
  id: string;
  role: "user";
  content: string; // 일반 텍스트
}

/** 최종 메시지 유니온 타입 */
export type ChatMessageType = AssistantMessageType | UserMessageType;

/** 채팅방 에셋 갤러리 이미지 항목 */
export interface ChatAssetGalleryItem {
  id: string;
  imageUrl: string;
  isLocked: boolean;
}

/** 채팅방 에셋 갤러리 목록 요약 */
export interface ChatAssetGalleryResponse {
  items: ChatAssetGalleryItem[];
  totalCount: number;
  visibleCount: number;
}

/** 채팅 모델 카탈로그 한 줄 */
export interface ChatModelOption {
  /** enum 이름 (예: CLAUDE_SONNET_4_6) */
  name: string;
  /** 제공사 모델 식별자 (예: claude-sonnet-4-6). 채팅 요청에 이 값이 아니라 name을 보냅니다. */
  value: string;
  provider: "ANTHROPIC" | "GOOGLE" | "OPENAI";
  /** 화면에 그대로 쓰는 모델 이름 (예: Claude Sonnet 4.6) */
  displayName: string;
  /** 서버가 주는 모델 설명. 한국어 한 벌만 내려옵니다. */
  description: string;
  /** 한 턴 기본 크레딧 비용 */
  creditCost: number;
}

/** 프롬프트 배수 선택지 */
export interface PromptMultiplierOption {
  /** enum 이름 (예: X1_5) */
  name: string;
  /** 배수 값 (예: 1.5) */
  value: number;
}

/** GET /chat/models 응답 */
export interface ChatCatalog {
  models: ChatModelOption[];
  multipliers: PromptMultiplierOption[];
}

/** POST /chat 요청 */
export interface ChatStartRequest {
  /** 클라이언트가 만드는 턴 식별자. 같은 값으로 재요청하면 중복 생성되지 않습니다. */
  chatTurnId: string;
  context: {
    roomId: string;
    /** 세계관 안의 캐릭터 ID. UniverseDetailResponse.character.universeCharacterId 값입니다. */
    universeCharacterId: string;
    personaId: string;
  };
  generation: {
    /** 최대 4000자 */
    message: string;
    /** ChatModelOption.name 값 */
    model: string;
    /** 배수 값(숫자). 허용 집합 밖이면 서버가 1.0으로 되돌립니다. */
    multiplier: number;
  };
}

/** POST /chat 응답. 이 turnId로 SSE를 구독합니다. */
export interface ChatStartResponse {
  turnId: string;
}
