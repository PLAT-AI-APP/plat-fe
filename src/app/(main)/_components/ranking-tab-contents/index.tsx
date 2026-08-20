import CharacterCard from "../character-card";
import RankingHeader from "./_components/RankingHeader";
import { DUMMY_RANKED_CHARACTERS } from "./dummyData";

const RankingTabContents = () => {
  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <RankingHeader />

      <div className="flex w-full flex-wrap gap-x-4 gap-y-7">
        {DUMMY_RANKED_CHARACTERS.map((character, index) => (
          <CharacterCard
            key={character.id}
            size="S"
            rank={index + 1}
            title={character.title}
            description={character.description}
            creatorName={character.creatorName}
            chatCount={character.chatCount}
            images={character.image}
          />
        ))}
      </div>
    </article>
  );
};

export default RankingTabContents;
