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
  /** 방을 만들 때 서버가 첫 메시지로 넣어 둔 시나리오. 캐릭터 응답이 아니라 삭제·다시하기 대상이 아닙니다. */
  isScenario?: boolean;
  /** 다시 만들기로 곧 가려질 옛 답. 흐려지며 사라지는 연출만 하고 잠시 뒤 목록에서 빠집니다. */
  isDissolving?: boolean;
}

/** 유저 응답 타입 */
interface UserMessageType {
  id: string;
  role: "user";
  content: string; // 일반 텍스트
  /** 다시 만들기로 곧 가려질 뒤 대화. 흐려지며 사라지는 연출만 하고 잠시 뒤 목록에서 빠집니다. */
  isDissolving?: boolean;
}

/** 최종 메시지 유니온 타입 */
export type ChatMessageType = AssistantMessageType | UserMessageType;

/** 채팅방 지나온 대화(장기기억) 항목 */
export interface ChatMemoryEntry {
  content: string;
  createdAt: string;
  id: string;
  turn: number;
}

/**
 * 채팅방 에셋 갤러리 이미지 항목.
 *
 * 해금은 이 방의 캐릭터 답변에 그 에셋이 한 번이라도 나온 것이다. 잠긴 항목은 서버가 파일·주소·이름·상황을
 * 비워 준다 — 흐림 처리만으로는 원본 주소가 그대로 새어 나가기 때문이다.
 */
export interface ChatAssetGalleryItem {
  /** 세계관 에셋 id */
  id: string;
  fileId: string | null;
  imageUrl: string | null;
  name: string | null;
  situation: string | null;
  isLocked: boolean;
  unlockedAt: string | null;
}

/** 채팅방 에셋 갤러리. 해금된 것(해금 순) 다음 잠긴 것(에셋 순)으로 온다. */
export interface ChatAssetGalleryResponse {
  items: ChatAssetGalleryItem[];
  /** 세계관 에셋 수 */
  totalCount: number;
  /** 그중 해금된 수 */
  visibleCount: number;
}

/** 채팅 모델 카탈로그 한 줄 */
export interface ChatModelOption {
  /** enum 이름 (예: CLAUDE_SONNET_5_5) */
  name: string;
  /** 제공사 모델 식별자 (예: claude-sonnet-5-5). 채팅 요청에 이 값이 아니라 name을 보냅니다. */
  value: string;
  provider: "ANTHROPIC" | "GOOGLE" | "OPENAI";
  /** 화면에 그대로 쓰는 모델 이름 (예: Claude Sonnet 4.6) */
  displayName: string;
  /** 서버가 주는 모델 설명. 한국어 한 벌만 내려옵니다. */
  description: string;
  /**
   * 응답 형식별 한 턴 예상 노트("약 N노트"). 요금은 쓴 토큰만큼이라 실제 차감은 대화 길이에 따라 다르다.
   */
  formatNoteEstimates: FormatNoteEstimate[];
}

/** 응답 형식 하나의 기준 대화 한 턴 노트 */
export interface FormatNoteEstimate {
  /** ResponseFormatOption.code */
  responseFormat: string;
  estimatedNotes: number;
}

/**
 * 응답 형식(채팅형·소설형 등). 한 턴의 분량·문체·출력 상한을 정하고, 요금은 쓴 토큰만큼이라 형식이 곧 가격대다.
 * 이름·설명은 서버가 한국어 한 벌로 준다.
 */
export interface ResponseFormatOption {
  code: string;
  name: string;
  description: string;
}

/** GET /chat/models 응답 */
export interface ChatCatalog {
  models: ChatModelOption[];
  /** 켜진 응답 형식 전체. 방에서 고를 수 있는 형식은 방 정보의 allowedResponseFormats 다. */
  responseFormats: ResponseFormatOption[];
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
    /** ChatModelOption.name 값. 분량·요금은 방이 고른 응답 형식을 따른다(PATCH /rooms/{id}/response-format). */
    model: string;
  };
}

/**
 * POST /chat/regenerate 요청. 방의 어느 AI 답이든 다시 만들 수 있고, 확정되면 그 뒤 대화는 지워진다.
 * AI 답이 아니거나 짝인 사용자 메시지가 없으면 400, 이전 턴이 아직 생성 중이면 409(CHAT_TURN_IN_PROGRESS)다.
 * 입력은 서버가 그 답의 짝인 사용자 메시지 원문을 쓴다.
 */
export interface ChatRegenerateRequest {
  chatTurnId: string;
  context: ChatStartRequest["context"];
  /** 다시 만들 AI 답 메시지 id */
  messageId: string;
  generation: Omit<ChatStartRequest["generation"], "message">;
}

/** POST /chat 응답. 이 turnId로 SSE를 구독합니다. */
export interface ChatStartResponse {
  turnId: string;
}
