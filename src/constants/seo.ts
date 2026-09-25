// 검색 엔진 수집 허용 여부. 클로즈베타 동안은 막아 두고, 정식 출시 때 배포 env 에 "true" 를 넣어 연다.
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
