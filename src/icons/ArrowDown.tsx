import React from "react";
import { IconProps, IconWrapper } from ".";

const ArrowDown = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <path
        d="M7 10L12 15L17 10"
        stroke="#989DB8"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </IconWrapper>
  );
};

export default ArrowDown;
