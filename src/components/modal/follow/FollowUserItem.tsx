import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface FollowUserItemProps {
  user: {
    userId: string;
    profileImage: string | null;
    nickname: string;
    description: string;
  };
  // 팔로워 탭과 팔로잉 탭은 기본 팔로우 상태가 달라서 부모에서 계산해서 내려줍니다.
  isFollowing: boolean;
  onToggleFollow: (userId: string, isFollowing: boolean) => void;
}

const FollowUserItem = ({
  user,
  isFollowing,
  onToggleFollow,
}: FollowUserItemProps) => {
  return (
    <li className="flex w-full items-center gap-3 rounded-2xl bg-bg-dark p-3 transition-none hover:bg-btn-hover">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Image
          src={user.profileImage || "/p1.png"}
          alt={`${user.nickname} 프로필 이미지`}
          width={45}
          height={45}
          className="size-[45px] shrink-0 rounded-full object-cover"
        />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 whitespace-nowrap">
          <span className="title-5 truncate text-font-1">{user.nickname}</span>
          <span className="body-6 truncate text-font-disabled">
            {user.description}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onToggleFollow(user.userId, isFollowing)}
        className={cn(
          "title-6 flex w-[69px] shrink-0 items-center justify-center rounded-[100px] px-3 py-1 text-left transition-none",
          isFollowing ? "bg-border-main" : "bg-font-1 text-bg-dark",
        )}
      >
        {isFollowing ? "팔로잉" : "팔로우"}
      </button>
    </li>
  );
};

export default FollowUserItem;
