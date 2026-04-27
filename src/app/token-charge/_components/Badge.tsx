import React from "react";

interface BadgeProps {
  /** 뱃지에 들어갈 텍스트 */
  text?: string;
  /** 뱃지 타입 (디자인에 정의된 색상 테마) */
  type?: "popular" | "firstCharge";
  /** 커스텀 클래스 (위치 조절 등 외부에서 주입) */
  className?: string;
}

const Badge = ({ text, type = "popular", className }: BadgeProps) => {
  // 타입을 바탕으로 그라데이션 색상을 결정
  const variantStyles = {
    popular: "from-[#F2B34A] to-[#E88A28]",
    firstCharge: "from-[#FF9090] to-[#FF5C5C]",
  };

  return (
    <div
      className={`
        inline-flex w-13.5 h-6.25 items-center justify-center
        whitespace-nowrap px-2.5 py-1
        text-white text-xs font-semibold leading-none
        rounded-b-lg
        bg-linear-to-r ${variantStyles[type]}
        ${className}
      `}
    >
      {type === "popular" ? "인기" : "첫충전"}
    </div>
  );
};

export default Badge;
