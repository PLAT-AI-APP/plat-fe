import React from "react";
import { IconProps, IconWrapper } from ".";

const Melody = (props: IconProps) => {
  return (
    <IconWrapper {...props} viewBox="0 0 20 20">
      <g clipPath="url(#clip0_2145_19124)">
        <g filter="url(#filter0_d_2145_19124)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.99023 14.8184H9.98242C9.85403 16.8985 8.12612 18.5459 6.01367 18.5459C3.8178 18.5458 2.03809 16.7652 2.03809 14.5693C2.03824 12.3736 3.8179 10.5939 6.01367 10.5938C7.04221 10.5938 7.97962 10.9841 8.68555 11.625V5.80957C8.68556 3.13327 10.855 0.963942 13.5312 0.963867H16.6152C17.5884 0.963892 18.3768 1.75248 18.377 2.72559C18.377 4.42859 16.9969 5.80936 15.2939 5.80957H9.99023V14.8184Z"
            fill="url(#paint0_linear_2145_19124)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_2145_19124"
          x="-12.9619"
          y="-4.03613"
          width="46.3389"
          height="47.582"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 0.341176 0 0 0 0 0.2 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2145_19124"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2145_19124"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_2145_19124"
          x1="18.377"
          y1="1.58514"
          x2="2.03747"
          y2="17.924"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.235577" stopColor="#FF7700" />
          <stop offset="0.5" stopColor="#FFB347" />
          <stop offset="1" stopColor="#FF5733" />
        </linearGradient>
        <clipPath id="clip0_2145_19124">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </IconWrapper>
  );
};

export default Melody;
