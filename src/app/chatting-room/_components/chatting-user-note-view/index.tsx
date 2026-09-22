"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePatchRoomUserNoteMutation } from "@/api/room/patchRoomUserNote";
import { ArrowLeft } from "@/icons";
import Note from "@/icons/Note";
import { useAutoResizeTextarea } from "@/hooks/form/useAutoResizeTextarea";
import { useTranslateText } from "@/hooks/i18n/useTranslateText";
import { focusFirstFieldError } from "@/lib/formError";
import { showAppToast } from "@/lib/toast";
import { userNoteFormSchema, UserNoteFormValues } from "@/schema/modal.schema";

/** userNoteFormSchema 의 최대 길이와 같아야 카운터와 검증이 어긋나지 않는다. */
const USER_NOTE_MAX_LENGTH = 500;
/** 비어 있을 때의 높이. 예전 유저노트 모달과 같은 6줄이다. */
const USER_NOTE_MIN_ROWS = 6;
/** 이만큼까지만 늘어나고 넘치면 입력칸 안에서 스크롤한다. 사이드바 끝까지 늘어나면 너무 길다. */
const USER_NOTE_MAX_ROWS = 12;

interface ChattingUserNoteViewProps {
  roomId: string;
  onBack: () => void;
}

const ChattingUserNoteView = ({ roomId, onBack }: ChattingUserNoteViewProps) => {
  const sidebarT = useTranslations("chatRoom.sidebar");
  const t = useTranslations("modalUi.userNote");
  const translateText = useTranslateText();
  const {
    register,
    handleSubmit,
    control,
    setFocus,
    formState: { errors },
  } = useForm<UserNoteFormValues>({
    resolver: zodResolver(userNoteFormSchema),
    defaultValues: { userNote: "" },
  });

  const noteValue = useWatch({ control, name: "userNote" }) ?? "";
  const { textareaRef } = useAutoResizeTextarea({
    maxRows: USER_NOTE_MAX_ROWS,
    value: noteValue,
  });
  // react-hook-form 과 자동 높이 조절이 같은 textarea 를 가리켜야 해서 ref 를 둘 다에 넘긴다.
  const { ref: registerNoteRef, ...noteField } = register("userNote");
  const handleNoteRef = (element: HTMLTextAreaElement | null) => {
    registerNoteRef(element);
    textareaRef.current = element;
  };
  const { mutate: patchUserNote, isPending } = usePatchRoomUserNoteMutation();

  const onSubmit = (data: UserNoteFormValues) => {
    if (isPending) return;

    patchUserNote(
      { roomId, userNote: data.userNote },
      {
        onSuccess: () => showAppToast("success", t("successToast")),
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (formErrors) =>
        focusFirstFieldError(formErrors, setFocus, translateText),
      )}
      className="flex h-full flex-col gap-5 overflow-hidden bg-dark p-5"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex size-5 items-center justify-center text-font-2 transition-colors hover:text-font-1"
        aria-label={sidebarT("backToSettings")}
      >
        <ArrowLeft className="size-5" />
      </button>

      <section className="flex min-h-0 flex-1 flex-col gap-5">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Note className="size-6 text-font-2" />
            <h2 className="body-3 text-font-1">{t("title")}</h2>
          </div>
          <p className="body-6 text-font-2">{t("description")}</p>
        </header>

        <div className="flex flex-col gap-3">
          {/* 백엔드는 방마다 userNote 문자열 하나를 통째로 덮어쓰고 조회 API가 없어,
              지나온 대화처럼 매번 새로 입력하는 단일 텍스트로 다룬다. */}
          <div className="flex rounded-lg border border-main bg-darkest px-2 py-3 transition-colors focus-within:field-focus!">
            <textarea
              {...noteField}
              ref={handleNoteRef}
              rows={USER_NOTE_MIN_ROWS}
              maxLength={USER_NOTE_MAX_LENGTH}
              placeholder={t("placeholder")}
              aria-invalid={Boolean(errors.userNote)}
              className="focus-ring-none body-6 custom-scrollbar w-full resize-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="body-7 text-font-2">
              {noteValue.length}/{USER_NOTE_MAX_LENGTH}
            </span>

            <button
              type="submit"
              disabled={isPending || !noteValue.trim()}
              className="body-7 rounded border border-main bg-btn-hover px-3 py-1 text-font-1 transition-colors hover:bg-card-selected disabled:cursor-default disabled:opacity-50"
            >
              {t("submit")}
            </button>
          </div>
        </div>
      </section>
    </form>
  );
};

export default ChattingUserNoteView;
