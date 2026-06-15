"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

const CharacterCreatePrompt = () => {
  const t = useTranslations("home");

  return (
    <section
      aria-labelledby="character-create-prompt-title"
      className="flex w-full flex-col items-center justify-center gap-7 pb-18"
    >
      <div className="flex w-full flex-col items-center gap-2.75 text-center">
        <p className="body-2 w-full text-font-2">
          {t("createPromptCaption")}
        </p>
        <h2
          id="character-create-prompt-title"
          className="heading-3 w-full text-font-1"
        >
          {t("createPromptTitle")}
        </h2>
      </div>

      <Link
        href="/character-creat"
        className="title-3 flex w-77 items-center justify-center rounded-2xl bg-brand-opacity px-4 py-4 text-brand-dark hover:opacity-90"
      >
        {t("createCharacter")}
      </Link>
    </section>
  );
};

export default CharacterCreatePrompt;
