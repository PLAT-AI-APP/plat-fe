import React from "react";
import { Metadata } from "next";
import CreatorTierContents from "./_components/CreatorTierContents";

export const metadata: Metadata = {
  title: "크리에이터 등급",
};

const CreatorTierPage = () => <CreatorTierContents />;

export default CreatorTierPage;
