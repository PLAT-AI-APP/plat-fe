import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

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
          alt="내 프로필"
          className="h-10 w-10 rounded-full"
        />
        <textarea
          className={cn(
            "text-sm px-3 py-2 h-19 bg-card rounded-2xl resize-none flex-1",
            isReplyMode && "max-h-14",
          )}
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="댓글을 입력하세요..."
        />
      </div>

      <div className="flex justify-end gap-2.5 font-medium text-sm">
        {isReplyMode && (
          <button
            type="button"
            onClick={toggleIsCommentInput}
            className="hover:underline"
          >
            취소
          </button>
        )}

        <button
          type="submit"
          disabled={Boolean(!text)}
          className={cn(
            "text-font-disabled w-fit px-4 py-1.5 hover:bg-card-hover transition-all bg-btn-hover rounded-[100px]",
            text && "bg-card-hover",
          )}
        >
          {isReplyMode ? "답글" : "등록"}
        </button>
      </div>
    </form>
  );
};
