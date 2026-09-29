import { Metadata } from "next";
import { redirect } from "next/navigation";
import ChattingRoomSection from "./_components/chatting-room-section";

export const metadata: Metadata = {
  title: "채팅중",
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ChattingRoomPage = async ({ searchParams }: Props) => {
  const sParams = await searchParams;
  const roomId = typeof sParams.roomId === "string" ? sParams.roomId : "";
  // 방 id 없이 들어오면 조회가 꺼진 채 스켈레톤만 남는다. 고를 수 있는 목록으로 보낸다.
  if (!roomId) redirect("/my-chatting");

  return (
    <section className="flex h-full min-h-0">
      {/* 같은 화면에서 roomId 만 바뀌어도 턴·입력·스크롤 상태가 이전 방 것을 들고 있지 않게 새로 마운트한다. */}
      <ChattingRoomSection key={roomId} roomId={roomId} />
    </section>
  );
};

export default ChattingRoomPage;
