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

  const variantStyles = {
    popular: "from-[#F2B34A] to-[#E88A28]",
    firstCharge: "from-[#FF9090] to-[#FF5C5C]",
  };

  return (
    <div
      className={`
        inline-flex h-6.25 w-13.5 items-center justify-center
        whitespace-nowrap rounded-b-lg px-2.5 py-1
        text-xs leading-none font-semibold text-white
        bg-linear-to-r ${variantStyles[type]}
        ${className}
      `}
    >
      {text ?? t(`tokenCharge.badges.${type}`)}
    </div>
  );
};

export default Badge;
