/**
 * 메시지 버튼(지우기·다시 만들기·신고)을 그 메시지에 마우스를 올렸을 때만 보이게 한다. 메시지를 감싼 요소에 `group` 이 있어야 한다.
 *
 * 마우스가 있는 기기에서만 숨긴다 — 터치 기기는 hover 가 없어 숨기면 누를 방법이 없다. 자리는 그대로 두어(opacity) 올릴 때
 * 화면이 밀리지 않고, 키보드로 버튼에 닿으면(focus-within) 보인다.
 */
export const HOVER_REVEAL =
  "transition-opacity [@media(hover:hover)]:opacity-0 group-hover:opacity-100 focus-within:opacity-100";
