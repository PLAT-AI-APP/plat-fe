import { Metadata } from "next";
import { connection } from "next/server";
import HomeContents from "./_components/HomeContents";

export const metadata: Metadata = {
  // 클라이언트가 그리는 제목(pageTitles.home)과 같게 둔다. 첫 HTML·공유 미리보기에 영어 "home" 이 나가지 않게.
  title: "캐릭터 둘러보기",
};

/*
 * 탭 선택은 HomeContents 가 주소에서 직접 읽는다. 여기서는 요청마다 렌더되게만 해 둔다 —
 * 정적으로 미리 만들면 useSearchParams 를 쓰는 부분이 첫 HTML 에서 빠져, 배너가 늦게 뜬다.
 */
const Home = async () => {
  await connection();

  return <HomeContents />;
};

export default Home;
