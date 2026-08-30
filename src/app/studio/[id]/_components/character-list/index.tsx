"use client";
import React, { useEffect, useState } from "react";
import CharacterItem from "./CharacterItem";
import SkeletonCharacterList from "@/components/skeleton/SkeletonCharacterList";

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
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState(char);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
      {isLoading
        ? characters.map((v, index) => (
            <SkeletonCharacterList key={v.id + index} />
          ))
        : characters.map(
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
