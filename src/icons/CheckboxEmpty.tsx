import React from "react";
import { IconProps, IconWrapper } from ".";

const CheckboxEmpty = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <path d="M18 20.5V22H6V20.5H18ZM20.5 18V6C20.5 4.61929 19.3807 3.5 18 3.5H6C4.61929 3.5 3.5 4.61929 3.5 6V18C3.5 19.3807 4.61929 20.5 6 20.5V22L5.79395 21.9951C3.68056 21.8879 2 20.14 2 18V6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22V20.5C19.3807 20.5 20.5 19.3807 20.5 18Z" />
    </IconWrapper>
  );
};

export default CheckboxEmpty;
