/**
 * 같은 화면 안에서 쿼리스트링만 바꾼다 — 서버에 다시 묻지 않고.
 *
 * router.push/replace 나 <Link> 로 쿼리만 바꿔도 Next 는 서버 컴포넌트를 다시 렌더하러
 * 서버에 다녀온다(RSC 요청). 이 앱의 탭·정렬·필터는 전부 클라이언트에서 데이터를 받으므로
 * 그 왕복은 선택 표시만 한 박자 늦출 뿐이었고, loading.tsx 가 있는 화면은 탭을 누를 때마다
 * 페이지 전체가 로딩 화면으로 바뀌었다.
 *
 * Next 14.1 부터는 window.history.pushState/replaceState 가 라우터와 연동돼 useSearchParams 가
 * 그대로 따라 바뀐다. 그래서 주소를 이 함수로 바꾸고, 화면은 useSearchParams 로 읽는다.
 */
export type HistoryMode = "push" | "replace";

export const navigateShallow = (href: string, mode: HistoryMode = "push") => {
  if (mode === "push") window.history.pushState(null, "", href);
  else window.history.replaceState(null, "", href);
};

/** 현재 주소의 쿼리에 값을 덮어쓴 href. 값이 null 이면 그 키를 뺀다. */
export const buildSearchHref = (
  updates: Record<string, string | null>,
  base: URLSearchParams | string = window.location.search,
) => {
  const params = new URLSearchParams(base);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) params.delete(key);
    else params.set(key, value);
  });
  const query = params.toString();
  return `${window.location.pathname}${query ? `?${query}` : ""}`;
};
