import Image from "@/icons/Image";
import React from "react";

const RepresentativeImage = () => {
  return (
    <section>
      {/* 이미지 가이드 영역 */}
      <header className="flex flex-col gap-1 pb-5.25">
        <div className="flex items-center gap-1 font-semibold">
          <span>대표이미지</span>
          <span className="text-font-accents">*</span>
        </div>
        <p className="text-xs text-font-2">
          jpg, png, webp 이미지파일만 가능해요. 최대 5MB, 1:1 비율을 권장해요.
        </p>
      </header>

      {/* 이미지 업로드 컨트롤러 */}
      <div id="image-upload-wrapper" className="flex flex-col gap-2 w-fit">
        <input id="image" className="hidden" type="file" />

        <label
          htmlFor="image"
          className="flex w-30 h-30 items-center justify-center bg-card rounded-xl"
        >
          <Image className="text-font-disabled w-7.5 h-7.5" />
        </label>

        <label
          htmlFor="image"
          className="cursor-pointer w-full text-center border border-border-main rounded-xl bg-bg-darkest px-8 py-2"
        >
          업로드
        </label>
      </div>
    </section>
  );
};

export default RepresentativeImage;
