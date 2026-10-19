import React from "react";
import { Metadata } from "next";
import CharacterEarningDetail from "./CharacterEarningDetail";

export const metadata: Metadata = {
  title: "캐릭터 수익",
};

const CharacterEarningPage = async ({
  params,
}: {
  params: Promise<{ universeId: string }>;
}) => {
  const { universeId } = await params;
  return <CharacterEarningDetail universeId={universeId} />;
};

export default CharacterEarningPage;
