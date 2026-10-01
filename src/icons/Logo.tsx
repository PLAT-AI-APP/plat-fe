import React from "react";

interface IconProps {
  className?: string;
}

/**
 * 공식 탭·공식 뱃지 마크(18x18 시안). 라이트·다크 구분 없이 주황 바탕에 흰 마크 한 벌을 쓴다.
 * 옆에 오는 New 뱃지와 짝을 맞춰 바탕 모서리를 둥글게(rx 4) 깎는다.
 */
const Logo = ({ className }: IconProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="18" height="18" rx="4" fill="#FF5A1D" />
      <path d="M9 14.6699H6.75V12.4199H9V14.6699Z" fill="white" />
      <path
        d="M11.3081 3.42069C12.5239 3.45152 13.5 4.44671 13.5 5.66992V14.6699H11.25V12.4199H9V10.1699H11.25V6.11992C11.25 5.87139 11.0485 5.66992 10.8 5.66992H6.75V3.41992H11.25L11.3081 3.42069Z"
        fill="white"
      />
      <path d="M6.75 12.4199H4.5V5.66992H6.75V12.4199Z" fill="white" />
    </svg>
  );
};

export default Logo;
