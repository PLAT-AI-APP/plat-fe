import { create } from "zustand";
import {
  AddLanguageModalProps,
  ChattingStartModalProps,
  FindPasswordModalProps,
  FollowModalProps,
  LoginModalProps,
  PersonaAddModalProps,
  ProfileEditModalProps,
  StorageModalProps,
  TagAddModalProps,
  TagSuggestionsModalProps,
  UserNoteModalProps,
  PersonaModalProps,
  NoticeDialogModalProps,
} from "@/type/modal";
import { useAuthStore } from "./useAuthStore";

// 모달 이름과 Props를 매핑 (이곳에 새 모달을 추가하세요)
export type ModalTypeMap = {
  ADD_LANGUAGE: AddLanguageModalProps;
  CHATTING_START: ChattingStartModalProps;
  FIND_PASSWORD: FindPasswordModalProps;
  FOLLOW: FollowModalProps;
  LOGIN: LoginModalProps;
  PERSONA_ADD: PersonaAddModalProps;
  PROFILE_EDIT: ProfileEditModalProps;
  STORAGE: StorageModalProps;
  TAG_ADD: TagAddModalProps;
  TAG_SUGGESTIONS: TagSuggestionsModalProps;
  USER_NOTE: UserNoteModalProps;
  PERSONA: PersonaModalProps;
  NOTICE_DIALOG: NoticeDialogModalProps;
};

type ModalInstanceUnion = {
  [K in keyof ModalTypeMap]: {
    type: K;
    props: Omit<ModalTypeMap[K], "onClose">;
  };
}[keyof ModalTypeMap];

// 스택에 저장될 데이터 구조
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
    set((state) => {
      const isLoggedIn = useAuthStore.getState().isLoggedIn;
      const requiresAuthModalTypes: (keyof ModalTypeMap)[] = [
        "PERSONA",
        "PERSONA_ADD",
        "PROFILE_EDIT",
        "FOLLOW",
        "USER_NOTE",
        "STORAGE",
        "TAG_ADD",
        "TAG_SUGGESTIONS",
      ];

      if (!isLoggedIn && requiresAuthModalTypes.includes(type)) {
        return {
          modals: [
            ...state.modals,
            {
              type: "NOTICE_DIALOG",
              props: {
                label: "로그인이 필요해요",
                description: "로그인 후 이용할 수 있는 기능입니다.",
                confirmText: "로그인",
              },
            } as ModalInstanceUnion,
          ],
        };
      }

      return {
        modals: [...state.modals, { type, props } as ModalInstanceUnion],
      };
    }),

  closeModal: () =>
    set((state) => ({
      modals: state.modals.slice(0, -1),
    })),

  clearModals: () => set({ modals: [] }),
}));
