import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  CREATOR_TIER_BADGE,
  type BadgeTierCode,
} from "@/constants/creatorTier";

interface CreatorTierBadgeProps {
  tier: BadgeTierCode;
  size: number;
  className?: string;
}

/** 제작자 닉네임 곁에 다는 등급 뱃지. 이름은 대체 텍스트·툴팁으로만 둔다. */
const CreatorTierBadge = ({ tier, size, className }: CreatorTierBadgeProps) => {
  const t = useTranslations("earnings.tier.names");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={CREATOR_TIER_BADGE[tier]}
      alt={t(tier)}
      title={t(tier)}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
};

export default CreatorTierBadge;
