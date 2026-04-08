import React from "react";
import { IconProps, IconWrapper } from "..";

const JPFlag = (props: IconProps) => {
  return (
    <IconWrapper viewBox="0 0 30 20" {...props}>
      <g clip-path="url(#clip0_1512_5030)">
        <mask
          id="mask0_1512_5030"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="30"
          height="20"
        >
          <path d="M30 0H0V20H30V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_1512_5030)">
          <path d="M29.9998 0H0V20H29.9998V0Z" fill="white" />
          <mask
            id="mask1_1512_5030"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="30"
            height="20"
          >
            <path d="M30 0H0V20H30V0Z" fill="white" />
          </mask>
          <g mask="url(#mask1_1512_5030)">
            <path
              d="M21 10C21 13.3138 18.3136 16 15 16C11.6864 16 9 13.3138 9 10C9 6.6862 11.6864 4 15 4C18.3136 4 21 6.6865 21 10Z"
              fill="#BB002D"
            />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1512_5030">
          <rect width="30" height="20" rx="4" fill="white" />
        </clipPath>
      </defs>
    </IconWrapper>
  );
};

export default JPFlag;
