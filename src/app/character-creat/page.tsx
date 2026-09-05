import React from "react";
import { Metadata } from "next";
import CharacterCreateForm from "./_components/CharacterCreateForm";

export const metadata: Metadata = {
  title: "Character Create",
};

interface CharacterCreatPageProps {
  searchParams: Promise<{
    universeId?: string;
  }>;
}

const CharacterCreatPage = async ({
  searchParams,
}: CharacterCreatPageProps) => {
  const { universeId } = await searchParams;

  return (
    <section
      id="character-create-main"
      className="mx-auto flex w-full max-w-(--content-max-width) min-w-0 flex-1 flex-col px-0 py-4"
    >
      <CharacterCreateForm universeId={universeId} />
    </section>
  );
};

export default CharacterCreatPage;
