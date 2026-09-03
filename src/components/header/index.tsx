import { Fold, LogoWordmark, User } from "@/icons";
import React, { useRef } from "react";
import type { RefObject } from "react";
import { SearchBar } from "./SearchBar";
import Profile from "./Profile";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/useAuthStore";
import { useLayoutStore } from "@/store/useLayoutStore";
import { useUserStore } from "@/store/useUserStore";
import { useWalletStore } from "@/store/useWalletStore";
import ProfilePopover from "../popover/ProfilePopover";
import useToggle from "@/hooks/useToggle";
import Token from "@/icons/Token";
import { formatWithCommas } from "@/lib/utils";

interface HeaderProps {
  handleFoldToggle: () => void;
  /** 좁은 화면 드로어를 Esc 로 닫았을 때 포커스를 돌려줄 대상입니다. */
  foldToggleRef?: RefObject<HTMLButtonElement | null>;
}
const Header = ({ handleFoldToggle, foldToggleRef }: HeaderProps) => {
  const t = useTranslations();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isSidebarExpanded = useLayoutStore((state) => state.isSidebarExpanded);

  const profileModal = useToggle();

  const triggerRef = useRef<HTMLImageElement>(null);

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
      <div id="header-left-section" className="flex gap-4 items-center">
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
        className="flex h-10 flex-1 items-center justify-end gap-2"
      >
        <div id="header-utility-group" className="flex items-center gap-2">
          {/* 포인트 표시 영역 */}
          {isLoggedIn && (
            <Link
              href={`/token-charge`}
              className="flex cursor-pointer items-center gap-1 transition-colors hover:bg-btn-hover rounded-lg p-1 pr-2.5"
            >
              <Token className="w-5 h-5" />
              <span id="user-point-value" className="body-2">
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
                triggerRef={triggerRef}
              />
            </div>
          )}

          {/* 비로그인 프로필 */}
          {!isLoggedIn && (
            <div
              ref={triggerRef}
              onClick={(e) => {
                // profileModal.open 내부에서 이미 stopPropagation을 하고 있지만
                // 여기서 한 번 더 명시적으로 막아주는 것이 안전합니다.
                e.stopPropagation();
                profileModal.toggle(e);
              }}
              className="flex items-center justify-center w-10 h-10"
            >
              <User className="w-6 h-6 text-font-2 cursor-pointer" />
            </div>
          )}

          {profileModal.isOpen && (
            <ProfilePopover
              onClose={profileModal.toggle}
              triggerRef={triggerRef}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
