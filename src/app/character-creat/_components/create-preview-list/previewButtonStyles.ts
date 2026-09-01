const base =
  "flex size-6.5 items-center justify-center rounded-lg text-font-2 transition-colors";

export const previewActionButtonClass = `${base} bg-dark hover:bg-card-selected hover:text-font-1`;

/*
 * 취소/확인은 원래 완전히 같은 클래스 문자열이었고, 게다가 hover 색이
 * 기본 배경과 같은 bg-btn-hover 라 호버해도 아무 변화가 없었다.
 * 두 동작을 실제로 구분되게 만든다.
 */
export const previewCancelButtonClass = `${base} bg-btn-hover hover:bg-card-selected hover:text-font-1`;

export const previewConfirmButtonClass = `${base} bg-btn-hover hover:bg-brand-opacity-2 hover:text-brand-dark`;
