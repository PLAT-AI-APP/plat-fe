"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import ActiveButton from "../ActiveButton";
import { ModalLayout } from "../ModalLayout";
import { useHashtagListQuery } from "@/api/hashtag/getHashtagList";
import { ArrowRight, Close, Megaphone, Search } from "@/icons";
import Tag from "@/icons/Tag";
import { cn } from "@/lib/utils";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import { useModalStore } from "@/store/useModalStore";
import { TagAddModalProps } from "@/type/modal";

const TagAddModal = ({ onClose }: TagAddModalProps) => {
  const t = useTranslations("characterCreate.tagModal");
  const { control, setValue } = useFormContext<CharacterCreateFormValues>();
  const currentTagsWatch = useWatch({ control, name: "tagIds" });
  const [localSelectedNames, setLocalSelectedNames] = useState<
    { id: number; label: string }[]
  >(() => {
    const currentTags = currentTagsWatch || [];
    return currentTags.map((tag) => ({ id: tag.id, label: tag.label }));
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const { data: hashtagListData } = useHashtagListQuery();
  const hashtagList = hashtagListData?.tags || [];
  const filteredTags = hashtagList
    .filter((tag) =>
      tag.label.toLowerCase().includes(searchKeyword.toLowerCase()),
    )
    .sort((a, b) => {
      const aSelected = localSelectedNames.some((name) => name.label === a.label);
      const bSelected = localSelectedNames.some((name) => name.label === b.label);

      if (aSelected !== bSelected) {
        return aSelected ? -1 : 1;
      }
      return a.label.localeCompare(b.label, "ko");
    });

  const handleTagToggle = (tag: { id: number; label: string }) => {
    const isAlreadySelected = localSelectedNames.some((name) => name.id === tag.id);

    if (isAlreadySelected) {
      setLocalSelectedNames((prev) => prev.filter((name) => name.id !== tag.id));
      return;
    }

    if (localSelectedNames.length >= 5) {
      alert(t("maxAlert"));
      return;
    }

    setLocalSelectedNames((prev) => [...prev, tag]);
  };

  const handleComplete = () => {
    setValue("tagIds", localSelectedNames, {
      shouldDirty: true,
      shouldValidate: true,
    });
    onClose();
  };

  const { openModal } = useModalStore();

  return (
    <ModalLayout onClose={onClose} hasBackground className="w-112.5 p-5">
      <div id="tag-manager-root" className="flex flex-col">
        <header className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <Tag aria-hidden="true" />
            <h2 className="title-1">{t("title")}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-5.5 w-5.5 items-center justify-center rounded-lg p-1 hover:bg-btn-hover"
          >
            <Close className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="group relative flex w-full items-center pb-3">
          <input
            id="search-input"
            type="text"
            value={searchKeyword}
            className="body-4 h-10 w-full rounded-xl border border-border-main bg-bg-darker px-4 pl-10 transition-all placeholder:text-font-disabled focus:border-font-1 focus:outline-none"
            placeholder={t("searchPlaceholder")}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <label
            htmlFor="search-input"
            className="pointer-events-none absolute left-4"
          >
            <Search className="h-4.5 w-4.5 text-font-disabled" />
          </label>
        </div>

        <nav>
          <ul className="flex max-h-85 min-h-85 flex-wrap gap-x-2.5 gap-y-2 overflow-auto rounded-xl bg-bg-darker p-2.5">
            {filteredTags.map((tag) => {
              const isSelected = localSelectedNames.some(
                (name) => name.id === tag.id,
              );

              return (
                <li key={tag.id}>
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      "cursor-pointer rounded-md border border-transparent bg-card px-1.5 py-0.75 text-xs transition-colors hover:bg-card-hover",
                      isSelected && "bg-brand-opacity text-brand",
                    )}
                  >
                    #{tag.label}
                  </button>
                </li>
              );
            })}
            {filteredTags.length === 0 && (
              <p className="w-full py-10 text-center text-xs text-font-disabled">
                {t("empty")}
              </p>
            )}
          </ul>
        </nav>

        <footer className="mt-4 flex h-10.25 gap-3">
          <button
            type="button"
            onClick={() => openModal("TAG_SUGGESTIONS", {})}
            className="flex flex-1 items-center justify-between rounded-xl bg-card p-3 text-xs text-font-2 transition-colors hover:bg-card-hover"
          >
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="body-6">{t("request")}</span>
            </div>
            <ArrowRight className="h-3 w-3" />
          </button>

          <ActiveButton
            onClick={handleComplete}
            text={t("complete")}
            isActive
            className="h-full w-fit px-5 py-2.25"
          />
        </footer>
      </div>
    </ModalLayout>
  );
};

export default TagAddModal;
