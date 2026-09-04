"use client";

import { useNewWorkQuery } from "@/api/home/getNewWork";
import CharacterShowcase from "@/components/character/CharacterShowcase";
import NewCharacterHeader from "./_components/NewCharacterHeader";

const NewTabContents = () => {
  const { data: newWorkList } = useNewWorkQuery();

  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <NewCharacterHeader />

      <CharacterShowcase
        charArray={(newWorkList ?? []).map((character) => ({
          name: character.title,
          dec: character.description,
          creatorName: character.creator.nickname,
          chatCount: character.chatCount,
          img: character.images,
          isNew: true,
        }))}
        cardSize="S"
        columnGap={16}
        rowGap={28}
        gridFillMode="auto-fill"
      />
    </article>
  );
};

export default NewTabContents;
