export interface Author {
  id: string;
  name: string;
  profileImage: string;
  isCreator: boolean; // 크리에이터 여부 (보라색 체크나 뱃지 표시용)
}

export interface CommentType {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  likes: number;
  replyCount: number;
  isPinned?: boolean; // 고정됨 여부
  replies?: CommentType[]; // 대댓글 배열
}

/** 댓글 작성자. 백엔드 CommentAuthor와 대응합니다. */
export interface CommentAuthor {
  userId: string;
  nickname: string;
  profileImageUrl: string | null;
}

/** 댓글 메타. 좋아요 여부는 로그인한 조회자 기준입니다. */
export interface CommentMeta {
  createdAt: string;
  pinned: boolean;
  edited: boolean;
  replyCount: number;
  likeCount: number;
  liked: boolean;
}

/** 댓글 한 건. 목록·답글 모두 같은 형태로 내려옵니다. */
export interface Comment {
  commentId: string;
  content: string;
  author: CommentAuthor;
  meta: CommentMeta;
}
