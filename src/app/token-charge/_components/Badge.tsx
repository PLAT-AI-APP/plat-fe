"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface BadgeProps {
  text?: string;
  type?: "popular" | "firstCharge";
  className?: string;
}

const Badge = ({ text, type = "popular", className }: BadgeProps) => {
  const t = useTranslations();

  // 판촉 뱃지 그라디언트는 테마와 무관한 장식색이다(상태색이 아니라 눈길을 끄는 용도).
  const variantStyles = {
    popular: "from-[#F2B34A] to-[#E88A28]",
    firstCharge: "from-[#FF9090] to-[#FF5C5C]",
  };

  return (
    <div
      className={`
        inline-flex h-6.25 w-13.5 items-center justify-center
        whitespace-nowrap rounded-b-lg px-2.5 py-1
        title-7 leading-none text-overlay-font
        bg-linear-to-r ${variantStyles[type]}
        ${className}
      `}
    >
      {text ?? t(`tokenCharge.badges.${type}`)}
    </div>
  );
};

export default Badge;
