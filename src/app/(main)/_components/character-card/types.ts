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
