import { Close, ImageIcon } from "@/icons";
import { CharacterCreateFormValues } from "@/schema/character.schema";
import Image from "next/image";
import React, { ChangeEvent } from "react";
import { useFormContext } from "react-hook-form";

const RepresentativeImage = () => {
  const { setValue, getValues } = useFormContext<CharacterCreateFormValues>();
  // const [preview, setValue] = useState<string | null>(null);
  const preview = getValues("representativeImage");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 형식 검사
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("jpg, png, webp 이미지 파일만 가능합니다.");
      e.target.value = ""; // 선택 초기화
      return;
    }

    // 파일 용량 검사 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 용량은 최대 5MB까지 가능합니다.");
      e.target.value = ""; // 선택 초기화
      return;
    }

    // 프리뷰 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue("representativeImage", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const previewRemove = () => {
    setValue("representativeImage", "");
  };

  return (
    <section>
      {/* 이미지 가이드 영역 */}
      <header className="flex flex-col gap-1 pb-5.25">
        <div className="flex items-center gap-1 title-3">
          <span>대표이미지</span>
          <span className="text-font-accents">*</span>
        </div>
        <p className="body-5 text-font-2">
          jpg, png, webp 이미지파일만 가능해요. 최대 5MB, 1:1 비율을 권장해요.
        </p>
      </header>

      {/* 이미지 업로드 컨트롤러 */}
      <div id="image-upload-wrapper" className="flex flex-col gap-2 w-fit">
        <input
          id="image"
          className="hidden"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.jfif"
          onChange={handleImageChange}
        />

        <label
          htmlFor="image"
          className="flex w-30 h-30 items-center justify-center bg-card rounded-xl overflow-hidden cursor-pointer"
        >
          {preview ? (
            <Image
              src={preview} // base64 string
              alt="대표 이미지 미리보기"
              // 부모 컨테이너(120px)에 맞춰 렌더링 크기 지정
              width={120}
              height={120}
              className="object-cover w-full h-full"
              // unoptimized={true}
            />
          ) : (
            <ImageIcon
              className="text-font-disabled w-7.5 h-7.5"
              width={60}
              height={60}
            />
          )}
        </label>

        <div className="flex gap-1 h-9">
          <label
            htmlFor="image"
            className="flex body-4 items-center justify-center whitespace-nowrap flex-1 cursor-pointer w-full text-center border border-border-main rounded-xl bg-bg-darkest px-auto py-2"
          >
            업로드
          </label>
          {preview && (
            <button
              onClick={previewRemove}
              type="button"
              className="flex items-center justify-center w-9 rounded-xl border border-[#FF383C] bg-[#FF383C]/10"
            >
              <Close className="w-4 h-4 text-font-accents" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default RepresentativeImage;
