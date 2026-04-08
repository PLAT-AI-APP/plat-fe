import { CommentType } from "@/type/comment";
import React from "react";
import MyPostItem from "./MyPostItem";

const POSTS_MOCK: CommentType[] = [
  {
    id: "comment-1",
    author: {
      id: "user-1",
      name: "데규르르",
      profileImage: "/p1.png",
      isCreator: true,
    },
    content:
      "[📌 신규 업데이트 가이드]\n\n안녕하세요, 크리에이터 데규르르입니다! 이번 패치로 마신 숭배 집단 '라엘크라이'가 새롭게 추가되었습니다.\n\n주요 변경 사항은 다음과 같습니다:\n1. 신규 지역 '침식된 성소' 오픈\n2. 라엘크라이 전용 장비 세트 5종 추가\n3. 마법사 계열 클래스 밸런스 조정\n\n기존보다 난이도가 다소 높으니 파티 구성에 유의해 주세요. 여러분의 피드백은 언제나 환영입니다! 즐거운 모험 되시길 바랍니다.",
    createdAt: "2026-03-26T10:00:00Z",
    likes: 385,
    replyCount: 12,
    replies: [],
  },
  {
    id: "comment-2",
    author: {
      id: "user-2",
      name: "가나다라마바사",
      profileImage: "/p2.png",
      isCreator: false,
    },
    content:
      "와, 이번 업데이트 실화인가요? UI 가독성이 말도 안 되게 좋아졌네요. 특히 퀘스트 로그 창에서 텍스트 줄 간격이랑 폰트 크기 밸런스가 너무 잘 잡혀서 장시간 플레이해도 눈이 하나도 안 피로해요. \n\n이전에는 가끔 텍스트가 겹쳐 보여서 가독성이 떨어지는 구간이 있었는데, 이번 시맨틱 마크업 최적화 덕분인지 로딩 속도도 체감상 훨씬 빨라진 것 같습니다. 갓겜 인정합니다!!",
    createdAt: "2026-03-26T09:30:00Z",
    likes: 12,
    replyCount: 3,
  },
  {
    id: "comment-3",
    author: {
      id: "user-3",
      name: "무야호",
      profileImage: "/p3.png",
      isCreator: false,
    },
    content:
      "드디어 라엘크라이가 나왔군요! 오늘 오전부터 커뮤니티 난리 났길래 궁금해 죽는 줄 알았습니다... 지금 회사인데 손가락이 근질근질하네요. 칼퇴하고 바로 접속해서 신규 던전부터 뚫어보겠습니다. 오늘 밤은 밤샘 확정이네요! ㅋㅋ",
    createdAt: "2026-03-27T09:35:00Z",
    likes: 5,
    replyCount: 1,
  },
];
const Community = () => {
  return (
    <section>
      {/* 사용자가 작성한 게시글 */}
      <ul className="flex flex-col">
        {POSTS_MOCK.map((comment) => (
          <MyPostItem key={comment.id} comment={comment} lineClamp={5} />
        ))}
      </ul>
    </section>
  );
};

export default Community;
