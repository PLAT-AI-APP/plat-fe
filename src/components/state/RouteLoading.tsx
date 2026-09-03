/**
 * 라우트 전환 중 잠깐 보이는 자리표시자.
 *
 * 이 앱은 데이터를 전부 클라이언트에서 받으므로 loading.tsx가 오래 머무르지 않는다.
 * 그래서 화면을 흉내 내는 대신, 콘텐츠가 들어올 자리의 높이만 잡아 준다 —
 * 어설픈 스켈레톤이 실제 화면과 어긋나면 오히려 레이아웃이 튀어 보인다.
 */
const RouteLoading = () => (
  <div
    aria-busy="true"
    aria-live="polite"
    className="flex min-h-[60vh] w-full items-center justify-center"
  >
    <span className="sr-only">Loading</span>
    <span className="size-6 animate-spin rounded-full border-2 border-main border-t-brand" />
  </div>
);

export default RouteLoading;
