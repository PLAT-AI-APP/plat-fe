"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useTextareaSubmitShortcuts } from "@/hooks/form/useTextareaSubmitShortcuts";
import { usePostUniverseCommentMutation } from "@/api/comment/postUniverseComment";
import CommentComposer from "./CommentComposer";

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

  const { handleKeyDown } = useTextareaSubmitShortcuts({
    onSubmit: handleSubmit,
  });

  return (
    <div className="flex gap-2">
      <Image
        src={profileImage || "/p1.png"}
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
