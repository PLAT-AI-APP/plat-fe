"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { type HistoryMode, navigateShallow } from "@/lib/shallowUrl";

interface ShallowLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 같은 페이지 안의 주소. 쿼리만 다른 경우에 쓴다. */
  href: string;
  mode?: HistoryMode;
}

/**
 * 같은 페이지의 쿼리만 바꾸는 링크(탭·필터·기간 등).
 *
 * <Link> 로 두면 누를 때마다 서버 렌더를 다시 받아 선택 표시가 늦고, loading.tsx 가 페이지를
 * 통째로 가렸다. 여기서는 주소만 바꾸고(lib/shallowUrl.ts) 화면은 useSearchParams 로 따라간다.
 * 진짜 <a href> 라 새 탭 열기·주소 복사는 그대로 된다 — 보조키를 누른 클릭은 브라우저에 맡긴다.
 */
const ShallowLink = ({
  href,
  mode = "push",
  onClick,
  ...props
}: ShallowLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigateShallow(href, mode);
  };

  return <a href={href} onClick={handleClick} {...props} />;
};

export default ShallowLink;
