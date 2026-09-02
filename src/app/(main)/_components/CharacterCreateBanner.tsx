"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";

const CharacterCreateBanner = () => {
  const t = useTranslations("home");

  return (
    <section className="w-full h-64 relative bg-darkest bg-linear-to-r from-card-selected/0 from-80% to-card-selected rounded-2xl flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      {/* 왼쪽 텍스트 및 버튼 영역 */}
      <div
        id="banner-content"
        className="absolute left-13 top-0 h-full flex flex-col justify-center items-start gap-5"
      >
        <header className="flex flex-col justify-center items-start gap-1">
          <p className="body-5 text-font-2">{t("createPromptCaption")}</p>
          <h2 className="title-1 text-font-0">{t("createPromptTitle")}</h2>
        </header>

        {/* 버튼 */}
        <button
          type="button"
          className="w-60 px-8 py-3 bg-brand-opacity rounded-xl outline-1 -outline-offset-1 outline-brand-dark inline-flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Link href={"/character-creat"} className="title-3 text-brand-dark">
            {t("createCharacterCta")}
          </Link>
        </button>
      </div>

      {/* 오른쪽 이미지 영역 */}
      <Image
        src="/images/character-create-banner.png"
        alt=""
        width={381}
        height={234}
        className="w-96 h-96 absolute right-13 top-1/2 -translate-y-1/2 object-contain"
      />
    </section>
  );
};

export default CharacterCreateBanner;
