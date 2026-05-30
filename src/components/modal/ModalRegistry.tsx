import { ComponentType } from "react";
import { ModalTypeMap } from "@/store/useModalStore";

// 각 모달 컴포넌트 임포트
import AddLanguageModal from "./AddLanguageModal";
import ChattingStartModal from "./ChattingStartModal";
import { FollowModal } from "./FollowModal";
import LoginModal from "./LoginModal";
import PersonaAddModal from "./PersonaAddModal";
import ProfileEditModal from "./ProfileEditModal";
import StorageModal from "./StorageModal";
import TagAddModal from "./TagAddModal";
import TagSuggestionsModal from "./TagSuggestionsModal";
import UserNoteModal from "./UserNoteModal";
import PersonaModal from "./persona";
import FindPasswordModal from "./find-password";

export const MODAL_COMPONENTS: {
  [K in keyof ModalTypeMap]: ComponentType<ModalTypeMap[K]>;
} = {
  ADD_LANGUAGE: AddLanguageModal,
  CHATTING_START: ChattingStartModal,
  FIND_PASSWORD: FindPasswordModal,
  FOLLOW: FollowModal,
  LOGIN: LoginModal,
  PERSONA_ADD: PersonaAddModal,
  PROFILE_EDIT: ProfileEditModal,
  STORAGE: StorageModal,
  TAG_ADD: TagAddModal,
  TAG_SUGGESTIONS: TagSuggestionsModal,
  USER_NOTE: UserNoteModal,
  PERSONA: PersonaModal,
};
