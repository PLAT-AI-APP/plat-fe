"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { usePostUniverseCommentMutation } from "@/api/comment/postUniverseComment";

/** 서버가 받는 댓글 최대 길이 */
const COMMENT_MAX_LENGTH = 1000;

interface CommentInputBoxProps {
  universeId: string;
}

const CommentInputBox = ({ universeId }: CommentInputBoxProps) => {
  const t = useTranslations("characterDetail");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const profileImage = useUserStore((state) => state.user?.profileImage);
  const [comment, setComment] = useState("");
  const { isPending, mutate } = usePostUniverseCommentMutation();

  // 로그인 상태에 따라 입력 가능 여부와 안내 문구를 분기해 댓글 작성 UX를 한 곳에서 관리합니다.
  const placeholder = isLoggedIn
    ? t("loggedInCommentPlaceholder")
    : t("loggedOutCommentPlaceholder");
  const canSubmit = isLoggedIn && comment.trim().length > 0 && !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;

    mutate(
      { universeId, content: comment.trim() },
      { onSuccess: () => setComment("") },
    );
  };

  return (
    <div className="flex gap-2">
      <Image
        src={profileImage || "/p1.png"}
        alt={t("myProfileAlt")}
        width={40}
        height={40}
        className="avatar-img size-10"
      />

      <div className="flex min-h-[70px] flex-1 flex-col items-end justify-end gap-1 rounded-2xl border border-main bg-btn-hover px-3 py-2 transition-colors focus-within:field-focus!">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          disabled={!isLoggedIn}
          maxLength={COMMENT_MAX_LENGTH}
          className={cn(
            "focus-ring-none body-4 min-h-9 w-full resize-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled disabled:cursor-default",
            !isLoggedIn && "placeholder:text-font-1",
          )}
          placeholder={placeholder}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            "body-4 rounded-xl bg-main px-4 py-1.5 transition-colors",
            canSubmit
              ? "text-font-1 hover:bg-btn-selected"
              : "cursor-not-allowed text-font-disabled",
          )}
        >
          {t("submitComment")}
        </button>
      </div>
    </div>
  );
};

export default CommentInputBox;
