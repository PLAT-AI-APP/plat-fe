import { create } from "zustand";
import {
  AddLanguageModalProps,
  ChattingStartModalProps,
  FollowModalProps,
  LoginModalProps,
  PersonaAddModalProps,
  ProfileEditModalProps,
  StorageModalProps,
  TagAddModalProps,
  TagSuggestionsModalProps,
  UserNoteModalProps,
  PersonaModalProps,
} from "@/type/modal";

// 3. 모달 이름과 Props를 매핑 (이곳에 새 모달을 추가하세요)
export type ModalTypeMap = {
  ADD_LANGUAGE: AddLanguageModalProps;
  CHATTING_START: ChattingStartModalProps;
  FOLLOW: FollowModalProps;
  LOGIN: LoginModalProps;
  PERSONA_ADD: PersonaAddModalProps;
  PROFILE_EDIT: ProfileEditModalProps;
  STORAGE: StorageModalProps;
  TAG_ADD: TagAddModalProps;
  TAG_SUGGESTIONS: TagSuggestionsModalProps;
  USER_NOTE: UserNoteModalProps;
  PERSONA: PersonaModalProps;
};

type ModalInstanceUnion = {
  [K in keyof ModalTypeMap]: {
    type: K;
    props: Omit<ModalTypeMap[K], "onClose">;
  };
}[keyof ModalTypeMap];

// 4. 스택에 저장될 데이터 구조
export interface ModalInstance<T extends keyof ModalTypeMap> {
  type: T;
  // 저장될 때부터 onClose가 없는 타입을 저장하도록 설정
  props: Omit<ModalTypeMap[T], "onClose">;
}

interface ModalState {
  modals: ModalInstance<keyof ModalTypeMap>[]; // 여러 타입의 모달이 섞인 배열

  // Generic을 사용하여 type에 맞는 props만 넣을 수 있도록 제한
  openModal: <T extends keyof ModalTypeMap>(
    type: T,
    props?: Omit<ModalTypeMap[T], "onClose">,
  ) => void;

  closeModal: () => void;
  clearModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modals: [],

  openModal: (type, props) =>
    set((state) => ({
      modals: [...state.modals, { type, props } as ModalInstanceUnion],
    })),

  closeModal: () =>
    set((state) => ({
      modals: state.modals.slice(0, -1),
    })),

  clearModals: () => set({ modals: [] }),
}));
