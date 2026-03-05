import React from "react";
import { IconProps, IconWrapper } from ".";

const ArrowUp = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <path
        d="M17 14L12 9L7 14"
        stroke="#989DB8"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </IconWrapper>
  );
};

export default ArrowUp;
