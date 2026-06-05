import type { CardSize, SizeConfig } from "./types";

export const SIZE_CONFIG: Record<CardSize, SizeConfig> = {
  S: {
    wrapper: "w-[186.67px] gap-2",
    imageArea: "w-full h-[245px] rounded-[16px]",
    infoArea: "gap-0.5",
    title: "title-3 text-font-0",
    desc: "body-4 text-font-2",
    isIntegrated: false,
    creatorName: "body-6 text-font-2",
    chatCount: "body-6 text-font-2",
    chatCountIcon: "text-font-disabled",
  },
  M: {
    wrapper: "w-[227.2px]",
    imageArea: "w-full h-[227.2px] rounded-tl-2xl rounded-tr-2xl",
    infoArea: "px-4 py-5 gap-0.5 bg-bg-darkest rounded-bl-2xl rounded-br-2xl",
    title: "title-3 text-font-0",
    desc: "body-4 text-font-2",
    isIntegrated: false,
    creatorName: "body-6 text-font-2",
    chatCount: "body-6 text-font-2",
    chatCountIcon: "text-font-disabled",
  },
  L: {
    wrapper: "size-96 rounded-2xl overflow-hidden",
    imageArea: "w-full h-full rounded-2xl",
    infoArea:
      "h-36 px-4 pt-6 pb-5 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_20%,rgba(0,0,0,0.8)_100%)] gap-1",
    title: "title-2 text-font-0",
    desc: "body-2 text-font-1",
    creatorName: "body-5",
    isIntegrated: true,
    chatCount: "text-font-2 body-6",
    chatCountIcon: "text-font-disabled",
  },
  XL: {
    wrapper: "w-96.5 justify-between",
    imageArea: "w-full h-96 rounded-t-2xl",
    infoArea: "px-5 py-6 bg-bg-darkest rounded-b-2xl gap-2",
    title: "title-1 ",
    desc: "body-2 ",
    isIntegrated: true,
    creatorName: "body-4",
    chatCount: "text-font-disabled body-4",
  },
};

export const LAST_SWIPE_THRESHOLD = 40;
