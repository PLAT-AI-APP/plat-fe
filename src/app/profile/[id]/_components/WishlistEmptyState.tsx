import Link from "next/link";
import { useTranslations } from "next-intl";

/** 찜한 캐릭터가 없을 때 홈 카테고리 탭(태그 검색)으로 안내하는 빈 상태. */
const WishlistEmptyState = () => {
  const t = useTranslations("profile.wishEmpty");

  return (
    <div className="flex w-full flex-col items-center justify-center gap-7 py-10">
      <div className="flex flex-col items-center gap-[11px] text-center">
        <p className="body-2 text-font-disabled">{t("caption")}</p>
        <p className="title-1 text-font-2">{t("title")}</p>
      </div>

      <Link
        href="/?tab=categories"
        className="flex w-[308px] items-center justify-center rounded-2xl bg-card-hover p-4 transition-colors hover:bg-card-selected"
      >
        <span className="title-3 text-font-1">{t("searchTag")}</span>
      </Link>
    </div>
  );
};

export default WishlistEmptyState;
