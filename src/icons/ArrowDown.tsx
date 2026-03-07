import React from "react";
import { IconProps, IconWrapper } from ".";

const ArrowDown = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <path
        d="M7 10L12 15L17 10"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconWrapper>
  );
};

export default ArrowDown;
