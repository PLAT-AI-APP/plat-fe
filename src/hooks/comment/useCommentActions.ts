"use client";

import { useRef, useState } from "react";
import { useDeleteCommentMutation } from "@/api/comment/deleteComment";
import { useDeleteCommentPinMutation } from "@/api/comment/deleteCommentPin";
import { usePatchCommentMutation } from "@/api/comment/patchComment";
import { usePatchCommentPinMutation } from "@/api/comment/patchCommentPin";
import {
  useDeleteCommentLikeMutation,
  usePostCommentLikeMutation,
} from "@/api/comment/postCommentLike";
import { useRequireLogin } from "@/hooks/common/useRequireLogin";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import type { Comment } from "@/type/comment";

interface UseCommentActionsOptions {
  comment: Comment;
  universeId: string;
  /** 답글이면 부모 댓글 id. 변경 후 어느 목록 캐시를 고칠지 정하는 데 쓴다. */
  parentCommentId?: string;
}

/**
 * 댓글 한 줄에서 할 수 있는 동작(좋아요·수정·삭제·신고·고정)과 수정 상태.
 *
 * 댓글과 답글이 같은 동작을 쓰므로 컴포넌트에서 떼어 둔다. 답글 등록·답글 목록은
 * 최상위 댓글에만 있는 기능이라 CommentReplyThread 가 따로 맡는다.
 */
export const useCommentActions = ({
  comment,
  universeId,
  parentCommentId,
}: UseCommentActionsOptions) => {
  const requireLogin = useRequireLogin();
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const openModal = useModalStore((state) => state.openModal);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { mutate: like } = usePostCommentLikeMutation();
  const { mutate: unlike } = useDeleteCommentLikeMutation();
  const { mutate: patchComment, isPending: isPatching } =
    usePatchCommentMutation();
  const { mutate: deleteComment } = useDeleteCommentMutation();
  const { mutate: pinComment } = usePatchCommentPinMutation();
  const { mutate: unpinComment } = useDeleteCommentPinMutation();

  const scope = { universeId, parentCommentId };

  // 하트는 낙관적으로 바로 바뀐다. 요청이 오가는 중에 또 누르면 반대 요청이 겹쳐 서버에 어느
  // 쪽이 남을지 알 수 없어, 그동안의 입력만 흘려보낸다(버튼을 흐리게 하지는 않는다).
  const isLikeInFlightRef = useRef(false);

  const toggleLike = () => {
    // 조용히 막으면 눌러도 아무 일이 없어 보이므로 로그인 창을 바로 연다.
    if (!requireLogin()) return;
    if (isLikeInFlightRef.current) return;

    isLikeInFlightRef.current = true;
    const variables = { commentId: comment.commentId, ...scope };
    const options = {
      onSettled: () => {
        isLikeInFlightRef.current = false;
      },
    };
    if (comment.meta.liked) unlike(variables, options);
    else like(variables, options);
  };

  const startEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  const submitEdit = () => {
    const content = editedContent.trim();
    if (!content || isPatching) return;

    // 고친 내용은 캐시에 먼저 들어가므로 바로 닫는다. 실패하면(토스트는 전역에서 뜬다)
    // 쓰던 글 그대로 수정 모드를 다시 열어 준다.
    setIsEditing(false);
    patchComment(
      { commentId: comment.commentId, content, ...scope },
      {
        onError: () => {
          setEditedContent(content);
          setIsEditing(true);
        },
      },
    );
  };

  const remove = () => {
    openDialog("COMMENT_DELETE", {
      isReply: Boolean(parentCommentId),
      // 목록에서 먼저 빠지므로 확인 창도 바로 닫는다. 실패하면 캐시가 되돌려지고 토스트가 뜬다.
      onConfirm: () => {
        deleteComment({ commentId: comment.commentId, ...scope });
        closeDialog();
      },
    });
  };

  // 비로그인이면 모달 스토어가 신고 대신 로그인 창을 연다.
  const report = () => {
    openModal("REPORT", {
      targetType: "COMMENT",
      targetId: comment.commentId,
      targetName: comment.author.nickname,
    });
  };

  const pin = () => {
    pinComment({ universeId, commentId: comment.commentId });
  };

  const unpin = () => {
    unpinComment({ universeId });
  };

  return {
    toggleLike,
    edit: {
      isEditing,
      content: editedContent,
      setContent: setEditedContent,
      canSubmit: !isPatching && Boolean(editedContent.trim()),
      start: startEdit,
      cancel: cancelEdit,
      submit: submitEdit,
    },
    remove,
    report,
    pin,
    unpin,
  };
};
