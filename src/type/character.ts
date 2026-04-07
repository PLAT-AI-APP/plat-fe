import { ChatMessageType } from "./chat";

export interface CharacterCreateFormValues {
  // 프로필 tab
  representativeImage: ImageData | string;
  title: string;
  name: string;
  characterIntroduce: string;

  // 상세정보 tab
  height: string;
  weight: string;
  characterDetailSetting: string;

  // 에셋 tab
  asset: {
    assetFile: ImageData | null;
    assetImage: string;
    assetName: string;
    assetSituation: string;
  }[];

  // 시나리오 tab
  scenarios: { name: string; messages: ChatMessageType[] }[];

  //설정 tab
  isPublic: boolean;
  characterDescription: string;
  tendency: string;
  category: string;
  tagList: { name: string }[];
}
