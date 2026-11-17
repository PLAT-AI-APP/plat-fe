import { useTranslations } from "next-intl";
import ResourceImage from "@/components/ResourceImage";
import type { HomeBanner } from "@/api/home/getBanners";
import { BANNER_BADGE_COLORS } from "@/constants/bannerBadge";

interface EventBannerProps {
  banner: HomeBanner;
  /** 첫 장만 먼저 받는다. */
  priority: boolean;
}

/**
 * 이벤트형 배너. 배경 이미지 위에 뱃지 → 제목 → 설명 → #태그 순으로 얹는다.
 * 글자는 왼쪽 아래에 모으고, 그 자리만 어둡게 깔아 어떤 배경에서도 읽히게 한다.
 */
const EventBanner = ({ banner, priority }: EventBannerProps) => {
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
        className="object-cover"
        src={banner.imageUrl}
      />

      {/* 링크 클릭을 가로채지 않도록 pointer-events 를 끈다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-scrim/75 via-scrim/35 via-55% to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-scrim/70 via-scrim/20 via-60% to-transparent"
      />

      {/* 좌우 화살표(left-4 / md:left-10 + 32px)와 겹치지 않게 안쪽 여백을 더 준다. */}
      <div className="absolute inset-0 flex items-end">
        <div className="content-shell pb-6 md:pb-10">
          <div className="flex max-w-[560px] flex-col gap-2 pl-10 text-overlay-font md:gap-3 md:pl-16">
            {badges.length > 0 && (
              <ul className="flex flex-wrap gap-1.5">
                {badges.map((badge) => (
                  <li
                    key={badge}
                    className="title-7 rounded-full px-2.5 py-0.5 md:title-6"
                    style={{ backgroundColor: BANNER_BADGE_COLORS[badge] }}
                  >
                    {t(badge)}
                  </li>
                ))}
              </ul>
            )}
            <h2 className="title-1 line-clamp-2 break-keep md:display-1">
              {banner.title}
            </h2>
            {banner.description && (
              <p className="body-6 line-clamp-2 break-keep text-overlay-font/85 md:body-3">
                {banner.description}
              </p>
            )}
            {banner.tags.length > 0 && (
              <ul className="body-7 flex flex-wrap gap-x-2 text-overlay-font/65 md:body-5">
                {banner.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventBanner;
