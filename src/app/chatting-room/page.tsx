import { Metadata } from "next";
import ChattingRoomSection from "./_components/chatting-room-section";

export const metadata: Metadata = {
  title: "채팅중",
};

const ChattingRoomPage = () => {
  return (
    <section className="flex h-full min-h-0">
      <ChattingRoomSection />
    </section>
  );
};

export default ChattingRoomPage;
