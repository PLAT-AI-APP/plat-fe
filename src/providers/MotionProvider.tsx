"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

/** 애니메이션 기능은 첫 화면을 그린 뒤에 받아도 충분해 별도 청크로 미룬다. */
const loadMotionFeatures = () =>
  import("@/lib/motionFeatures").then((module) => module.default);

/**
 * framer-motion 의 motion 컴포넌트는 애니메이션 기능 전체를 번들에 싣는다(모든 페이지에 약 140KB).
 * 대신 가벼운 m 컴포넌트를 쓰고, 기능은 여기서 한 번만 불러와 트리 전체에 나눠 준다.
 *
 * strict 라서 이 안에서 motion 컴포넌트를 쓰면 오류가 난다 — 새 코드에서 motion 을 쓰면
 * 절감분이 조용히 되돌아가므로 일부러 막아 둔다. 애니메이션 요소는 m.div 처럼 쓴다.
 *
 * 모션 최소화 설정이면 CSS 애니메이션은 base.css 가 끄고, framer 쪽은 MotionConfig 가 이동·크기
 * 변화를 건너뛰고 투명도만 남긴다. 축하 연출이 많아져 컴포넌트마다 따로 챙기지 않게 여기서 한 번에 건다.
 */
const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <LazyMotion features={loadMotionFeatures} strict>
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </LazyMotion>
);

export default MotionProvider;
