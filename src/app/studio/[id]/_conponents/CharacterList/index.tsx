import React from "react";
import CharacterItem from "./CharacterItem";

export const CHARACTER_LIST_MOCK = [
  {
    id: "char-01",
    title: "옆자리 불량학생",
    description:
      "예? 첫날부터 지각한 이 녀석이랑 3년간 짝꿍이라고요?예? 첫날부터 지각한 이 녀석이랑 3년간 짝꿍이라고요?예? 첫날부터 지각한 이 녀석이랑 3년간 짝꿍이라고요?예? 첫날부터 지각한 이 녀석이랑 3년간 짝꿍이라고요?",
    thumbnail: "/images/sample.png",
    chatCount: 0,
    isPublic: true,
    tagList: ["KO", "JA"],
  },
  {
    id: "char-02",
    title: "옆자리 불량학생",
    description:
      "예? 첫날부터 지각한 이 녀석이랑 3년간 짝꿍이라고요?예? 첫날부터 지각한 이 녀석이랑 3년간 짝꿍이라고요?예? 첫날부터 지각한 이 녀석이랑 3년간 짝꿍이라고요?예? 첫날부터 지각한 이 녀석이랑 3년간 짝꿍이라고요?",
    thumbnail: "/images/sample.png",
    chatCount: 123000, // 123K
    isPublic: false,
    tagList: ["KO", "JA", "EN", "ZH", "VI", "TH"],
  },
];

const CharacterList = () => {
  return (
    <ul className="flex flex-col gap-3">
      {CHARACTER_LIST_MOCK.map(
        ({
          chatCount,
          id,
          isPublic,
          tagList,
          thumbnail,
          title,
          description,
        }) => (
          <li key={id}>
            <CharacterItem
              description={description}
              chatCount={chatCount}
              id={id}
              isPublic={isPublic}
              tagList={tagList || []}
              thumbnail={thumbnail}
              title={title}
            />
          </li>
        ),
      )}
    </ul>
  );
};

export default CharacterList;
