"use client";

import { MotionConfig } from "framer-motion";
import { DURATION, EASE_OUT } from "@/constants/motion";

/**
 * framer-motion 전역 설정.
 *
 * - reducedMotion="user": OS 의 "동작 줄이기" 설정을 켠 사용자에게는 위치·크기
 *   변화를 재생하지 않고 투명도만 바꾼다. CSS 쪽 대응은 globals.css 의
 *   prefers-reduced-motion 블록이 담당한다.
 * - transition: transition 을 따로 주지 않은 motion 요소의 기본값. 이걸 두지
 *   않으면 framer-motion 기본 스프링이 적용돼, 같은 화면 안에서도 어떤 요소는
 *   튕기고 어떤 요소는 감속하는 식으로 리듬이 어긋난다.
 */
const MotionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      {children}
    </MotionConfig>
  );
};

export default MotionProvider;
