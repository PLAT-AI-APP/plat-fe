// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 숫자 포맷터
 * 규칙:
 * - 999 이하: 그대로 표시
 * - 1,000 ~ 9,999: '천' 단위 (소수점 한자리, 내림)
 * - 10,000 ~ 99,999,999: '만' 단위 (정수, 내림)
 * - 100,000,000 이상: '억' 단위 (정수, 내림)
 */
export const formatStatCount = (count: number): string => {
  if (count >= 100_000_000) {
    // 억 단위 (1억 ~ 9999억)
    return `${Math.floor(count / 100_000_000)}억`;
  }

  if (count >= 10_000) {
    // 만 단위 (1만 ~ 9999만)
    return `${Math.floor(count / 10_000)}만`;
  }

  if (count >= 1_000) {
    // 천 단위 (1.0천 ~ 9.9천)
    // 소수점 둘째자리에서 내림하여 첫째자리까지 표시
    const truncated = Math.floor((count / 1000) * 10) / 10;
    return `${truncated.toFixed(1)}천`;
  }

  // 999 이하
  return count.toString();
};

/**
 * 숫자에 3자리마다 콤마를 추가하는 함수
 * @param value - 포맷팅할 숫자 또는 숫자형 문자열
 * @returns 콤마가 포함된 문자열 (ex: 1,234,567)
 */
/** 소수 단위가 없는 통화 목록 (amountMinor가 곧 표시 금액) */
const ZERO_DECIMAL_CURRENCIES = ["KRW", "JPY", "VND"];

/** 결제 API의 최소 단위 금액(amountMinor)을 화면에 표시할 금액으로 변환합니다. */
export const toMajorAmount = (amountMinor: number, currency: string): number => {
  if (ZERO_DECIMAL_CURRENCIES.includes(currency.toUpperCase())) {
    return amountMinor;
  }

  return amountMinor / 100;
};

/** 정가 대비 할인율(%)을 계산합니다. 할인이 없으면 0을 반환합니다. */
export const calcDiscountRate = (
  amountMinor: number,
  listAmountMinor?: number,
): number => {
  if (!listAmountMinor || listAmountMinor <= amountMinor) return 0;

  return Math.round((1 - amountMinor / listAmountMinor) * 100);
};

export const formatWithCommas = (value: number | string): string => {
  const num = typeof value === "string" ? Number(value) : value;

  // 숫자가 아니거나 유효하지 않은 값이 들어오면 '0' 혹은 빈 값을 반환
  if (isNaN(num)) return "0";

  return new Intl.NumberFormat("ko-KR").format(num);
};

export const getOrCreateDeviceId = () => {
  if (typeof window === "undefined") return ""; // SSR 환경 방지

  let deviceId = localStorage.getItem("plat_device_id");

  if (!deviceId) {
    // 겹칠 확률이 거의 없는 고유 ID 생성 (UUID 방식)
    deviceId = crypto.randomUUID();
    localStorage.setItem("plat_device_id", deviceId);
  }

  return deviceId;
};
