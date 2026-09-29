import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Studio",
};

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * 스튜디오는 아직 서버와 연결되지 않은 목업이다(통계·목록이 전부 더미). 진입 링크는 없지만 주소로 들어올 수 있어,
 * 연결되기 전까지는 같은 제작자의 프로필로 보낸다. 화면 코드(_components)는 연결 작업 때 다시 쓴다.
 */
const StudioPage = async ({ params }: Props) => {
  const { id } = await params;

  redirect(`/profile/${id}`);
};

export default StudioPage;
