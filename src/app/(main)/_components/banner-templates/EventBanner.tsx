import { useTranslations } from "next-intl";
import ResourceImage from "@/components/ResourceImage";
import type { HomeBanner } from "@/api/home/getBanners";
import { BANNER_BADGE_COLORS } from "@/constants/bannerBadge";
import { cn } from "@/lib/utils";

interface EventBannerProps {
  banner: HomeBanner;
  /** 첫 장만 먼저 받는다. */
  priority: boolean;
  /** 캐러셀 양옆에 접힌 장. 배경만 흐리게 보이고 문구·전경은 감춘다. */
  folded?: boolean;
}

/**
 * 이벤트형 배너. 배경 이미지 위 오른쪽에 전경 이미지를 얹어 강조하고, 왼쪽 아래에 뱃지 → 제목 → 설명 → #태그 순으로 얹는다.
 * 글자 자리만 어둡게 깔아 어떤 배경에서도 읽히게 하고, 전경은 그 막 위에 올려 어두워지지 않게 한다.
 *
 * 접힐 때는 배경만 흐리게 남긴다. 문구·전경 층은 펼친 폭(--center, 캐러셀이 정함)에 왼쪽을 고정해 두어서
 * 카드가 줄거나 늘 때 글자가 다시 흐르지 않고 잘리며 사라지거나 드러난다.
 */
const EventBanner = ({
  banner,
  priority,
  folded = false,
}: EventBannerProps) => {
  const t = useTranslations("home.bannerBadge");
  // 앱이 아직 모르는 코드(서버에 새로 생긴 뱃지)는 빈 칩 대신 건너뛴다.
  const badges = banner.badges.filter((badge) => badge in BANNER_BADGE_COLORS);

  return (
    <>
      <ResourceImage
        // 문구가 따로 있으니 배경은 장식이다.
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        // 원본 크기 webp 를 그대로 건다. next/image 가 다시 줄이거나 인코딩하지 않게 한다.
        unoptimized
        className={cn(
          "object-cover transition-[filter,transform] duration-700 ease-(--ease-banner,ease-out) motion-reduce:transition-none",
          folded && "scale-110 blur-md",
        )}
        src={banner.backgroundImageUrl}
      />

      <div
        className={cn(
          "absolute inset-y-0 left-0 w-(--center,100%) transition-[opacity,translate] motion-reduce:transition-none",
          // 접힐 때는 문구가 먼저 빠르게 빠지고, 펼칠 때는 창이 어느 정도 열린 뒤 살짝 떠오르며 들어온다.
          folded
            ? "translate-x-3 opacity-0 duration-200 ease-out"
            : "translate-x-0 opacity-100 delay-200 duration-500 ease-(--ease-banner,ease-out)",
        )}
      >
        {/* 링크 클릭을 가로채지 않도록 pointer-events 를 끈다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-scrim/75 via-scrim/35 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-scrim/70 via-scrim/20 via-60% to-transparent"
        />

        {/* 전경은 배너 높이에 맞춰 만든다. 오른쪽 끝에 붙여 높이 100% 로 건다. width·height 는 비율 힌트일 뿐이다. */}
        {banner.foregroundImageUrl && (
          <ResourceImage
            alt=""
            width={2560}
            height={920}
            priority={priority}
            sizes="100vw"
            unoptimized
            className="pointer-events-none absolute top-0 right-0 h-full w-auto max-w-none"
            src={banner.foregroundImageUrl}
          />
        )}
        {/* 모바일은 폭이 좁아 전경이 글자 밑까지 들어온다. 그때만 전경 위에 한 겹 더 깔아 글자를 읽히게 한다. */}
        {banner.foregroundImageUrl && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-scrim/70 via-scrim/30 via-60% to-transparent md:hidden"
          />
        )}

        {/*
        데스크톱 규격: 배너 기준 왼쪽 48px·아래 60px, 뱃지 14·제목 26·설명 18·태그 16px, 뱃지 아래 8px·나머지 4px.
        모바일은 좌우 화살표(left-4 + 32px)와 겹치지 않게 본문 여백 안쪽에 둔다.
      */}
        <div className="absolute inset-0 flex items-end">
          <div className="content-shell pb-6 md:max-w-none md:px-0 md:pb-[60px]">
            <div className="flex max-w-[560px] flex-col gap-1 pl-10 text-overlay-font md:pl-12">
              {badges.length > 0 && (
                <ul className="mb-1 flex flex-wrap gap-1.5">
                  {badges.map((badge) => (
                    <li
                      key={badge}
                      className="title-7 rounded-full px-2.5 py-0.5 md:title-5"
                      style={{ backgroundColor: BANNER_BADGE_COLORS[badge] }}
                    >
                      {t(badge)}
                    </li>
                  ))}
                </ul>
              )}
              <h2 className="title-1 line-clamp-2 break-keep md:text-[26px] md:leading-[1.3] md:font-bold">
                {banner.title}
              </h2>
              {banner.description && (
                <p className="body-6 line-clamp-2 break-keep text-overlay-font/85 md:body-2">
                  {banner.description}
                </p>
              )}
              {banner.tags.length > 0 && (
                <ul className="body-7 flex flex-wrap gap-x-2 text-overlay-font/65 md:body-3">
                  {banner.tags.map((tag) => (
                    <li key={tag}>#{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventBanner;
