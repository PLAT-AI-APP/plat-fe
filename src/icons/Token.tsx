import React from "react";
import { IconProps, IconWrapper } from ".";

const Token = (props: IconProps) => {
  return (
    <IconWrapper {...props} viewBox="0 0 70 70">
      <rect width="70" height="70" fill="url(#pattern0_2743_10179)" />
      <defs>
        <pattern
          id="pattern0_2743_10179"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            href="#image0_2743_10179"
            transform="translate(0 -0.0412234) scale(0.00265957)"
          />
        </pattern>
        <image
          id="image0_2743_10179"
          width="376"
          height="407"
          preserveAspectRatio="none"
          href="/images/token.png"
        />
      </defs>
    </IconWrapper>
  );
};

export default Token;
