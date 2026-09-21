import type { NoticeCategory } from "@/type/notice";

/** 백엔드 NoticeCategory 와 1:1. GET /notices 의 category 로 보낼 수 있는 값은 이것뿐이다. */
export const NOTICE_CATEGORIES: readonly NoticeCategory[] = [
  "SERVICE",
  "UPDATE",
  "EVENT",
  "MAINTENANCE",
  "POLICY",
];

/**
 * URL 의 filter 값을 분류로 좁힌다. 모르는 값이면 전체(undefined)로 본다.
 * 주소창에서 바뀔 수 있는 값을 그대로 서버에 보내면 알 수 없는 category 는 400 이 되기 때문이다.
 */
export const parseNoticeCategory = (
  value: string | string[] | undefined,
): NoticeCategory | undefined =>
  typeof value === "string" &&
  (NOTICE_CATEGORIES as readonly string[]).includes(value)
    ? (value as NoticeCategory)
    : undefined;
