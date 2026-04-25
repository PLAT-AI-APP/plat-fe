import React from "react";
import CharacterCreateForm from "./_components/CharacterCreateForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "캐릭터 생성",
};

const CharacterCreatPage = () => {
  return (
    <section
      id="character-create-main"
      className="flex flex-col flex-1 w-full mx-auto max-w-360 min-w-0 p-5"
    >
      <CharacterCreateForm />
    </section>
  );
};

export default CharacterCreatPage;
