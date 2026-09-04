"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface CommentInputProps {
  profileImage: string;
  formClassName?: string;
  isReplyMode?: boolean;
  toggleIsCommentInput?: () => void;
}

export const CommentInput = ({
  profileImage,
  formClassName,
  isReplyMode = false,
  toggleIsCommentInput,
}: CommentInputProps) => {
  const t = useTranslations();
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn("flex flex-col gap-2.5", formClassName)}
    >
      <div id="comment-input-wrapper" className="flex gap-2">
        <Image
          id="user-profile-thumbnail"
          src={profileImage}
          width={40}
          height={40}
          alt={t("characterDetail.myProfileAlt")}
          className="h-10 w-10 rounded-full"
        />
        <textarea
          className={cn(
            "body-4 h-19 flex-1 resize-none rounded-2xl border border-transparent bg-card px-3 py-2 transition-colors focus:field-focus!",
            isReplyMode && "max-h-14",
          )}
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder={t("characterDetail.commentPlaceholder")}
        />
      </div>

      <div className="title-5 flex justify-end gap-2.5">
        {isReplyMode && (
          <button
            type="button"
            onClick={toggleIsCommentInput}
            className="hover:underline"
          >
            {t("common.cancel")}
          </button>
        )}

        <button
          type="submit"
          disabled={Boolean(!text)}
          className={cn(
            "w-fit rounded-full bg-btn-hover px-4 py-1.5 text-font-disabled transition-colors hover:bg-card-hover",
            text && "bg-card-hover",
          )}
        >
          {isReplyMode
            ? t("characterDetail.reply")
            : t("characterDetail.submit")}
        </button>
      </div>
    </form>
  );
};
