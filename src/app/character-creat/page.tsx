import React from "react";
import { Metadata } from "next";
import CharacterCreateForm from "./_components/CharacterCreateForm";

export const metadata: Metadata = {
  title: "Character Create",
};

const CharacterCreatPage = () => {
  return (
    <section
      id="character-create-main"
      className="mx-auto flex w-full max-w-[1200px] min-w-0 flex-1 flex-col px-0 py-4"
    >
      <CharacterCreateForm />
    </section>
  );
};

export default CharacterCreatPage;
