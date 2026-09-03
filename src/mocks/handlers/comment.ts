import { http, HttpResponse } from "msw";
import type { Comment } from "@/type/comment";

const PAGE_SIZE = 20;

/** 세계관별 루트 댓글. key는 universeId */
const rootComments = new Map<string, Comment[]>();
/** 댓글별 답글. key는 부모 commentId */
const replies = new Map<string, Comment[]>();

let sequence = 1;
const nextId = () => String(Date.now() * 1000 + sequence++);

const createComment = (content: string): Comment => ({
  commentId: nextId(),
  content,
  author: {
    userId: "0",
    nickname: "목업 사용자",
    profileImageUrl: null,
  },
  meta: {
    createdAt: new Date().toISOString(),
    pinned: false,
    edited: false,
    replyCount: 0,
    likeCount: 0,
    liked: false,
  },
});

const seedComments = (universeId: string) => {
  const seeded = Array.from({ length: 3 }, (_, index) => ({
    ...createComment(`${index + 1}번째 목업 댓글입니다.`),
    meta: {
      ...createComment("").meta,
      likeCount: index * 2,
      pinned: index === 0,
    },
  }));
  rootComments.set(universeId, seeded);

  return seeded;
};

const getRoots = (universeId: string) =>
  rootComments.get(universeId) ?? seedComments(universeId);

/** 모든 목록에서 해당 댓글을 찾아 변형을 적용합니다. */
const mutateComment = (
  commentId: string,
  mutate: (comment: Comment) => Comment,
) => {
  for (const bucket of [rootComments, replies]) {
    for (const [key, list] of bucket) {
      const index = list.findIndex((item) => item.commentId === commentId);
      if (index === -1) continue;

      const next = [...list];
      next[index] = mutate(next[index]);
      bucket.set(key, next);
      return true;
    }
  }
  return false;
};

const removeComment = (commentId: string) => {
  for (const bucket of [rootComments, replies]) {
    for (const [key, list] of bucket) {
      if (!list.some((item) => item.commentId === commentId)) continue;

      bucket.set(
        key,
        list.filter((item) => item.commentId !== commentId),
      );
      return true;
    }
  }
  return false;
};

const paged = (list: Comment[], page: number, withTotal: boolean) => {
  const content = list.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.ceil(list.length / PAGE_SIZE);

  return {
    page: {
      number: page,
      size: PAGE_SIZE,
      numberOfElements: content.length,
      hasNext: page < totalPages - 1,
      ...(withTotal && { totalElements: list.length, totalPages }),
    },
    content,
  };
};

const pageParam = (url: string) =>
  parseInt(new URL(url).searchParams.get("page") || "0", 10);

export const commentHandlers = [
  // 세계관 댓글 목록
  http.get(/\/comment\/universe\/([^/]+)(?:\?.*)?$/, ({ request }) => {
    const universeId = new URL(request.url).pathname.split("/").pop() ?? "";

    return HttpResponse.json(
      paged(getRoots(universeId), pageParam(request.url), true),
    );
  }),

  // 세계관 댓글 작성
  http.post(/\/comment\/universe\/([^/]+)$/, async ({ request }) => {
    const universeId = new URL(request.url).pathname.split("/").pop() ?? "";
    const { content } = (await request.json()) as { content: string };

    rootComments.set(universeId, [
      createComment(content),
      ...getRoots(universeId),
    ]);

    return new HttpResponse(null, { status: 204 });
  }),

  // 답글 목록
  http.get(/\/comment\/([^/]+)\/replies(?:\?.*)?$/, ({ request }) => {
    const commentId =
      new URL(request.url).pathname.split("/").at(-2) ?? "";

    return HttpResponse.json(
      paged(replies.get(commentId) ?? [], pageParam(request.url), false),
    );
  }),

  // 답글 작성
  http.post(/\/comment\/([^/]+)\/replies$/, async ({ request }) => {
    const commentId = new URL(request.url).pathname.split("/").at(-2) ?? "";
    const { content } = (await request.json()) as { content: string };

    replies.set(commentId, [
      ...(replies.get(commentId) ?? []),
      createComment(content),
    ]);
    mutateComment(commentId, (comment) => ({
      ...comment,
      meta: { ...comment.meta, replyCount: comment.meta.replyCount + 1 },
    }));

    return new HttpResponse(null, { status: 204 });
  }),

  // 좋아요 / 취소
  http.post(/\/comment\/([^/]+)\/likes$/, ({ request }) => {
    const commentId = new URL(request.url).pathname.split("/").at(-2) ?? "";
    mutateComment(commentId, (comment) => ({
      ...comment,
      meta: {
        ...comment.meta,
        liked: true,
        likeCount: comment.meta.likeCount + 1,
      },
    }));

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(/\/comment\/([^/]+)\/likes$/, ({ request }) => {
    const commentId = new URL(request.url).pathname.split("/").at(-2) ?? "";
    mutateComment(commentId, (comment) => ({
      ...comment,
      meta: {
        ...comment.meta,
        liked: false,
        likeCount: Math.max(comment.meta.likeCount - 1, 0),
      },
    }));

    return new HttpResponse(null, { status: 204 });
  }),

  // 댓글 고정 / 해제
  http.patch(/\/comment\/universe\/([^/]+)\/pinned$/, async ({ request }) => {
    const { commentId } = (await request.json()) as { commentId: string };
    mutateComment(commentId, (comment) => ({
      ...comment,
      meta: { ...comment.meta, pinned: true },
    }));

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(/\/comment\/universe\/([^/]+)\/pinned$/, ({ request }) => {
    const universeId =
      new URL(request.url).pathname.split("/").at(-2) ?? "";
    rootComments.set(
      universeId,
      getRoots(universeId).map((comment) => ({
        ...comment,
        meta: { ...comment.meta, pinned: false },
      })),
    );

    return new HttpResponse(null, { status: 204 });
  }),

  // 댓글 수정
  http.patch(/\/comment\/([^/]+)$/, async ({ request }) => {
    const commentId = new URL(request.url).pathname.split("/").pop() ?? "";
    const { content } = (await request.json()) as { content: string };

    mutateComment(commentId, (comment) => ({
      ...comment,
      content,
      meta: { ...comment.meta, edited: true },
    }));

    return new HttpResponse(null, { status: 204 });
  }),

  // 댓글 삭제
  http.delete(/\/comment\/([^/]+)$/, ({ request }) => {
    const commentId = new URL(request.url).pathname.split("/").pop() ?? "";
    removeComment(commentId);

    return new HttpResponse(null, { status: 204 });
  }),
];
