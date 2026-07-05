"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

const CommentInputBox = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const profileImage = useUserStore((state) => state.user?.profileImage);
  const [comment, setComment] = useState("");

  // 로그인 상태에 따라 입력 가능 여부와 안내 문구를 분기해 댓글 작성 UX를 한 곳에서 관리합니다.
  const placeholder = isLoggedIn
    ? "타인에게 부적절한 댓글은 삭제될 수 있어요"
    : "로그인 후 댓글을 달 수 있어요";

  return (
    <div className="flex gap-2">
      <Image
        src={profileImage || "/p1.png"}
        alt="내 프로필"
        width={40}
        height={40}
        className="size-10 rounded-full object-cover"
      />

      <div className="flex min-h-[70px] flex-1 flex-col items-end justify-end gap-1 rounded-2xl bg-btn-hover px-3 py-2">
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          disabled={!isLoggedIn}
          className={cn(
            "body-4 min-h-9 w-full resize-none bg-transparent text-font-1 outline-none placeholder:text-font-disabled disabled:cursor-default",
            !isLoggedIn && "placeholder:text-font-1",
          )}
          placeholder={placeholder}
        />

        <button
          type="button"
          disabled={!isLoggedIn}
          className={cn(
            "body-4 rounded-xl bg-border-main px-4 py-1.5",
            isLoggedIn ? "text-font-1" : "text-font-disabled",
          )}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommentInputBox;
