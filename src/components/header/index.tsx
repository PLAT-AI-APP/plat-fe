import { Fold, User } from "@/icons";
import Image from "next/image";
import React, { useRef } from "react";
import logoImg from "../../../public/logo.svg";
import { SearchBar } from "./SearchBar";
import Profile from "./Profile";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useWalletStore } from "@/store/useWalletStore";
import ProfilePopover from "../popover/ProfilePopover";
import useToggle from "@/hooks/useToggle";
import Token from "@/icons/Token";
import { formatWithCommas } from "@/lib/utils";

interface HeaderProps {
  handleFoldToggle: () => void;
}
const Header = ({ handleFoldToggle }: HeaderProps) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

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
      className="h-15 flex items-center justify-between px-5 sticky top-0 bg-bg-dark z-20"
    >
      {/* 왼쪽 영역: 사이드바 토글 및 로고 */}
      <div id="header-left-section" className="flex gap-3.75 items-center">
        <button
          id="sidebar-toggle-button"
          type="button"
          aria-label="사이드바 접기/펴기"
          onClick={handleFoldToggle}
          className="flex w-8 h-8 justify-center items-center hover:bg-btn-hover rounded-lg border-none bg-transparent cursor-pointer"
        >
          <Fold id="icon-sidebar-fold" className="w-6 h-6 text-font-2" />
        </button>

        <Link id="header-logo-link" href={"/"}>
          <Image
            id="header-logo-image"
            src={logoImg}
            width={122}
            height={29}
            priority
            alt="plat logo"
            className="min-w-30.5 h-7.25 shrink-0"
          />
        </Link>
      </div>

      {/* 오른쪽 영역: 검색, 언어, 포인트, 알림, 프로필 */}
      <div
        id="header-right-section"
        className="flex h-10 flex-1 items-center justify-end gap-2"
      >
        <div
          id="header-utility-group"
          className="flex items-center gap-2"
        >
          {/* 포인트 표시 영역 */}
          {isLoggedIn && (
            <Link
              href={`/token-charge`}
              className="flex cursor-pointer items-center gap-1 transition-all duration-200 ease-in-out hover:bg-btn-hover rounded-lg p-1.25 pr-2.5"
            >
              <Token className="w-5 h-5" />
              <span id="user-point-value" className="body-2">
                {formatWithCommas(availableBalance)}
              </span>
            </Link>
          )}

          {/* SearchBar 내부에서 너비가 유동적으로 변하도록 스타일을 확인해야 합니다 */}
          <div className="shrink-0">
            <SearchBar />
          </div>

          {/* <LanguageSelector /> */}

          {/* 알림 버튼 */}
          {/* {isLoggedIn && (
            <button
              id="header-notification-button"
              type="button"
              className="bg-transparent border-none p-0 cursor-pointer"
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
