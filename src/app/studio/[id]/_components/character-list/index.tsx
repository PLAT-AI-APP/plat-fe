"use client";
import React, { useEffect, useState } from "react";
import CharacterItem from "./CharacterItem";

interface CharacterListProps {
  char: {
    id: string;
    name: string;
    chatCount: number;
    dec: string;
    tag: string[];
    img: string;
    isPublic: boolean;
  }[];
}

const CharacterList = ({ char }: CharacterListProps) => {
  // 예전에는 setTimeout(3000) 으로 로딩을 흉내 내, 목록이 이미 있는데도 3초간
  // 스켈레톤이 떠 있었다. 실제 로딩 여부는 데이터를 가져오는 상위가 알아야 한다.
  const [characters, setCharacters] = useState(char);

  useEffect(() => {
    setCharacters(char);
  }, [char]);

  const handleCharacterDeleted = (index: number) => {
    setCharacters((prevCharacters) =>
      prevCharacters.filter((_, characterIndex) => characterIndex !== index),
    );
  };

  return (
    <ul className="flex flex-col gap-3">
      {characters.map(
        ({ chatCount, id, isPublic, dec, img, name, tag }, index) => (
          <li key={index}>
            <CharacterItem
              description={dec}
              chatCount={chatCount}
              id={id}
              isPublic={isPublic}
              tagList={tag || []}
              thumbnail={img}
              title={name}
              onDeleted={() => handleCharacterDeleted(index)}
            />
          </li>
        ),
      )}
    </ul>
  );
};

export default CharacterList;
