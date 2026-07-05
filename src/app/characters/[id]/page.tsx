import { Metadata } from "next";
import CharacterDetailContent from "./_components/detail-content";

export const metadata: Metadata = {
  title: "캐릭터 정보",
};

interface CharacterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const { id } = await params;

  return <CharacterDetailContent characterId={id} />;
}
