import { BellOn, Fold, Star } from "@/icons";
import Image from "next/image";
import React from "react";
import logoImg from "../../../public/logo.png";
import { SearchBar } from "./SearchBar";
import LanguageSelector from "./LanguageSelector";
import Profile from "./Profile";
import Link from "next/link";

interface HeaderProps {
  handleFoldToggle: () => void;
}
const Header = ({ handleFoldToggle }: HeaderProps) => {
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
            width={89}
            priority
            alt="plat logo"
            className="min-w-22.25 h-6.5 shrink-0"
          />
        </Link>
      </div>

      {/* 오른쪽 영역: 검색, 언어, 포인트, 알림, 프로필 */}
      <div
        id="header-right-section"
        className="flex flex-1 justify-end items-center h-10 gap-6"
      >
        <div
          id="header-utility-group"
          className="flex justify-between gap-4 items-center"
        >
          {/* SearchBar 내부에서 너비가 유동적으로 변하도록 스타일을 확인해야 합니다 */}
          <div className="flex-1 max-w-100 min-w-20">
            <SearchBar />
          </div>

          <LanguageSelector />

          {/* 포인트 표시 영역 */}
          <div
            id="user-point-badge"
            className="flex cursor-pointer items-center gap-1 transition-all duration-200 ease-in-out hover:bg-btn-hover rounded-lg p-1.25 pr-2.5"
          >
            <Star
              id="icon-point-star"
              fill="none"
              stroke="white"
              className="w-5 h-5"
            />
            <span id="user-point-value">1,100</span>
          </div>

          {/* 알림 버튼 */}
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
        </div>

        {/* 프로필 컴포넌트 */}
        <div id="header-profile-wrapper">
          <Profile />
        </div>
      </div>
    </header>
  );
};

export default Header;
