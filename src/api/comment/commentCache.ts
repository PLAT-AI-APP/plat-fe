import type { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import type { Comment } from "@/type/comment";
import { commentQueryKeys } from "./queryKeys";

/**
 * 댓글 변경을 서버 응답 전에 화면에 먼저 반영하기 위한 캐시 도우미.
 *
 * 예전에는 좋아요·수정·삭제마다 댓글 목록 전체를 무효화했다. 무한 목록은 받아 둔 쪽을
 * 하나씩 차례로 다시 받으므로, 하트 하나가 바뀌는 데 요청 한 번 + 쪽 수만큼의 왕복이 걸렸다.
 * 여기서는 해당 댓글만 캐시에서 고친다.
 *
 * 목록 캐시 키는 뒤에 로그인 여부가 붙어 둘로 갈리므로(queryKeys.ts), 정확히 일치해야 하는
 * getQueryData/setQueryData 대신 접두사로 찾는 getQueriesData/setQueriesData 를 쓴다.
 */

export interface CommentScope {
  universeId?: string;
  /** 답글이면 부모 댓글 id */
  parentCommentId?: string;
}

interface CommentPage {
  content: Comment[];
  page?: { totalElements?: number };
}

type CommentPages = InfiniteData<CommentPage>;

export type CommentCacheSnapshot = [QueryKey, unknown][];

const scopeKeys = ({ universeId, parentCommentId }: CommentScope) => {
  const keys: QueryKey[] = [];
  if (universeId) keys.push(commentQueryKeys.universeComments(universeId));
  if (parentCommentId) keys.push(commentQueryKeys.replies(parentCommentId));
  return keys;
};

const mapComments = (
  data: CommentPages | undefined,
  map: (comments: Comment[]) => Comment[],
): CommentPages | undefined =>
  data && {
    ...data,
    pages: data.pages.map((page) => ({ ...page, content: map(page.content) })),
  };

/** 진행 중인 조회를 멈추고(낙관적 값을 덮어쓰지 않게) 되돌릴 값을 찍어 둔다. */
export const snapshotCommentCaches = async (
  queryClient: QueryClient,
  scope: CommentScope,
): Promise<CommentCacheSnapshot> => {
  const keys = scopeKeys(scope);
  await Promise.all(
    keys.map((queryKey) => queryClient.cancelQueries({ queryKey })),
  );
  return keys.flatMap((queryKey) => queryClient.getQueriesData({ queryKey }));
};

export const restoreCommentCaches = (
  queryClient: QueryClient,
  snapshot: CommentCacheSnapshot | undefined,
) => {
  snapshot?.forEach(([queryKey, data]) => {
    queryClient.setQueryData(queryKey, data);
  });
};

/** 댓글 한 건을 목록·답글 캐시에서 찾아 고친다. */
export const updateCommentInCaches = (
  queryClient: QueryClient,
  scope: CommentScope,
  commentId: string,
  update: (comment: Comment) => Comment,
) => {
  scopeKeys(scope).forEach((queryKey) => {
    queryClient.setQueriesData<CommentPages>({ queryKey }, (data) =>
      mapComments(data, (comments) =>
        comments.map((comment) =>
          comment.commentId === commentId ? update(comment) : comment,
        ),
      ),
    );
  });
};

/**
 * 댓글 한 건을 캐시에서 뺀다. 전체 개수가 실린 목록이면 개수도 하나 줄이고,
 * 답글이면 부모 댓글의 답글 수도 줄인다.
 */
export const removeCommentFromCaches = (
  queryClient: QueryClient,
  scope: CommentScope,
  commentId: string,
) => {
  scopeKeys(scope).forEach((queryKey) => {
    queryClient.setQueriesData<CommentPages>({ queryKey }, (data) => {
      if (!data) return data;

      const isInList = data.pages.some((page) =>
        page.content.some((comment) => comment.commentId === commentId),
      );
      if (!isInList) return data;

      return {
        ...data,
        pages: data.pages.map((page, index) => ({
          ...page,
          content: page.content.filter(
            (comment) => comment.commentId !== commentId,
          ),
          // 총 개수는 첫 쪽의 페이지 정보에 실려 온다.
          ...(index === 0 && typeof page.page?.totalElements === "number"
            ? {
                page: {
                  ...page.page,
                  totalElements: Math.max(page.page.totalElements - 1, 0),
                },
              }
            : {}),
        })),
      };
    });
  });

  if (scope.parentCommentId && scope.universeId) {
    updateCommentInCaches(
      queryClient,
      { universeId: scope.universeId },
      scope.parentCommentId,
      (parent) => ({
        ...parent,
        meta: {
          ...parent.meta,
          replyCount: Math.max(parent.meta.replyCount - 1, 0),
        },
      }),
    );
  }
};
