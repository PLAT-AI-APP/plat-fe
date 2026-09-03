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

/** 채팅방 목록의 한 줄 */
export interface ThumbnailRoom {
  roomId: string;
  title: string;
  thumbnailUrl: string | null;
  lastMessage: string;
}

/** 채팅방 단건 */
export interface Room {
  roomId: string;
  multiplier: PromptMultiplier;
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
