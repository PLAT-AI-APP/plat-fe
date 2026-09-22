import { Fold, LogoWordmark, User } from "@/icons";
import React, { Suspense, useRef } from "react";
import dynamic from "next/dynamic";
import type { RefObject } from "react";
import { SearchBar } from "./SearchBar";
import Profile from "./Profile";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/useAuthStore";
import { useLayoutStore } from "@/store/useLayoutStore";
import { useUserStore } from "@/store/useUserStore";
import { useWalletStore } from "@/store/useWalletStore";
import useToggle from "@/hooks/common/useToggle";
import Token from "@/icons/Token";
import { formatWithCommas } from "@/lib/utils";

const loadProfilePopover = () => import("../popover/ProfilePopover");
const ProfilePopover = dynamic(loadProfilePopover);
// 모든 페이지에서 가장 자주 여는 메뉴라, 여는 버튼에 포인터가 올라오면 코드를 미리 받는다.
// 같은 모듈은 한 번만 받는다.
const preloadProfilePopover = () => {
  void loadProfilePopover().catch(() => undefined);
};

interface HeaderProps {
  handleFoldToggle: () => void;
  /** 좁은 화면 드로어를 Esc 로 닫았을 때 포커스를 돌려줄 대상입니다. */
  foldToggleRef?: RefObject<HTMLButtonElement | null>;
}
const Header = ({ handleFoldToggle, foldToggleRef }: HeaderProps) => {
  const t = useTranslations();
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  // isLoggedIn 은 localStorage 에서 복원돼 서버 HTML(항상 false)과 첫 화면이 어긋나고, 새로고침 직후에는
  // 아직 세션 복구 중이다. 판정이 끝나기 전에는 로그인/비로그인 어느 쪽 디자인도 그리지 않고 자리만 잡는다.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn) && isAuthReady;
  const isLoggedOut = isAuthReady && !isLoggedIn;
  const isSidebarExpanded = useLayoutStore((state) => state.isSidebarExpanded);

  const profileModal = useToggle();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const loginTriggerRef = useRef<HTMLButtonElement>(null);

  const profileImage = useUserStore((state) => state.user?.profileImage);
  // 헤더의 보유 캐시는 전역 지갑 잔액 기준으로 표시합니다.
  const availableBalance = useWalletStore(
    (state) => state.balance?.availableBalance ?? 0,
  );
  return (
    <header
      id="main-header"
      className="h-(--header-height) flex items-center justify-between px-5 sticky top-0 bg-dark z-20"
    >
      {/* 왼쪽 영역: 사이드바 토글 및 로고 */}
      {/* min-w-0 이 없으면 이 flex 아이템이 로고의 min-content 폭 밑으로
          줄어들지 못해, 좁은 화면에서 오른쪽 영역을 밀어낸다. */}
      <div
        id="header-left-section"
        className="flex min-w-0 items-center gap-4"
      >
        <button
          id="sidebar-toggle-button"
          ref={foldToggleRef}
          type="button"
          aria-label={t("sidebar.toggle")}
          aria-expanded={isSidebarExpanded}
          aria-controls="main-sidebar"
          onClick={handleFoldToggle}
          className="flex w-8 h-8 justify-center items-center hover:bg-btn-hover rounded-lg border-none bg-transparent cursor-pointer"
        >
          <Fold id="icon-sidebar-fold" className="w-6 h-6 text-font-2" />
        </button>

        <Link id="header-logo-link" href={"/"}>
          <LogoWordmark
            id="header-logo-image"
            className="h-7.25 min-w-30.5 shrink-0 text-font-1"
          />
        </Link>
      </div>

      {/* 오른쪽 영역: 검색, 언어, 포인트, 알림, 프로필 */}
      <div
        id="header-right-section"
        className="flex h-10 min-w-0 flex-1 items-center justify-end gap-2"
      >
        <div id="header-utility-group" className="flex items-center gap-2">
          {/* 포인트 표시 영역 */}
          {isLoggedIn && (
            <Link
              href={`/token-charge`}
              className="flex cursor-pointer items-center gap-1 transition-colors hover:bg-btn-hover rounded-lg p-1 pr-2.5"
            >
              <Token className="w-5 h-5" />
              {/* 잔액은 자릿수가 늘어날 수 있다. 그대로 두면 좁은 화면에서
                  오른쪽 버튼들을 화면 밖으로 밀어낸다. */}
              <span
                id="user-point-value"
                className="body-3 max-w-24 truncate"
              >
                {formatWithCommas(availableBalance)}
              </span>
            </Link>
          )}

          <div className="shrink-0">
            <SearchBar />
          </div>

          {/* <LanguageSelector /> */}

          {/* 알림 버튼 */}
          {/* {isLoggedIn && (
            <button
              id="header-notification-button"
              type="button"
              className="cursor-pointer border-none bg-transparent p-0 hover:opacity-80"
            >
              <BellOn
                id="icon-notification-bell"
                className="text-font-2 w-6 h-6"
              />
            </button>
          )} */}
        </div>

        {/* 로그인 프로필 */}
        <div className="relative">
          {isLoggedIn && (
            <div id="header-profile-wrapper">
              <Profile
                profileImg={profileImage || "/p1.png"}
                handleToggle={profileModal.toggle}
                onIntent={preloadProfilePopover}
                isOpen={profileModal.isOpen}
                triggerRef={triggerRef}
              />
            </div>
          )}

          {/* 판정 전 자리표시자. 프로필/로그인 버튼과 같은 size-10 이라 판정이 끝나도 밀리지 않는다. */}
          {!isAuthReady && (
            <div aria-hidden="true" className="skeleton size-10 rounded-xl" />
          )}

          {/* 비로그인 프로필 */}
          {isLoggedOut && (
            <button
              ref={loginTriggerRef}
              type="button"
              onPointerEnter={preloadProfilePopover}
              onFocus={preloadProfilePopover}
              aria-label={t("headerAccount.label")}
              aria-haspopup="menu"
              aria-expanded={profileModal.isOpen}
              onClick={(e) => {
                // profileModal.open 내부에서 이미 stopPropagation을 하고 있지만
                // 여기서 한 번 더 명시적으로 막아주는 것이 안전합니다.
                e.stopPropagation();
                profileModal.toggle(e);
              }}
              className="flex size-10 items-center justify-center rounded-xl text-font-2 transition-colors hover:bg-btn-hover hover:text-font-1"
            >
              <User className="size-6" />
            </button>
          )}

          {/* 팝오버 청크가 처음 로딩될 때 루트 Suspense 까지 번지면 페이지 전체가
              잠깐 사라지므로 이 자리에서 멈춘다. */}
          {profileModal.isOpen && (
            <Suspense fallback={null}>
              <ProfilePopover
                onClose={profileModal.toggle}
                triggerRef={
                  isLoggedIn
                    ? (triggerRef as React.RefObject<HTMLElement | null>)
                    : loginTriggerRef
                }
              />
            </Suspense>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
