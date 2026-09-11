interface NumberedPage {
  page: { hasNext: boolean; number: number };
}

/** page.hasNext/number 기반 무한 스크롤 목록의 다음 페이지 번호를 계산합니다. 더 없으면 null. */
export const getNextPageNumber = <T extends NumberedPage>(lastPage: T) =>
  lastPage.page.hasNext ? lastPage.page.number + 1 : null;
