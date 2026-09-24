import SkeletonCharacterCreate from "@/components/skeleton/SkeletonCharacterCreate";

/** 동적 라우트라 이 파일이 없으면 "캐릭터 만들기"를 눌러도 서버 응답 전까지 화면이 그대로였다. */
const Loading = () => (
  <section className="mx-auto flex w-full max-w-(--content-max-width) min-w-0 flex-1 flex-col px-0 py-4">
    <SkeletonCharacterCreate />
  </section>
);

export default Loading;
