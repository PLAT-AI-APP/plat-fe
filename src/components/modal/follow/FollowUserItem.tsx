import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface FollowUserItemProps {
  user: {
    userId: string;
    profileImage: string | null;
    nickname: string;
    description: string;
  };
  isFollowing: boolean;
  isPending?: boolean;
  onToggleFollow: (userId: string, isFollowing: boolean) => void;
}

const FollowUserItem = ({
  user,
  isFollowing,
  isPending = false,
  onToggleFollow,
}: FollowUserItemProps) => {
  const t = useTranslations("modalUi.follow");
  const commonT = useTranslations("modalUi.common");

  return (
    <li className="flex w-full items-center gap-3 rounded-2xl bg-bg-dark p-3 transition-none hover:bg-btn-hover">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Image
          src={user.profileImage || "/p1.png"}
          alt={t("profileImageAlt", { nickname: user.nickname })}
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
        disabled={isPending}
        className={cn(
          "title-6 flex min-w-[96px] shrink-0 items-center justify-center whitespace-nowrap rounded-[100px] px-4 py-1 text-left transition-none",
          isFollowing ? "bg-border-main" : "bg-font-1 text-bg-dark",
          isPending && "cursor-wait opacity-70",
        )}
      >
        {isFollowing ? commonT("following") : commonT("follow")}
      </button>
    </li>
  );
};

export default FollowUserItem;
