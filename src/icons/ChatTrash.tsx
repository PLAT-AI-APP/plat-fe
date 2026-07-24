import React from "react";
import { IconProps, IconWrapper } from ".";

/** 채팅 응답 삭제 아이콘 */
const ChatTrash = (props: IconProps) => {
  return (
    <IconWrapper {...props} fill="none">
      <path
        d="M18.25 8.33333L17.3633 17.1979C17.2293 18.5416 17.1628 19.2129 16.8567 19.7207C16.5882 20.1676 16.1933 20.525 15.7219 20.7477C15.1868 21 14.5133 21 13.1622 21H10.6711C9.32106 21 8.64656 21 8.11139 20.7467C7.63961 20.5241 7.24437 20.1667 6.97561 19.7196C6.67161 19.2129 6.60406 18.5416 6.46894 17.1979L5.58333 8.33333M13.5 15.1944V9.91667M10.3333 15.1944V9.91667M4 5.69444H8.87139M8.87139 5.69444L9.27883 2.874C9.39706 2.361 9.8235 2 10.3133 2H13.5201C14.0098 2 14.4352 2.361 14.5545 2.874L14.9619 5.69444M8.87139 5.69444H14.9619M14.9619 5.69444H19.8333"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconWrapper>
  );
};

export default ChatTrash;
