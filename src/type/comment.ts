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
