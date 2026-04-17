import React from "react";
import { IconProps, IconWrapper } from ".";

const ArrowLineLeft = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <path
        d="M11 19L4 12M4 12L11 5M4 12H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconWrapper>
  );
};

export default ArrowLineLeft;
