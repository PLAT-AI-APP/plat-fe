import React from "react";
import { IconProps, IconWrapper } from "..";

const THFlag = (props: IconProps) => {
  return (
    <IconWrapper viewBox="0 0 30 20" {...props}>
      <g clip-path="url(#clip0_1512_5180)">
        <mask
          id="mask0_1512_5180"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="30"
          height="20"
        >
          <path d="M30 0H0V20H30V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_1512_5180)">
          <path d="M30 0H0V20H30V0Z" fill="#ED1F24" />
          <path d="M30 3.5H0V16.5H30V3.5Z" fill="#FEFFFF" />
          <path d="M30 7H0V12.9999H30V7Z" fill="#241E4E" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1512_5180">
          <rect width="30" height="20" rx="4" fill="white" />
        </clipPath>
      </defs>
    </IconWrapper>
  );
};

export default THFlag;
