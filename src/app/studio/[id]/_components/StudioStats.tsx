import React from "react";
import Link from "next/link";
import { ArrowRight } from "@/icons";
import { formatWithCommas } from "@/lib/utils";

export const MOCK_STUDIO_DATA = {
  characterCount: 329,
  chatCount: 1455,
  isIdentityVerified: true, // 본인인증 완료
  isAdultVerified: false, // 미인증
};

const StudioStats = () => {
  return (
    <div className="grid grid-cols-2 @[516px]:grid-cols-4 gap-3">
      {/* 캐릭터 */}
      <div className="flex flex-1 flex-col gap-2 min-w-27.5">
        <span className="text-font-2 body-4">캐릭터</span>
        <span className="title-3">
          {formatWithCommas(MOCK_STUDIO_DATA.characterCount)}
        </span>
      </div>
      {/* 채팅수 */}
      <div className="flex flex-1 flex-col gap-2  min-w-27.5">
        <span className="text-font-2 body-4">채팅수</span>
        <span className="title-3">
          {formatWithCommas(MOCK_STUDIO_DATA.chatCount)}
        </span>
      </div>
      {/* 본인인증 */}
      <div className="flex flex-1 flex-col gap-2  min-w-27.5">
        <span className="text-font-2 body-4">본인인증</span>
        <span className="title-3">
          {MOCK_STUDIO_DATA.isIdentityVerified ? "인증완료" : "미인증"}
        </span>
      </div>
      {/* 성인인증 */}
      <div className="flex flex-1 items-center gap-2 relative min-w-27.5">
        <div className="flex flex-1 flex-col gap-2 ">
          <span className="text-font-2 body-4">성인인증</span>
          <span
            className={`title-3 ${!MOCK_STUDIO_DATA.isAdultVerified ? "text-font-disabled" : ""}`}
          >
            {MOCK_STUDIO_DATA.isAdultVerified ? "인증완료" : "미인증"}
          </span>
        </div>
        {/* 화살표 아이콘 (오른쪽 끝) 추후 성인인증 로직이 생긴다면 경로 입력*/}
        <Link href={""} className="p-1 rounded-lg hover:bg-btn-hover">
          <ArrowRight className="w-3 h-3 text-font-2" />
        </Link>
      </div>
    </div>
  );
};

export default StudioStats;
