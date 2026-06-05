import { Metadata } from "next";
import ChattingRoomSection from "./_components/chatting-room-section";

export const metadata: Metadata = {
  title: "채팅중",
};

const ChattingRoomPage = () => {
  return (
    <section className="flex gap-4 h-[calc(100vh-60px)]">
      <ChattingRoomSection />
    </section>
  );
};

export default ChattingRoomPage;
