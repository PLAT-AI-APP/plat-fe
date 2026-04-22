import React, { useEffect, useState } from "react";
import CharacterItem from "./CharacterItem";
import SkeletonCharacterList from "@/components/skeleton/SkeletonCharacterList";

interface CharacterListProps {
  char: {
    id: number;
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string;
    isPublic: boolean;
  }[];
}
const CharacterList = ({ char }: CharacterListProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2. 여기서는 데이터를 가져오는 로직만 수행하고, 완료되면 false로만 바꿉니다.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <ul className="flex flex-col gap-3">
      {isLoading
        ? char.map((_, index) => <SkeletonCharacterList key={index} />)
        : char.map(({ chatCount, id, isPublic, dec, img, name, tag }) => (
            <li key={id}>
              <CharacterItem
                description={dec}
                chatCount={chatCount}
                id={id}
                isPublic={isPublic}
                tagList={tag || []}
                thumbnail={img}
                title={name}
              />
            </li>
          ))}
    </ul>
  );
};

export default CharacterList;
