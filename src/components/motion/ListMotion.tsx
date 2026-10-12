"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/constants/motion";

const loadMaxFeatures = () =>
  import("@/lib/motionFeaturesMax").then((module) => module.default);

/**
 * 항목 순서가 바뀌거나 빠지는 목록을 감싼다. 이 안에서만 레이아웃 애니메이션 기능을 받는다.
 * 항목은 m.li 에 layout + LIST_ITEM_EXIT 를 주고, 목록은 AnimatePresence 로 감싼다.
 */
const ListMotion = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={loadMaxFeatures}>{children}</LazyMotion>
);

/** 고정하면 미끄러져 올라가고, 지우면 옆으로 밀려나며 접힌다 */
export const LIST_ITEM_MOTION = {
  layout: "position" as const,
  initial: false as const,
  exit: { opacity: 0, x: -40, height: 0, paddingTop: 0, paddingBottom: 0 },
  transition: {
    layout: { duration: 0.45, ease: EASE_OUT },
    default: { duration: 0.3, ease: EASE_OUT },
  },
};

export default ListMotion;
