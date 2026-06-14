import { create } from "zustand";
import type { DialogTypeMap } from "@/type/dialog";

type DialogInstanceUnion = {
  [K in keyof DialogTypeMap]: {
    type: K;
    props: DialogTypeMap[K];
  };
}[keyof DialogTypeMap];

interface DialogState {
  currentDialog: DialogInstanceUnion | null;
  closeDialog: () => void;
  openDialog: <T extends keyof DialogTypeMap>(
    type: T,
    props: DialogTypeMap[T],
  ) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  currentDialog: null,

  closeDialog: () => set({ currentDialog: null }),

  openDialog: (type, props) =>
    set({
      // Dialog는 한 번에 하나만 보여주는 정책으로 관리해 레이어 충돌을 줄입니다.
      currentDialog: { type, props } as DialogInstanceUnion,
    }),
}));
