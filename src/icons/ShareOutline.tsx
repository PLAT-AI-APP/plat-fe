import React from "react";
import { IconProps, IconWrapper } from ".";

const ShareOutline = (props: IconProps) => {
  return (
    <IconWrapper {...props}>
      <path
        d="M15.75 9H17.625C18.1223 9 18.5992 9.19754 18.9508 9.54917C19.3025 9.90081 19.5 10.3777 19.5 10.875V19.875C19.5 20.3723 19.3025 20.8492 18.9508 21.2008C18.5992 21.5525 18.1223 21.75 17.625 21.75H6.375C5.87772 21.75 5.40081 21.5525 5.04917 21.2008C4.69754 20.8492 4.5 20.3723 4.5 19.875V10.875C4.5 10.3777 4.69754 9.90081 5.04917 9.54917C5.40081 9.19754 5.87772 9 6.375 9H8.25M8.25 6L12 2.25L15.75 6M12 2.25V15.0469"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </IconWrapper>
  );
};

export default ShareOutline;
