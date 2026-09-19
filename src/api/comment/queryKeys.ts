/**
 * 댓글 관련 캐시 키의 단일 출처.
 *
 * 두 키 모두 로그인 여부(liked 유무가 달라진다)가 뒤에 붙어 캐시가 갈리므로, 조회 훅은
 * 이 접두사 뒤에 그 값을 덧붙이고 변경 쪽은 접두사만 써서 두 캐시를 함께 무효화한다.
 */
export const commentQueryKeys = {
  /** 세계관의 댓글 목록 */
  universeComments: (universeId?: string) =>
    ["get-universe-comments", universeId] as const,
  /** 댓글의 답글 목록 */
  replies: (commentId?: string) => ["get-comment-replies", commentId] as const,
};
