import React from "react";
import { IconProps, IconWrapper } from ".";

const ArrowUp = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <path
        d="M17 14L12 9L7 14"
        stroke="inherit"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconWrapper>
  );
};

export default ArrowUp;
