/** 고객센터(Q&A·FAQ) 캐시 키의 단일 출처. */
export const qnaQueryKeys = {
  /** 내 문의 목록·단건을 한 번에 무효화할 때 쓰는 접두사 */
  mine: () => ["get-my-qna"] as const,
  myList: (size?: number) => [...qnaQueryKeys.mine(), "list", size] as const,
  faqList: () => ["get-faq-list"] as const,
};
