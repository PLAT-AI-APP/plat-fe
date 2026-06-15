import { IconProps } from "@/icons";
import type { AppLocale } from "@/i18n/config";
import { CNFlag, JPFlag, KRFlag, THFlag, USFlag, VNFlag } from "@/icons/flags";

export interface LanguageItemType {
  code: string;
  name: string;
  eng: string;
  countryCode: string;
  format: string;
  length: number;
  locale: AppLocale;
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
    locale: "ko",
    Icon: KRFlag,
  },
  {
    code: "EN",
    name: "English",
    eng: "English",
    countryCode: "+1",
    format: "###-###-####",
    length: 10,
    locale: "en",
    Icon: USFlag,
  },
  {
    code: "JP",
    name: "日本語",
    eng: "Japanese",
    countryCode: "+81",
    format: "## #### ####",
    length: 10,
    locale: "ja",
    Icon: JPFlag,
  },
  {
    code: "CN",
    name: "中文",
    eng: "Chinese",
    countryCode: "+86",
    format: "### #### ####",
    length: 11,
    locale: "zh",
    Icon: CNFlag,
  },
  {
    code: "TH",
    name: "ภาษาไทย",
    eng: "Thailand",
    countryCode: "+66",
    format: "## #### ####",
    length: 10,
    locale: "th",
    Icon: THFlag,
  },
  {
    code: "VN",
    name: "Tiếng Việt",
    eng: "Vietnamese",
    countryCode: "+84",
    format: "### #### ###",
    length: 10,
    locale: "vi",
    Icon: VNFlag,
  },
];
