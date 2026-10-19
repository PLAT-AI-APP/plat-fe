import React from "react";
import { IconProps, IconWrapper } from ".";

/** 크리에이터 센터. 제작자 등급 뱃지와 같은 육각형 안에 반짝임. */
const CreatorCenter = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <path
        d="M12 2.6 20.15 7.3v9.4L12 21.4l-8.15-4.7V7.3L12 2.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 7.6c.38 2.43 1.57 3.62 4 4-2.43.38-3.62 1.57-4 4-.38-2.43-1.57-3.62-4-4 2.43-.38 3.62-1.57 4-4Z" />
    </IconWrapper>
  );
};

export default CreatorCenter;
