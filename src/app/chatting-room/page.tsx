import { Metadata } from "next";
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

  return (
    <section className="flex h-full min-h-0">
      <ChattingRoomSection roomId={roomId} />
    </section>
  );
};

export default ChattingRoomPage;
