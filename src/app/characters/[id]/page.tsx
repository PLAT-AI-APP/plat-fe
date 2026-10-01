import { Metadata } from "next";
import CharacterDetailContent from "./_components/detail-content";

const DEFAULT_TITLE = "캐릭터 정보";
/** 제목 하나 때문에 첫 화면이 늦어지지 않게, 이 안에 못 받으면 기본 제목으로 그린다. */
const TITLE_FETCH_TIMEOUT_MS = 1500;
/** 같은 캐릭터의 제목은 잠시 캐시해 방문마다 서버에 묻지 않는다. */
const TITLE_REVALIDATE_SECONDS = 300;

/**
 * 공유 미리보기·탭 제목에 캐릭터 이름이 보이게 한다. 비로그인으로 공개 세계관 상세를 한 번 읽고,
 * 비공개·삭제·타임아웃 등 어떤 실패든 기본 제목으로 둔다(화면 본문은 클라이언트가 따로 받는다).
 */
export async function generateMetadata({
  params,
}: CharacterDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const baseUri = process.env.NEXT_PUBLIC_BASE_URI?.replace(/\/$/, "");
  if (!baseUri || !/^\d+$/.test(id)) return { title: DEFAULT_TITLE };

  try {
    const response = await fetch(`${baseUri}/universe/${id}`, {
      headers: { "Accept-Language": "ko" },
      signal: AbortSignal.timeout(TITLE_FETCH_TIMEOUT_MS),
      next: { revalidate: TITLE_REVALIDATE_SECONDS },
    });
    if (!response.ok) return { title: DEFAULT_TITLE };

    const detail = (await response.json()) as {
      title?: string;
      character?: { name?: string | null };
    };
    const name = detail.character?.name?.trim() || detail.title?.trim();
    return { title: name || DEFAULT_TITLE };
  } catch {
    return { title: DEFAULT_TITLE };
  }
}

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
