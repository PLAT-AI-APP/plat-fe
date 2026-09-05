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
  TagAddModalProps,
  TagSuggestionsModalProps,
  UserNoteModalProps,
} from "@/type/modal";
import { useAuthStore } from "./useAuthStore";

export type ModalTypeMap = {
  ADD_LANGUAGE: AddLanguageModalProps;
  CHATTING_START: ChattingStartModalProps;
  FIND_PASSWORD: FindPasswordModalProps;
  FOLLOW: FollowModalProps;
  LOGIN: LoginModalProps;
  PERSONA_ADD: PersonaAddModalProps;
  PROFILE_EDIT: ProfileEditModalProps;
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
  "TAG_ADD",
  "TAG_SUGGESTIONS",
];

export const useModalStore = create<ModalState>((set, get) => ({
  modals: [],
  isNextNavigationAllowed: false,

  openModal: (type, props) => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;

    if (!isLoggedIn && requiresAuthModalTypes.includes(type)) {
      // 열려던 모달 대신 로그인 창을 바로 띄운다. "로그인이 필요해요" 를 한 번 거치면 사용자가 이미 아는
      // 사실을 확인 버튼으로 한 번 더 누르게 할 뿐이다.
      get().openModal("LOGIN", { triggerRef: undefined });
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
