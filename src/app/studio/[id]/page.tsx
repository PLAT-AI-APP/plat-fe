import { Metadata } from "next";
import React from "react";
import StudioContents from "./_components/StudioContents";

export const metadata: Metadata = {
  title: "스튜디오",
};

interface Props {
  params: Promise<{ id: string }>; // URL 경로에 있는 id
}

const StudioPage = async ({ params }: Props) => {
  const { id } = await params;

  return <StudioContents id={id} />;
};

export default StudioPage;
