import React from "react";
import { IconProps, IconWrapper } from ".";

const MoveUp = (props: IconProps) => {
  return (
    <IconWrapper {...props} fill="none">
      <path
        d="M16.0016 8.00313L12.0016 4.00313L8.00156 8.00313M12.0016 4.00313V20.0031"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconWrapper>
  );
};

export default MoveUp;
