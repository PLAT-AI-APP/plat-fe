"use client";

import { useNewWorkQuery } from "@/api/home/getNewWork";
import CharacterCard from "../character-card";
import { getCardGridTemplateColumns } from "../character-card/constants";
import NewCharacterHeader from "./_components/NewCharacterHeader";

const NewTabContents = () => {
  const { data: newWorkList } = useNewWorkQuery();

  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <NewCharacterHeader />

      <div
        className="grid w-full gap-x-4 gap-y-7"
        style={{
          gridTemplateColumns: getCardGridTemplateColumns("S"),
        }}
      >
        {(newWorkList ?? []).map((character) => (
          <CharacterCard
            key={character.universeId}
            size="S"
            title={character.title}
            description={character.description}
            creatorName={character.creator.nickname}
            chatCount={character.chatCount}
            images={character.images}
            isNew
            fluid
          />
        ))}
      </div>
    </article>
  );
};

export default NewTabContents;
