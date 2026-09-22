"use client";

import React from "react";
import { useTranslations } from "next-intl";
import ButtonLink from "@/components/ui/ButtonLink";
import NotFoundScene from "@/components/state/NotFoundScene";

const NotFoundPage = () => {
  const t = useTranslations("errorPage");

  return (
    <section
      id="not-found-container"
      className="flex flex-1 flex-col items-center justify-center"
    >
      <NotFoundScene
        title={t("notFoundTitle")}
        description={t("notFoundHint")}
        actions={
          <ButtonLink id="back-to-home-link" href="/" size="lg" fullWidth>
            {t("backHome")}
          </ButtonLink>
        }
      />
    </section>
  );
};

export default NotFoundPage;
