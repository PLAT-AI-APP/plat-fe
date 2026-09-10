export type CardSize = "S" | "M" | "L" | "XL";

export interface CharacterCardProps {
  title: string;
  description: string;
  creatorName: string;
  chatCount?: number;
  images: string[] | string;
  size?: CardSize;
  tagList?: string[];
  currentTag?: string;
  isNew?: boolean;
  isOfficial?: boolean;
  selectedTags?: string | string[];
  rank?: number;
  /**
   * true면 카드가 부모(그리드 셀)의 폭을 그대로 채운다. 카드 자체의 고정폭에
   * 기대는 캐러셀·한 줄 나열 등 다른 화면에 영향이 없도록 기본값은 false다.
   */
  fluid?: boolean;
  /**
   * 카드 클릭 시 이동할 상세페이지 경로(예: `/characters/{id}`).
   * 카드 내부의 인디케이터·오버레이 버튼과 형제로 깔리는 stretched link라,
   * <a> 안에 <button>이 중첩되는 유효하지 않은 마크업을 피하면서도
   * prefetch·새 탭 열기 같은 Link의 이점을 그대로 가져갑니다.
   * 아직 갈 곳이 없는 자리(더미 데이터 등)는 생략해 카드를 비활성 상태로 둡니다.
   */
  href?: string;
}

export interface SizeConfig {
  wrapper: string;
  imageArea: string;
  infoArea: string;
  title: string;
  desc: string;
  isIntegrated: boolean;
  creatorName: string;
  chatCount: string;
  chatCountIcon?: string;
}
