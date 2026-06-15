"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CharacterMenuPopover from "@/components/popover/CharacterMenuPopover";
import useToggle from "@/hooks/useToggle";
import { ChatFill, Dots } from "@/icons";
import { formatStatCount } from "@/lib/utils";

interface CharacterItemProps {
  chatCount: number;
  id: string;
  isPublic: boolean;
  tagList: string[];
  thumbnail: string;
  title: string;
  description: string;
}

const CharacterItem = ({
  chatCount,
  id,
  isPublic,
  tagList,
  thumbnail,
  title,
  description,
}: CharacterItemProps) => {
  const selectorT = useTranslations("selector");
  const profileT = useTranslations("profile");
  const studioT = useTranslations("studio");
  const router = useRouter();
  const triggerRef = useRef(null);
  const { isOpen, toggle } = useToggle();

  const handleCardClick = () => {
    if (!isOpen) {
      router.push(`/characters/${id}`);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="flex cursor-pointer gap-2 rounded-2xl px-3 py-2.5 hover:bg-card"
    >
      <Image
        src={thumbnail}
        alt={studioT("characterImageAlt", { title })}
        width={82}
        height={82}
        className="h-20.5 w-20.5 rounded-xl"
      />

      <div
        id="character-info-container"
        className="flex flex-1 flex-col justify-between"
      >
        <section className="flex flex-col">
          <header className="flex items-center justify-between">
            <h3 className="title-3">{title}</h3>
            <div className="relative">
              <button
                ref={triggerRef}
                type="button"
                onClick={toggle}
                aria-label={profileT("moreMenu")}
              >
                <Dots className="h-3.5 w-3.5 text-font-2" />
              </button>

              {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                  <CharacterMenuPopover
                    onClose={toggle}
                    triggerRef={triggerRef}
                    onDelete={() => null}
                    onEdit={() => null}
                  />
                </div>
              )}
            </div>
          </header>

          <p className="body-6 line-clamp-1 whitespace-pre-line pr-5.5 text-font-2">
            {description}
          </p>

          <footer className="body-6 flex gap-1 pb-0.5 pt-1 text-font-2">
            <span className="flex items-center gap-1">
              <ChatFill className="h-3.5 w-3.5" />
              {formatStatCount(chatCount)}
            </span>
            <span aria-hidden="true">쨌</span>
            <span>{isPublic ? selectorT("public") : selectorT("private")}</span>
          </footer>
        </section>

        <aside className="flex items-center gap-1.5 text-font-2">
          <ul className="flex gap-0.5">
            {tagList.map((tag, index) => (
              <li key={index} className="text-[11px] text-brand-dark">
                #{tag}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
};

export default CharacterItem;
