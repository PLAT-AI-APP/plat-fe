import CharacterCard from "../character-card";
import NewCharacterHeader from "./_components/NewCharacterHeader";
import { DUMMY_NEW_CHARACTERS } from "./dummyData";

const NewTabContents = () => {
  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <NewCharacterHeader />

      <div className="flex w-full flex-wrap gap-x-4 gap-y-7">
        {DUMMY_NEW_CHARACTERS.map((character) => (
          <CharacterCard
            key={character.id}
            size="S"
            title={character.title}
            description={character.description}
            creatorName={character.creatorName}
            chatCount={character.chatCount}
            images={character.image}
            isNew
          />
        ))}
      </div>
    </article>
  );
};

export default NewTabContents;
