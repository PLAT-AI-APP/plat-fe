import React from "react";
import CharacterCreateForm from "./_components/CharacterCreateForm";

const CharacterCreatPage = () => {
  return (
    <section
      id="character-create-main"
      className="flex flex-col flex-1 w-full mx-auto max-w-300 min-w-0 p-5 h-[calc(100vh-60px)]"
    >
      <CharacterCreateForm />
    </section>
  );
};

export default CharacterCreatPage;
