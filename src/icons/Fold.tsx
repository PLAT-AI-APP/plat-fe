import React from "react";
import { IconProps, IconWrapper } from ".";

const Fold = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <path
        d="M20.5 18V6C20.5 5.72386 20.2761 5.5 20 5.5H8.75V18.5H20V20H4V18.5H7.25V5.5H4C3.72386 5.5 3.5 5.72386 3.5 6V18C3.5 18.2761 3.72386 18.5 4 18.5V20L3.7959 19.9893C2.78722 19.887 2 19.0357 2 18V6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20V18.5C20.2761 18.5 20.5 18.2761 20.5 18Z"
        fill={props.fill || "#989DB8"}
      />
    </IconWrapper>
  );
};

export default Fold;
