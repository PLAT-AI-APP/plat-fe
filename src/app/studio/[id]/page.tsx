import type { Metadata } from "next";
import React from "react";
import StudioContents from "./_components/StudioContents";

export const metadata: Metadata = {
  title: "Studio",
};

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const StudioPage = async ({ params, searchParams }: Props) => {
  const { id } = await params;
  const sParams = await searchParams;

  const viewMode = (sParams.view as "list" | "grid") || "list";
  const sort = (sParams.sort as "latest" | "chats") || "latest";

  return <StudioContents id={id} sort={sort} viewMode={viewMode} />;
};

export default StudioPage;
