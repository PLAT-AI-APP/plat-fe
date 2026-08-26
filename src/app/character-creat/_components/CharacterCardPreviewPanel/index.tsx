"use client";

import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import PreviewAppliedElements from "./_components/PreviewAppliedElements";
import PreviewCard from "./_components/PreviewCard";

const CharacterCardPreviewPanel = () => {
  const t = useTranslations("characterCreate.cardPreview");
  const { control } = useFormContext<CharacterCreateFormValues>();
  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "characterIntroduce" });
  const image = useWatch({ control, name: "representativeImage" });

  // 카드 미리보기는 프로필 탭에서 입력한 값이 홈/목록 카드에 어떻게 보이는지 즉시 보여줍니다.
  const previewTitle = title?.trim() || t("titleFallback");
  const previewDescription = description?.trim() || t("descriptionFallback");
  const previewCreatorName = t("creatorFallback");

  return (
    <section className="flex h-[919px] max-h-[calc(100vh-145px)] w-[693px] shrink-0 flex-col justify-between overflow-y-auto rounded-3xl bg-darker p-4">
      <header className="flex h-12 items-center rounded-2xl bg-darkest px-4">
        <h2 className="title-3 text-font-1">{t("cardPreview")}</h2>
        <span className="body-2 px-3 text-font-2" aria-hidden="true">
          |
        </span>
        <p className="body-2 text-font-2">{t("detailPreview")}</p>
      </header>

      <div className="flex flex-1 items-start justify-center gap-[46px] pt-[145px]">
        <div className="flex flex-col gap-3">
          <p className="title-5 text-font-disabled">{t("cardOne")}</p>
          <PreviewCard
            size="S"
            image={image}
            title={previewTitle}
            description={previewDescription}
            creatorName={previewCreatorName}
            chatCount={235}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="title-5 text-font-disabled">{t("cardTwo")}</p>
          <PreviewCard
            size="M"
            image={image}
            title={previewTitle}
            description={previewDescription}
            creatorName={previewCreatorName}
            chatCount={235}
          />
        </div>
      </div>

      <PreviewAppliedElements />
    </section>
  );
};

export default CharacterCardPreviewPanel;
