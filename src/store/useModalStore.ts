import { create } from "zustand";
import {
  AddLanguageModalProps,
  ChattingStartModalProps,
  FindPasswordModalProps,
  FollowModalProps,
  LoginModalProps,
  PersonaAddModalProps,
  PersonaModalProps,
  ProfileEditModalProps,
  StorageModalProps,
  TagAddModalProps,
  TagSuggestionsModalProps,
  UserNoteModalProps,
} from "@/type/modal";
import { useAuthStore } from "./useAuthStore";
import { useDialogStore } from "./useDialogStore";

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
};

type ModalInstanceUnion = {
  [K in keyof ModalTypeMap]: {
    type: K;
    props: Omit<ModalTypeMap[K], "onClose">;
  };
}[keyof ModalTypeMap];

export interface ModalInstance<T extends keyof ModalTypeMap> {
  type: T;
  props: Omit<ModalTypeMap[T], "onClose">;
}

interface ModalState {
  modals: ModalInstance<keyof ModalTypeMap>[];
  isNextNavigationAllowed: boolean;

  openModal: <T extends keyof ModalTypeMap>(
    type: T,
    props?: Omit<ModalTypeMap[T], "onClose">,
  ) => void;

  allowNextNavigation: () => void;
  consumeNextNavigationAllowance: () => boolean;
  closeModal: () => void;
  clearModals: () => void;
}

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

export const useModalStore = create<ModalState>((set, get) => ({
  modals: [],
  isNextNavigationAllowed: false,

  openModal: (type, props) => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;

    if (!isLoggedIn && requiresAuthModalTypes.includes(type)) {
      // 로그인 필요 안내는 모달 스택이 아니라 다이얼로그 매니저로 열어 두 레이어의 책임을 분리합니다.
      useDialogStore.getState().openDialog("LOGIN_REQUIRED", {
        label: "dialog.loginRequired.title",
        description: "dialog.loginRequired.description",
        confirmText: "dialog.loginRequired.confirm",
        onConfirm: () => {
          get().openModal("LOGIN", { triggerRef: undefined });
        },
      });
      return;
    }

    set((state) => ({
      modals: [...state.modals, { type, props } as ModalInstanceUnion],
    }));
  },

  allowNextNavigation: () => {
    set({ isNextNavigationAllowed: true });

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        set({ isNextNavigationAllowed: false });
      }, 1000);
    }
  },

  consumeNextNavigationAllowance: () => {
    const isAllowed = get().isNextNavigationAllowed;

    if (isAllowed) {
      set({ isNextNavigationAllowed: false });
    }

    return isAllowed;
  },

  closeModal: () =>
    set((state) => ({
      modals: state.modals.slice(0, -1),
    })),

  clearModals: () => set({ modals: [] }),
}));
