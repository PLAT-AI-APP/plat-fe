import AdultBadge from "@/components/adult/AdultBadge";
import { useTranslations } from "next-intl";

interface TitleStatusIconProps {
  isOfficial: boolean;
  isNew: boolean;
  /** 성인 세계관이면 공식·신작 표시와 함께 19 배지를 단다. */
  adult?: boolean;
  /** 뱃지 한 변(px). 카드 제목 옆은 18. */
  size?: number;
}

/** 공식 캐릭터는 공식 뱃지, 아니면 공개 30일 안의 신작 뱃지. 둘 다면 공식이 앞선다. */
export const StatusBadge = ({
  isOfficial,
  isNew,
  size = 18,
}: Omit<TitleStatusIconProps, "adult">) => {
  const t = useTranslations("characterCard");
  if (!isOfficial && !isNew) return null;
  const label = isOfficial ? t("officialBadge") : t("newBadge");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={isOfficial ? "/images/badges/official.svg" : "/images/badges/new.svg"}
      alt={label}
      title={label}
      width={size}
      height={size}
      className="shrink-0"
    />
  );
};

const TitleStatusIcon = ({
  isOfficial,
  isNew,
  adult = false,
  size,
}: TitleStatusIconProps) => (
  <>
    {adult && <AdultBadge />}
    <StatusBadge isOfficial={isOfficial} isNew={isNew} size={size} />
  </>
);

export default TitleStatusIcon;
