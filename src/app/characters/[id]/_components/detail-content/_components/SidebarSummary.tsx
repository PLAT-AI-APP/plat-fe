"use client";

import Image from "next/image";
import ActiveButton from "@/components/ActiveButton";
import { ChatFill } from "@/icons";
import { cn, formatStatCount } from "@/lib/utils";
import { CharacterDetail } from "@/type/character";

interface SidebarSummaryProps {
  character: CharacterDetail;
  onSelectImage: (index: number) => void;
  onStartChat: () => void;
}

const SidebarSummary = ({
  character,
  onSelectImage,
  onStartChat,
}: SidebarSummaryProps) => {
  return (
    <aside className="sticky top-24 flex w-[391px] shrink-0 flex-col gap-5 self-start">
      <section className="flex flex-col gap-4">
        {character.isOfficial && (
          <span className="body-6 w-fit rounded-xl bg-brand/10 px-3 py-2 text-brand-dark">
            plat 공식 캐릭터
          </span>
        )}

        <div className="flex flex-col gap-2">
          <h1 className="heading-3 text-font-1">{character.title}</h1>
          <p className="body-2 text-font-1">{character.introduce}</p>
          <div className="flex flex-col gap-0.5">
            <div className="body-4 flex flex-wrap gap-x-2 gap-y-1 text-font-2">
              {character.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
            <span className="body-4 flex items-center gap-1 text-font-2">
              <ChatFill className="size-4" />
              {formatStatCount(character.chatCount)}
            </span>
          </div>
        </div>
      </section>

      <div className="flex gap-[7px] overflow-hidden">
        {character.images.slice(0, 5).map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onSelectImage(index)}
            className="relative size-[73px] shrink-0 overflow-hidden rounded-lg"
            aria-label={`${character.title} 미리보기 ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={`${character.title} 미리보기 ${index + 1}`}
              fill
              className={cn(
                "object-cover",
                image.visibility === "PRIVATE" && "blur-[3px]",
              )}
            />
            {image.visibility === "PRIVATE" && (
              <span className="absolute inset-0 bg-bg-darkest/45" />
            )}
          </button>
        ))}
      </div>

      <ActiveButton
        text="대화하기"
        isActive
        type="button"
        onClick={onStartChat}
        className="h-[52px] rounded-2xl bg-brand/20 text-brand-dark hover:bg-brand/25"
      />

      <section className="rounded-2xl bg-btn-hover px-5 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Image
                src={character.creator.profileImage}
                alt={`${character.creator.nickname} 프로필`}
                width={48}
                height={48}
                className="size-12 rounded-full object-cover"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="body-2 truncate text-font-1">
                  {character.creator.nickname}
                </p>
                <p className="body-6 text-font-2">
                  팔로잉 {character.creator.followingCount}명
                </p>
              </div>
            </div>
            <button
              type="button"
              className="title-5 rounded-full bg-border-main px-3 py-1 text-font-1"
            >
              {character.creator.isFollowing ? "팔로잉" : "팔로우"}
            </button>
          </div>

          <div className="body-6 flex gap-4 text-font-2">
            <span>캐릭터 제작일 {character.createdAt}</span>
            <span>마지막 수정일 {character.updatedAt}</span>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default SidebarSummary;
