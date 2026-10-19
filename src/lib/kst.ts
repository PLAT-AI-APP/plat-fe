import dayjs from "@/lib/dayjs";

/**
 * 수익은 날짜를 한국 날짜(KST)로 자른다. 브라우저 시간대와 상관없이 서버와 같은 날짜를 보이도록 여기서 바꾼다.
 */
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const kstDateString = (epochMs: number) =>
  new Date(epochMs + KST_OFFSET_MS).toISOString().slice(0, 10);

/** 오늘(KST). 시각 없는 날짜다. */
export const kstToday = () => dayjs(kstDateString(Date.now()));

/** 이번 달(KST) YYYY-MM */
export const kstMonth = () => kstDateString(Date.now()).slice(0, 7);

/** 시각(ISO)의 한국 날짜. 정산 시각(KST 자정)을 날짜로 보일 때 쓴다. */
export const kstDateOf = (iso: string) => dayjs(kstDateString(Date.parse(iso)));
