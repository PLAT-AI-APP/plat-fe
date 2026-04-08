import React from "react";
import { IconProps, IconWrapper } from "..";

const VNFlag = (props: IconProps) => {
  return (
    <IconWrapper viewBox="0 0 30 20" {...props}>
      <g clip-path="url(#clip0_1512_5255)">
        <mask
          id="mask0_1512_5255"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="30"
          height="20"
        >
          <path d="M30 0H0V20H30V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_1512_5255)">
          <path d="M30 0H0V20H30V0Z" fill="#DB2B23" />
          <path
            d="M14.7159 3.9668L16.0705 8.1356H20.4538L16.9076 10.7121L18.2621 14.881L14.7159 12.3045L11.1697 14.881L12.5242 10.7121L8.97803 8.1356H13.3613L14.7159 3.9668Z"
            fill="#FFFF01"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_1512_5255">
          <rect width="30" height="20" rx="4" fill="white" />
        </clipPath>
      </defs>
    </IconWrapper>
  );
};

export default VNFlag;
