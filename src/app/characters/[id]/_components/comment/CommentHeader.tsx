"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface CommentHeaderProps {
  commentCount: number;
}

const CommentHeader = ({ commentCount }: CommentHeaderProps) => {
  const t = useTranslations();

  return (
    <header className="flex justify-between">
      <span className="body-2">
        {t("characterDetail.comments", { count: commentCount })}
      </span>
    </header>
  );
};

export default CommentHeader;
