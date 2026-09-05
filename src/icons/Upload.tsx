import React from "react";
import { IconProps, IconWrapper } from ".";

const Upload = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 8L12 4L8 8M12 4V20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconWrapper>
  );
};

export default Upload;
