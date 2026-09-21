import { CharacterScenario } from "./character";
import { Persona } from "./persona";

export interface GlobalModalProps {
  onClose: () => void;
  stackIndex?: number;
}

export type AddLanguageModalProps = GlobalModalProps;

export interface ChattingStartModalProps extends GlobalModalProps {
  universeId: string;
  scenarioList: CharacterScenario[];
  currentScenario: CharacterScenario | undefined;
}

export interface FollowModalProps extends GlobalModalProps {
  userId: string;
  nickname?: string;
  isOwnProfile?: boolean;
  activeTab: "followers" | "following";
}

export type FindPasswordModalProps = GlobalModalProps;

export interface LoginModalProps extends GlobalModalProps {
  triggerRef: React.RefObject<HTMLElement | null> | undefined;
}

export interface PersonaAddModalProps extends GlobalModalProps {
  isEditMode?: boolean;
  personaId?: string;
  name?: string;
  description?: string;
}

export type ProfileEditModalProps = GlobalModalProps;

export type TagAddModalProps = GlobalModalProps;

export type TagSuggestionsModalProps = GlobalModalProps;

export interface UserNoteModalProps extends GlobalModalProps {
  roomId: string;
}

export interface CommentReportModalProps extends GlobalModalProps {
  commentId: string;
}

export interface RefundRequestModalProps extends GlobalModalProps {
  orderUid: string;
}

export interface PersonaModalProps extends GlobalModalProps {
  /** 있으면 "관리" 대신 "선택" 모드로 동작합니다 — 항목 클릭 시 이 콜백을 부르고 모달을 닫습니다. */
  onSelectPersona?: (persona: Persona) => void;
  /** 선택 모드에서 현재 골라져 있는 페르소나. 목록에서 체크 표시로 보여줍니다. */
  currentPersonaId?: string;
}
