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

  // 목록의 신원은 배열 위치가 아니라 id 다. 위치로 지우면 상위가 목록을
  // 다시 받아오거나 정렬이 바뀐 사이에 클릭하면 엉뚱한 캐릭터가 지워진다.
  const handleCharacterDeleted = (deletedId: string) => {
    setCharacters((prevCharacters) =>
      prevCharacters.filter((character) => character.id !== deletedId),
    );
  };

  return (
    <ul className="flex flex-col gap-3">
      {characters.map(({ chatCount, id, isPublic, dec, img, name, tag }) => (
        <li key={id}>
          <CharacterItem
            description={dec}
            chatCount={chatCount}
            id={id}
            isPublic={isPublic}
            tagList={tag || []}
            thumbnail={img}
            title={name}
            onDeleted={() => handleCharacterDeleted(id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default CharacterList;
