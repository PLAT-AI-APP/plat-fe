import CharacterShowcase from "@/components/character/CharacterShowcase";
import RankingHeader from "./_components/RankingHeader";
import { DUMMY_RANKED_CHARACTERS } from "./dummyData";

const RankingTabContents = () => {
  return (
    <article className="flex w-full flex-col gap-5 pt-5">
      <RankingHeader />

      <CharacterShowcase
        charArray={DUMMY_RANKED_CHARACTERS.map((character, index) => ({
          name: character.title,
          dec: character.description,
          creatorName: character.creatorName,
          chatCount: character.chatCount,
          img: character.image,
          rank: index + 1,
        }))}
        cardSize="S"
        columnGap={16}
        rowGap={28}
        gridFillMode="auto-fill"
      />
    </article>
  );
};

export default RankingTabContents;
