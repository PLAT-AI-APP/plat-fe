"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCharacterScenarioListQuery } from "@/api/character/getCharacterScenarioList";
import ActiveButton from "@/components/ActiveButton";
import { formatStatCount } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { CharacterScenario } from "@/type/character";

interface CharacterProfileProps {
  imageSrc: string;
  creatorImage: string;
  creatorName: string;
  followerCount: number;
  characterId: string;
}

const CharacterProfile = ({
  imageSrc,
  creatorImage,
  creatorName,
  followerCount,
  characterId,
}: CharacterProfileProps) => {
  const t = useTranslations();
  const { data: scenarios } = useCharacterScenarioListQuery(characterId);
  const [currentScenario, setCurrentScenario] = useState<
    CharacterScenario | undefined
  >(scenarios?.[0]);

  if (!currentScenario && scenarios && scenarios.length > 0) {
    setCurrentScenario(scenarios[0]);
  }

  const { openModal } = useModalStore();

  if (!scenarios || scenarios.length === 0) {
    return <div>{t("characterDetail.noScenario")}</div>;
  }

  return (
    <section className="flex max-w-100 flex-col gap-4">
      <Image
        src={imageSrc}
        alt={t("characterDetail.mainImageAlt")}
        width={500}
        height={500}
        className="aspect-square rounded-2xl object-cover"
      />

      <div className="flex gap-3">
        <ActiveButton
          text={t("characterDetail.chat")}
          isActive
          className="rounded-xl"
          onClick={() =>
            openModal("CHATTING_START", {
              scenarioList: scenarios,
              currentScenario,
              setCurrentScenario,
            })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Image
            src={creatorImage}
            alt={t("characterDetail.creatorImageAlt")}
            width={40}
            height={40}
            className="aspect-square rounded-full object-cover"
          />
          <div className="flex flex-col gap-0.5">
            <Link href="/" className="body-2 text-font-1 hover:underline">
              {creatorName}
            </Link>
            <span className="body-6 text-font-2">
              {t("characterDetail.followers", {
                count: formatStatCount(followerCount),
              })}
            </span>
          </div>
        </div>
        <button className="title-5 rounded-[10px] bg-font-1 px-2.5 py-1 text-bg-dark">
          {t("characterDetail.follow")}
        </button>
      </div>
    </section>
  );
};

export default CharacterProfile;
