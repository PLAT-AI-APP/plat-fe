import { CharacterScenario } from "./character";

export interface GlobalModalProps {
  onClose: () => void;
  stackIndex?: number;
}

export type AddLanguageModalProps = GlobalModalProps;

export interface ChattingStartModalProps extends GlobalModalProps {
  scenarioList: CharacterScenario[];
  setCurrentScenario: (scenario: CharacterScenario) => void;
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

export type StorageModalProps = GlobalModalProps;

export type TagAddModalProps = GlobalModalProps;

export type TagSuggestionsModalProps = GlobalModalProps;

export type UserNoteModalProps = GlobalModalProps;

export type PersonaModalProps = GlobalModalProps;

export interface NoticeDialogModalProps extends GlobalModalProps {
  label: string;
  description?: string;
  confirmText?: string;
}
