import { Metadata } from "next";
import { connection } from "next/server";
import HomeContents from "./_components/HomeContents";

export const metadata: Metadata = {
  title: "home",
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
