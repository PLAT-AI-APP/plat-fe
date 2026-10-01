/**
 * 같은 사이트 안 경로만 되돌아갈 곳으로 인정한다. 아니면 홈("/").
 *
 * `//evil.com`·`/\evil.com` 은 브라우저가 다른 사이트 주소로 읽는다. 로그인·점검 뒤 복귀 주소는
 * 저장소나 쿼리에서 오므로 누구든 바꿔 넣을 수 있어, 쓰기 전에 반드시 이 검사를 거친다.
 */
export const toSafeReturnPath = (from: string | null | undefined): string => {
  if (!from || !from.startsWith("/")) return "/";
  if (from.startsWith("//") || from.startsWith("/\\")) return "/";
  // 제어 문자(줄바꿈 등)가 섞인 값은 쓰지 않는다.
  if (/[\u0000-\u001f]/.test(from)) return "/";
  return from;
};
