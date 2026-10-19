import React from "react";
import { Metadata } from "next";
import CharacterEarningList from "./CharacterEarningList";

export const metadata: Metadata = {
  title: "캐릭터별 수익",
};

const CharacterEarningListPage = () => <CharacterEarningList />;

export default CharacterEarningListPage;
