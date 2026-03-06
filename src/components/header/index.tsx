import { BellOn, Fold, Star } from "@/icons";
import Image from "next/image";
import React from "react";
import logoImg from "../../../public/logo.png";
import { SearchBar } from "./SearchBar";
import LanguageSelector from "./LanguageSelector";
import Profile from "./Profile";

const Header = () => {
  return (
    <header className="h-15 flex items-center justify-between px-5">
      <div className="flex gap-3.75 items-center">
        <Fold className="text-font-2 cursor-pointer" />
        <Image
          src={logoImg}
          width={89}
          priority
          alt="plat logo"
          className="h-6.5"
        />
      </div>

      {/* 추후 로그인 여부에 따라 Bell icon,포인트 표시 삭제, Profile => User Icon으로 변경 */}
      <div className="flex items-center h-10 gap-6">
        <div className="flex justify-between gap-4 items-center">
          <SearchBar />

          <LanguageSelector />

          <div className="flex cursor-pointer items-center gap-1 bg-btn-hover rounded-b-lg p-1.25 pr-2.5">
            <Star stroke="white" />
            <span>1,100</span>
          </div>

          <BellOn className="text-font-2 cursor-pointer w-8 h-8" />
        </div>

        <Profile />
      </div>
    </header>
  );
};

export default Header;
