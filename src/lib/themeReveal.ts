/**
 * 테마를 바꿀 때 누른 자리에서 새 테마가 원으로 번져 화면을 덮는다(View Transitions).
 * 지원하지 않는 브라우저나 모션 최소화 설정이면 지금처럼 한 번에 바꾼다.
 */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

const REVEAL_CLASS = "theme-reveal";

export const changeThemeWithReveal = (
  origin: Element | null,
  apply: () => void,
) => {
  const doc = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!doc.startViewTransition || reduceMotion) {
    apply();
    return;
  }

  const rect = origin?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : innerHeight / 2;
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );

  // 기본 교차 페이드를 끄는 규칙(scenes.css)은 이 전환 동안에만 건다
  document.documentElement.classList.add(REVEAL_CLASS);
  const transition = doc.startViewTransition(apply);
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => undefined);
  transition.finished
    .catch(() => undefined)
    .finally(() => document.documentElement.classList.remove(REVEAL_CLASS));
};
