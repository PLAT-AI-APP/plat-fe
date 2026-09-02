import CharacterCard from "../character-card";
import { getCardGridTemplateColumns } from "../character-card/constants";
import RankingHeader from "./_components/RankingHeader";
import { DUMMY_RANKED_CHARACTERS } from "./dummyData";

const RankingTabContents = () => {
  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <RankingHeader />

      <div
        className="grid w-full gap-x-4 gap-y-7"
        style={{
          gridTemplateColumns: getCardGridTemplateColumns("S"),
        }}
      >
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
            fluid
          />
        ))}
      </div>
    </article>
  );
};

export default RankingTabContents;
