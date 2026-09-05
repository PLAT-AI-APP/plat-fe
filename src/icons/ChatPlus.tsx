import React from "react";
import { IconProps, IconWrapper } from ".";

/** 채팅 추가 아이콘 */
const ChatPlus = (props: IconProps) => {
  return (
    <IconWrapper {...props} fill="none">
      <path
        d="M12 20C16.97 20 21 16.418 21 12C21 7.582 16.97 4 12 4C7.03 4 3 7.582 3 12C3 13.574 3.512 15.042 4.395 16.28L3 20L7.745 19.051C9.0752 19.6796 10.5288 20.0038 12 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12H15.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M12.0039 8.5L12.0039 15.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </IconWrapper>
  );
};

export default ChatPlus;
