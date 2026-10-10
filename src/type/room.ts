import type { AppLocale } from "@/i18n/config";
import type { ChatResponseLength } from "@/type/chat";

/** 백엔드 LanguageType. 채팅방 응답 언어를 가리킵니다. */
export type RoomLanguage = "KO" | "EN" | "JA" | "ZH" | "TH" | "VI";

/**
 * 프롬프트 배수. 백엔드가 숫자로 직렬화하므로 요청·응답 모두 숫자를 씁니다.
 * 허용 집합 밖의 값은 서버가 기본값(1.0)으로 되돌립니다.
 */
export type PromptMultiplier = 0.8 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export const PROMPT_MULTIPLIERS: PromptMultiplier[] = [
  0.8, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5,
];

/** 앱 로케일을 채팅방 언어 코드로 변환합니다. */
export const toRoomLanguage = (locale: AppLocale): RoomLanguage =>
  locale.toUpperCase() as RoomLanguage;

/** 채팅방 목록에서 내용을 가린 이유. 성인인증이 만료된 성인 세계관 방이다. */
export type RoomLockReason = "ADULT_VERIFICATION_REQUIRED";

/** 채팅방 목록의 한 줄 */
export interface ThumbnailRoom {
  roomId: string;
  /** locked 면 null. */
  title: string | null;
  thumbnailUrl: string | null;
  personaName: string;
  /** 아직 주고받은 말이 없는 방은 null. */
  lastMessage: string | null;
  lastUsedAt: string | null;
  isPinned: boolean;
  /** 방을 열 때 남긴 캐릭터 이름. locked 면 null. */
  characterName: string | null;
  /** 캐릭터(세계관)가 지워진 방. 대화는 볼 수 있고 새 대화만 막힌다. */
  isClosed: boolean;
  /**
   * 내용을 가린 방. 목록에는 남지만 title·characterName·thumbnailUrl·lastMessage 가 null 로 오고,
   * 들어가면 403 ADULT_CONTENT_RESTRICTED 다. 다시 성인인증하면 풀린다.
   */
  locked?: RoomLockReason | null;
}

/** 채팅방 단건 */
export interface Room {
  roomId: string;
  /** 이 방이 붙어 있는 세계관. 캐릭터 이름·프로필은 세계관 상세에서 가져옵니다. */
  universeId: string;
  /** 이 방에서 쓰는 페르소나. 페르소나 선택 모달의 현재 선택 상태로 씁니다. */
  personaId: string;
  multiplier: PromptMultiplier;
  /**
   * 방에서 고른 답변 길이. 서버의 배수 0.8/1.0/2.0 에 대응한다.
   * 예전에 직접 정한 배수(1.5 등)는 세 선택지에 없어 null 이고, 이때 실제 배수는 multiplier 로 온다.
   */
  responseLength?: ChatResponseLength | null;
  /** AI 가 대화를 요약해 쌓은 장기기억. 사용자가 고칠 수 있고 다음 요약은 고친 내용 위에 합쳐진다. */
  memory: string;
  /** 사용자가 적은 유저노트. 매 턴 프롬프트에 들어간다. */
  userNote: string;
  /** 방을 열 때 남긴 캐릭터 이름. 캐릭터가 지워져도 이 이름을 보여 준다. */
  characterName: string;
  /** 캐릭터(세계관)가 지워진 방. 대화는 볼 수 있고 새 대화·다시 만들기·신고는 막힌다. */
  closed: boolean;
  /** 이 방의 대화 언어. PATCH /rooms/{roomId}/language 로 바꾼다. */
  language: string;
  /** 켜면 응답 끝에 추천 문장 3개가 함께 온다. */
  answerRecommendationEnabled: boolean;
  /**
   * 성인 세계관 에셋 이미지의 서명 URL(파일 ID → URL). 대화 속 {{img:파일 ID}} 를 그릴 때 먼저 쓴다 —
   * 성인 에셋은 보호 경로라 파일 ID 로 만든 주소로는 열리지 않는다. 일반 세계관은 비어 있다.
   */
  assetImageUrls?: Record<string, string>;
}

export type MessageSender = "USER" | "AI";

/** 채팅방 메시지 한 건 */
export interface RoomMessage {
  messageId: string;
  type: MessageSender;
  content: string;
}

/** 채팅방 생성 요청 */
export interface CreateRoomRequest {
  universeId: string;
  personaId: string;
  scenarioId: string;
}
