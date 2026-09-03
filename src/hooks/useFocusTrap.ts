"use client";

import { useEffect, type RefObject } from "react";

/** 화면에서 실제로 포커스를 받을 수 있는 요소들. disabled/숨김은 제외한다. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const getFocusable = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.offsetParent !== null || element === document.activeElement);

interface UseFocusTrapOptions {
  /** 트랩을 걸 컨테이너. */
  containerRef: RefObject<HTMLElement | null>;
  /** 꺼져 있으면 아무것도 하지 않는다. */
  enabled: boolean;
  /** Esc 를 눌렀을 때. 넘기지 않으면 Esc 를 가로채지 않는다. */
  onEscape?: () => void;
}

/**
 * 열려 있는 레이어 안에 키보드 포커스를 가둔다.
 *
 * `role="dialog" aria-modal="true"` 는 보조기술에 "이건 모달"이라고 알릴 뿐,
 * Tab 이 뒤 화면으로 새는 것을 막아 주지는 않는다. 실제로 키보드 사용자가
 * 모달을 빠져나가지 못하거나 반대로 뒤 콘텐츠로 흘러가 버리는 것을 막으려면
 * 이 훅처럼 직접 순환시키고, 닫힐 때 원래 있던 자리로 포커스를 돌려줘야 한다.
 */
export const useFocusTrap = ({
  containerRef,
  enabled,
  onEscape,
}: UseFocusTrapOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    // 닫힐 때 돌아갈 자리. 보통 이 레이어를 연 트리거 버튼이다.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // 열리자마자 첫 요소로 포커스를 옮긴다. 없으면 컨테이너 자체를 받게 한다.
    const focusables = getFocusable(container);
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      container.setAttribute("tabindex", "-1");
      container.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onEscape) {
        event.stopPropagation();
        onEscape();
        return;
      }

      if (event.key !== "Tab") return;

      const current = getFocusable(container);
      if (current.length === 0) {
        event.preventDefault();
        return;
      }

      const first = current[0];
      const last = current[current.length - 1];
      const active = document.activeElement;

      // 양 끝에서 다음/이전으로 나가려 하면 반대편으로 감는다.
      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      // 레이어가 사라진 뒤 포커스가 <body> 로 떨어지면 키보드 사용자는 위치를 잃는다.
      previouslyFocused?.focus?.();
    };
  }, [containerRef, enabled, onEscape]);
};
