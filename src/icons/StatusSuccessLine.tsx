import React from "react";
import { IconProps, IconWrapper } from ".";

const StatusSuccessLine = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M15.448 8.756C15.803 8.415 16.379 8.415 16.734 8.756C17.089 9.098 17.089 9.652 16.734 9.994L11.279 15.244C10.925 15.585 10.349 15.585 9.994 15.244L7.266 12.619C6.911 12.278 6.911 11.722 7.266 11.381C7.621 11.039 8.197 11.039 8.552 11.381L10.636 13.388L15.448 8.756Z" />
    </IconWrapper>
  );
};

export default StatusSuccessLine;
