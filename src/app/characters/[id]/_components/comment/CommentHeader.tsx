import React from "react";

interface CommentHeaderProps {
  commentCount: number;
}
const CommentHeader = ({ commentCount }: CommentHeaderProps) => {
  return (
    <header className="flex justify-between">
      <span>댓글 {commentCount}개</span>
    </header>
  );
};

export default CommentHeader;
