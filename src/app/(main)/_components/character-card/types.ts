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
