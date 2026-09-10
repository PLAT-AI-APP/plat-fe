"use client";

import { useCallback, useState } from "react";
import type { FieldValues, Path } from "react-hook-form";

export type FieldFeedbackType = "success" | "default";

export interface FieldFeedback {
  message: string;
  type: FieldFeedbackType;
}

type FieldFeedbackMap<T extends FieldValues> = Partial<
  Record<Path<T>, FieldFeedback>
>;

/**
 * React Hook Form의 `setError`가 에러 상태를 관리하듯,
 * 성공/기본 안내 메시지를 필드 단위로 관리하기 위한 hook입니다.
 *
 * 서버에서 내려온 성공 메시지를 `errors`에 넣으면 폼 유효성 판단에 영향을 줄 수 있으므로,
 * 에러가 아닌 피드백은 별도 상태로 분리해서 다룹니다.
 */
export const useFieldFeedback = <T extends FieldValues>() => {
  const [feedbacks, setFeedbacks] = useState<FieldFeedbackMap<T>>({});

  const setFeedback = useCallback(
    (name: Path<T>, message: string, type: FieldFeedbackType = "success") => {
      setFeedbacks((prev) => ({
        ...prev,
        [name]: { message, type },
      }));
    },
    [],
  );

  const clearFeedback = useCallback((name?: Path<T>) => {
    if (!name) {
      setFeedbacks({});
      return;
    }

    setFeedbacks((prev) => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const getFeedback = useCallback(
    (name: Path<T>) => feedbacks[name],
    [feedbacks],
  );

  return {
    feedbacks,
    getFeedback,
    setFeedback,
    clearFeedback,
  };
};
