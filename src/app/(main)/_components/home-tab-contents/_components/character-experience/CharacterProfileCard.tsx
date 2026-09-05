import { ChatFill } from "@/icons";
import Image from "next/image";
import React from "react";
import type { OfficialPreviewItem } from "@/api/home/getOfficialPreview";
import { formatWithCommas } from "@/lib/utils";

interface CharacterProfileCardProps {
  item: OfficialPreviewItem;
  /** 첫 슬라이드만 우선 로드해 홈 LCP를 앞당깁니다. */
  priority?: boolean;
}

/**
 * 좌측 캐릭터 카드.
 *
 * 폭은 부모 그리드의 열이 정한다. 예전에는 이쪽만 md:w-95 로 고정되어 있어
 * 창을 줄이면 오른쪽 대화 영역만 눌렸다 — 좌우가 같은 비율로 함께 움직여야
 * 일관되게 보인다.
 */
const CharacterProfileCard = ({ item, priority }: CharacterProfileCardProps) => {
  const imageUrl = item.images?.[0];

  return (
    <section className="relative inline-flex aspect-square w-full min-w-0 flex-col items-start justify-end overflow-hidden rounded-t-2xl bg-scrim md:aspect-auto md:h-full md:rounded-tr-none md:rounded-bl-2xl">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={item.title}
          fill
          priority={priority}
          // 좁은 화면은 한 줄 전체, md 이상은 콘텐츠 폭의 1/3(1fr : 2fr 분할)을 차지합니다.
          sizes="(max-width: 767px) 100vw, 33vw"
          className="object-cover"
        />
      )}

      <header className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-center gap-1 self-stretch bg-linear-to-b from-scrim/0 via-scrim/80 to-scrim px-6 pb-7 pt-9">
        <h3 className="title-2 line-clamp-1 text-overlay-font">{item.title}</h3>

        <p className="body-4 line-clamp-1 text-overlay-font/80">
          {item.description}
        </p>

        {item.tags.length > 0 && (
          <div className="inline-flex items-start gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="body-6 text-overlay-font/60">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="inline-flex items-center justify-center gap-1">
          <ChatFill className="size-4 text-overlay-font/60" />
          <span className="body-6 text-overlay-font/60">
            {formatWithCommas(item.chatCount)}
          </span>
        </div>
      </header>
    </section>
  );
};

export default CharacterProfileCard;
