import SkeletonChatMessages from "@/components/skeleton/SkeletonChatMessages";

/**
 * 채팅방은 roomId 를 주소에서 읽는 동적 라우트라, 이 파일이 없으면 목록에서 방을 눌러도 서버 응답이
 * 올 때까지 이전 화면이 그대로 멈춰 있었다. 방 화면과 같은 틀(ChattingRoomSection)에 말풍선 모양을 둔다.
 */
const Loading = () => (
  <section className="flex h-full min-h-0">
    <div className="flex h-full min-h-0 flex-1 justify-center bg-dark pt-2">
      <div className="w-full max-w-[867px]">
        <SkeletonChatMessages />
      </div>
    </div>
  </section>
);

export default Loading;
