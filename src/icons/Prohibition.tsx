import React from "react";
import { IconProps, IconWrapper } from ".";

const Prohibition = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5.65 5.65L18.35 18.35"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </IconWrapper>
  );
};

export default Prohibition;
