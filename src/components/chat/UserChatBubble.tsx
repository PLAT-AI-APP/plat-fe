import React from "react";

interface UserChatBubbleProps {
  text: string;
}
const UserChatBubble = ({ text }: UserChatBubbleProps) => {
  return (
    <div className="flex justify-end">
      <span className="text-sm bg-brand px-3 py-2 rounded-[16px_0px_16px_16px]">
        {text}
      </span>
    </div>
  );
};

export default UserChatBubble;
