"use client";
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <ul className="flex flex-col gap-3">
      {isLoading
        ? char.map((v, index) => <SkeletonCharacterList key={v.id + index} />)
        : char.map(
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
                />
              </li>
            ),
          )}
    </ul>
  );
};

export default CharacterList;
