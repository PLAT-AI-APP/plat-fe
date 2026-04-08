import { IconProps } from "@/icons";
import { CNFlag, JPFlag, KRFlag, THFlag, USFlag, VNFlag } from "@/icons/flags";

export interface LanguageItemType {
  code: string;
  name: string;
  eng: string;
  countryCode: string;
  format: string;
  length: number;
  Icon: React.ComponentType<IconProps>;
}

export const LANGUAGE_LIST: LanguageItemType[] = [
  {
    code: "KR",
    name: "한국어",
    eng: "Korean",
    countryCode: "+82",
    format: "### #### ####",
    length: 11,
    Icon: KRFlag,
  },
  {
    code: "EN",
    name: "English",
    eng: "English",
    countryCode: "+1",
    format: "###-###-####",
    length: 10,
    Icon: USFlag,
  },
  {
    code: "JP",
    name: "日本語",
    eng: "Japanese",
    countryCode: "+81",
    format: "## #### ####",
    length: 10,
    Icon: JPFlag,
  },
  {
    code: "CN",
    name: "中文",
    eng: "Chinese",
    countryCode: "+86",
    format: "### #### ####",
    length: 11,
    Icon: CNFlag,
  },
  {
    code: "TH",
    name: "ภาษาไทย",
    eng: "Thailand",
    countryCode: "+66",
    format: "## #### ####",
    length: 10,
    Icon: THFlag,
  },
  {
    code: "VN",
    name: "Tiếng Việt",
    eng: "Vietnamese",
    countryCode: "+84",
    format: "### #### ###",
    length: 10,
    Icon: VNFlag,
  },
];
