import type { AppLocale } from "@/i18n/config";

/** 백엔드 LanguageType. 채팅방 응답 언어를 가리킵니다. */
export type RoomLanguage = "KO" | "EN" | "JA" | "ZH" | "TH" | "VI";

/**
 * 프롬프트 배수. 백엔드가 숫자로 직렬화하므로 요청·응답 모두 숫자를 씁니다.
 * 허용 집합 밖의 값은 서버가 기본값(1.0)으로 되돌립니다.
 */
export type PromptMultiplier = 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export const PROMPT_MULTIPLIERS: PromptMultiplier[] = [
  1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5,
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
  /** AI 가 대화를 요약해 쌓은 장기기억. 사용자가 고칠 수 있고 다음 요약은 고친 내용 위에 합쳐진다. */
  memory: string;
  /** 사용자가 적은 유저노트. 매 턴 프롬프트에 들어간다. */
  userNote: string;
  /** 방을 열 때 남긴 캐릭터 이름. 캐릭터가 지워져도 이 이름을 보여 준다. */
  characterName: string;
  /** 캐릭터(세계관)가 지워진 방. 대화는 볼 수 있고 새 대화·다시 만들기·신고는 막힌다. */
  closed: boolean;
  /** 채팅 요청에 쓰는 세계관 안 캐릭터 ID. 닫힌 방은 null. */
  universeCharacterId: string | null;
  /** 캐릭터 프로필 이미지(정사각 140px). 세계관 상세를 부르지 못하는 방(운영 심사 중)도 이 값으로 그린다. */
  characterProfileImageUrl: string | null;
  /**
   * 제작자가 탈퇴하며 남긴 캐릭터가 운영 심사를 기다리는 방. 대화는 이어지지만
   * 세계관 상세는 닫혀 있어(404) 부르지 않고, 이름은 characterName 스냅샷을 쓴다.
   */
  handoverPending: boolean;
  /** 이 방의 대화 언어. PATCH /rooms/{roomId}/language 로 바꾼다. */
  language: string;
  /** 켜면 응답 끝에 추천 문장 3개가 함께 온다. */
  answerRecommendationEnabled: boolean;
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
