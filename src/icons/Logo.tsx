import React from "react";

interface IconProps {
  className?: string;
}
const Logo = ({ className }: IconProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="18" height="18" rx="4" fill="#FF7A00" />
      <g clipPath="url(#clip0_331_2393)">
        <path
          d="M5.41895 13.9961V12.1211C5.41895 10.1795 6.99294 8.60547 8.93457 8.60547H11.3252C11.843 8.60547 12.2627 8.18574 12.2627 7.66797C12.2627 7.1502 11.843 6.73047 11.3252 6.73047H6.59082C5.94361 6.73047 5.41895 6.2058 5.41895 5.55859C5.41895 4.91139 5.94361 4.38672 6.59082 4.38672H11.3252C13.1374 4.38672 14.6064 5.85578 14.6064 7.66797C14.6064 9.48015 13.1374 10.9492 11.3252 10.9492H8.93457C8.28736 10.9492 7.7627 11.4739 7.7627 12.1211V13.9961C7.7627 14.6433 7.23803 15.168 6.59082 15.168C5.94361 15.168 5.41895 14.6433 5.41895 13.9961Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_331_2393">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(4 4)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Logo;
