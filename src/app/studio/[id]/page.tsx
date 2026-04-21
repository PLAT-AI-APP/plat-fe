import { Metadata } from "next";
import React from "react";
import StudioContents from "./_components/StudioContents";

export const metadata: Metadata = {
  title: "스튜디오",
};

const StudioPage = () => {
  return <StudioContents />;
};

export default StudioPage;
