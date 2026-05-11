import { CharacterScenario } from "./character";

export interface GlobalModalProps {
  onClose: () => void;
}

export interface AddLanguageModalProps {
  onClose: () => void;
}

export interface ChattingStartModalProps {
  onClose: () => void;
  scenarioList: CharacterScenario[];
  setCurrentScenario: (scenario: CharacterScenario) => void;
  currentScenario: CharacterScenario | undefined;
}

export interface FollowModalProps {
  onClose: () => void;
  // userId: string;
  activeTab: "followers" | "following";
}

export interface LoginModalProps {
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null> | undefined;
}

export interface PersonaAddModalProps {
  onClose: () => void;
  isEditMode?: boolean;
  personaId?: number;
}

export interface ProfileEditModalProps {
  onClose: () => void;
}

export interface StorageModalProps {
  onClose: () => void;
}

export interface TagAddModalProps {
  onClose: () => void;
}

export interface TagSuggestionsModalProps {
  onClose: () => void;
}

export interface UserNoteModalProps {
  onClose: () => void;
}

export interface PersonaModalProps {
  onClose: () => void;
}
