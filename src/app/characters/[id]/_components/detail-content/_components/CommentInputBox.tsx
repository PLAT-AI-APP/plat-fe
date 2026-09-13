"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { resolveApiImageUrl } from "@/lib/file";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useTextareaSubmitShortcuts } from "@/hooks/form/useTextareaSubmitShortcuts";
import { usePostUniverseCommentMutation } from "@/api/comment/postUniverseComment";
import CommentComposer from "./CommentComposer";

interface CommentInputBoxProps {
  universeId: string;
  commentEnabled: boolean;
}

const CommentInputBox = ({
  universeId,
  commentEnabled,
}: CommentInputBoxProps) => {
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

  const { handleKeyDown } = useTextareaSubmitShortcuts({
    onSubmit: handleSubmit,
  });

  // 창작자가 댓글을 막아둔 캐릭터는 새 댓글을 아예 못 쓰게 합니다.
  if (!commentEnabled) {
    return (
      <p className="body-5 rounded-2xl bg-btn-hover px-3 py-4 text-center text-font-2">
        {t("commentsDisabled")}
      </p>
    );
  }

  return (
    <div className="flex gap-2">
      <Image
        src={resolveApiImageUrl(profileImage) || "/p1.png"}
        alt={t("myProfileAlt")}
        width={40}
        height={40}
        className="avatar-img size-10"
      />

      <CommentComposer
        className="min-h-[70px] flex-1 justify-end"
        value={comment}
        onChange={setComment}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        canSubmit={canSubmit}
        disabled={!isLoggedIn}
        placeholder={placeholder}
        textareaClassName={!isLoggedIn ? "placeholder:text-font-1" : undefined}
        submitLabel={t("submitComment")}
      />
    </div>
  );
};

export default CommentInputBox;
