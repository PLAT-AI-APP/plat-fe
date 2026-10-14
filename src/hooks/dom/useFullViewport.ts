import { useEffect } from "react";

/**
 * 화면 오른쪽 끝에 붙여야 하는 레이어(사이드바)가 떠 있는 동안 스크롤바 자리를 비운다.
 *
 * html 에 scrollbar-gutter:stable 이 있어 fixed 레이어가 스크롤바 자리만큼 안쪽에서 끝난다.
 * 가운데 놓는 모달은 티가 안 나지만 오른쪽에 붙는 사이드바는 그 틈이 그대로 보인다.
 * base.css 의 [data-full-viewport] 규칙이 자리를 비우고 문서 스크롤을 막는다.
 */
export const useFullViewport = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-full-viewport", "");

    return () => root.removeAttribute("data-full-viewport");
  }, []);
};
