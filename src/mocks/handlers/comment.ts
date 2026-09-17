import { http, HttpResponse } from "msw";
import type { Comment } from "@/type/comment";
import { getMockUniverseDetail } from "./universe";

const PAGE_SIZE = 20;
const CONTENT_MAX_LENGTH = 1000;

/** 세계관별 루트 댓글. key는 universeId */
const rootComments = new Map<string, Comment[]>();
/** 댓글별 답글. key는 항상 "루트" commentId — 답글에 단 답글도 루트를 부모로 삼는다(백엔드와 동일). */
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

/** commentId가 답글이면 그 답글이 속한 루트 commentId를, 아니면 자기 자신을 돌려줍니다. */
const resolveRootId = (commentId: string) => {
  for (const [rootId, list] of replies) {
    if (list.some((item) => item.commentId === commentId)) return rootId;
  }
  return commentId;
};

/** 루트 commentId가 속한 세계관 id. 세계관 댓글이 아니면(또는 존재하지 않으면) undefined. */
const findUniverseIdOfRoot = (rootId: string) => {
  for (const [universeId, list] of rootComments) {
    if (list.some((item) => item.commentId === rootId)) return universeId;
  }
  return undefined;
};

const commentExists = (commentId: string) => {
  for (const list of rootComments.values()) {
    if (list.some((item) => item.commentId === commentId)) return true;
  }
  for (const list of replies.values()) {
    if (list.some((item) => item.commentId === commentId)) return true;
  }
  return false;
};

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
      // 루트가 지워지면 딸린 답글도 함께 내려간다(백엔드는 cascade soft delete).
      if (bucket === rootComments) {
        replies.delete(commentId);
      }
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

const commentNotFound = () =>
  HttpResponse.json(
    { code: "COMMENT_NOT_FOUND", message: "댓글을 찾을 수 없습니다." },
    { status: 404 },
  );

/** 댓글 중지 중에는 소유자·관리자도 못 쓴다(백엔드 UniverseCommentTargetAccess와 동일). */
const commentDisabled = () =>
  HttpResponse.json(
    { code: "COMMENT_DISABLED", message: "댓글이 비활성화 상태입니다." },
    { status: 403 },
  );

/** 세계관 소유자 전용 동작(댓글 고정/해제)에 소유자가 아닌 뷰어가 접근했을 때. */
const forbidden = () =>
  HttpResponse.json(
    { code: "FORBIDDEN", message: "권한이 없습니다." },
    { status: 403 },
  );

const invalidField = (field: string, message: string) =>
  HttpResponse.json(
    {
      code: "INVALID_INPUT",
      message: "요청 값이 올바르지 않습니다.",
      fields: { [field]: message },
    },
    { status: 400 },
  );

/** CommentContentRequest(@NotBlank @Size(max=1000))와 동일한 규칙. */
const validateContent = (content: string) => {
  if (!content || content.trim().length === 0) {
    return invalidField("content", "댓글 내용을 입력해주세요.");
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    return invalidField("content", "댓글은 1000자 이하여야 합니다.");
  }
  return null;
};

/**
 * 댓글이 속한 세계관이 댓글 중지 상태인지 본다. 답글은 루트를 통해 소속 세계관을 역추적한다.
 * 세계관 댓글이 아니거나 이미 지워졌으면(다른 검증에서 걸릴 것이므로) 여기서는 통과시킨다.
 */
const assertCommentWritable = (commentId: string) => {
  const universeId = findUniverseIdOfRoot(resolveRootId(commentId));
  if (!universeId) return null;

  return getMockUniverseDetail(universeId).commentEnabled
    ? null
    : commentDisabled();
};

/** 세계관 댓글 목록·답글 조회 공통 — 중지 중이면 세계관 제작자만 계속 볼 수 있다. */
const assertUniverseCommentReadable = (universeId: string) => {
  const universe = getMockUniverseDetail(universeId);
  if (universe.commentEnabled || universe.editable) return null;
  return commentDisabled();
};

export const commentHandlers = [
  // 세계관 댓글 목록
  http.get(/\/comment\/universe\/([^/]+)(?:\?.*)?$/, ({ request }) => {
    const universeId = new URL(request.url).pathname.split("/").pop() ?? "";

    const disabled = assertUniverseCommentReadable(universeId);
    if (disabled) return disabled;

    return HttpResponse.json(
      paged(getRoots(universeId), pageParam(request.url), true),
    );
  }),

  // 세계관 댓글 작성
  http.post(/\/comment\/universe\/([^/]+)$/, async ({ request }) => {
    const universeId = new URL(request.url).pathname.split("/").pop() ?? "";
    const { content } = (await request.json()) as { content: string };

    const invalid = validateContent(content);
    if (invalid) return invalid;

    // 댓글 중지 중에는 세계관 제작자도 새 댓글을 달 수 없다.
    if (!getMockUniverseDetail(universeId).commentEnabled) {
      return commentDisabled();
    }

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

    if (!commentExists(commentId)) return commentNotFound();

    const universeId = findUniverseIdOfRoot(resolveRootId(commentId));
    if (universeId) {
      const disabled = assertUniverseCommentReadable(universeId);
      if (disabled) return disabled;
    }

    return HttpResponse.json(
      paged(replies.get(commentId) ?? [], pageParam(request.url), false),
    );
  }),

  // 답글 작성
  http.post(/\/comment\/([^/]+)\/replies$/, async ({ request }) => {
    const commentId = new URL(request.url).pathname.split("/").at(-2) ?? "";
    const { content } = (await request.json()) as { content: string };

    const invalid = validateContent(content);
    if (invalid) return invalid;

    if (!commentExists(commentId)) return commentNotFound();

    // 답글에 단 답글도 루트를 부모로 삼는다.
    const rootId = resolveRootId(commentId);
    const disabled = assertCommentWritable(rootId);
    if (disabled) return disabled;

    replies.set(rootId, [
      ...(replies.get(rootId) ?? []),
      createComment(content),
    ]);
    mutateComment(rootId, (comment) => ({
      ...comment,
      meta: { ...comment.meta, replyCount: comment.meta.replyCount + 1 },
    }));

    return new HttpResponse(null, { status: 204 });
  }),

  // 좋아요 / 취소
  http.post(/\/comment\/([^/]+)\/likes$/, ({ request }) => {
    const commentId = new URL(request.url).pathname.split("/").at(-2) ?? "";

    if (!commentExists(commentId)) return commentNotFound();
    const disabled = assertCommentWritable(commentId);
    if (disabled) return disabled;

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

    if (!commentExists(commentId)) return commentNotFound();
    const disabled = assertCommentWritable(commentId);
    if (disabled) return disabled;

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

  // 댓글 고정 — 세계관 제작자만, 그리고 그 세계관의 루트 댓글만 고정할 수 있다.
  http.patch(/\/comment\/universe\/([^/]+)\/pinned$/, async ({ request }) => {
    const universeId =
      new URL(request.url).pathname.split("/").at(-2) ?? "";
    const { commentId } = (await request.json()) as { commentId: string };

    // 권한 검사가 댓글 유효성보다 먼저다 — 소유자가 아니면 그 댓글이 존재하는지도 알려주지 않는다.
    if (!getMockUniverseDetail(universeId).editable) return forbidden();

    const roots = getRoots(universeId);
    if (!roots.some((comment) => comment.commentId === commentId)) {
      // 다른 세계관 댓글이거나 답글이면 루트로 보지 않는다 — 존재를 숨기기 위해 404.
      return commentNotFound();
    }

    // 세계관당 고정은 1건이라 기존 고정은 자동으로 내려간다.
    rootComments.set(
      universeId,
      roots.map((comment) => ({
        ...comment,
        meta: { ...comment.meta, pinned: comment.commentId === commentId },
      })),
    );

    return new HttpResponse(null, { status: 204 });
  }),

  // 댓글 고정 해제 — 세계관 제작자만. 고정된 것이 없어도 멱등하게 204.
  http.delete(/\/comment\/universe\/([^/]+)\/pinned$/, ({ request }) => {
    const universeId =
      new URL(request.url).pathname.split("/").at(-2) ?? "";

    if (!getMockUniverseDetail(universeId).editable) return forbidden();

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

    const invalid = validateContent(content);
    if (invalid) return invalid;

    if (!commentExists(commentId)) return commentNotFound();
    // 댓글 중지 중에는 작성자도 자기 댓글을 수정할 수 없다.
    const disabled = assertCommentWritable(commentId);
    if (disabled) return disabled;

    mutateComment(commentId, (comment) => ({
      ...comment,
      content,
      meta: { ...comment.meta, edited: true },
    }));

    return new HttpResponse(null, { status: 204 });
  }),

  // 댓글 삭제 — 중지 상태와 무관하게 작성자는 계속 지울 수 있다.
  http.delete(/\/comment\/([^/]+)$/, ({ request }) => {
    const commentId = new URL(request.url).pathname.split("/").pop() ?? "";

    if (!commentExists(commentId)) return commentNotFound();
    removeComment(commentId);

    return new HttpResponse(null, { status: 204 });
  }),
];
