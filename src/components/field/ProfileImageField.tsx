"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { CameraFill } from "@/icons";
import { showAppToast } from "@/lib/toast";
import { ProfileEditFormType } from "@/schema/profile.schema";

// 제네릭 관련 타입 충돌을 방지하기 위해 이 컴포넌트가 제어할 대상 타입을 명시합니다.
interface ProfileImageFieldProps {
  name?: "profileImg"; // 혹은 keyof ProfileEditFormType
}

const ProfileImageField = ({ name = "profileImg" }: ProfileImageFieldProps) => {
  // useFormContext에 프로필 폼 타입을 주입하여 내부 setValue들의 타입 안정성을 확보합니다.
  const { setValue, control } = useFormContext<ProfileEditFormType>();
  const profileImg = useWatch({ control, name });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      return showAppToast("warning", "jpg, png, webp 이미지 파일만 가능합니다.", {
        size: "s",
      });
    }
    if (file.size > 5 * 1024 * 1024) {
      return showAppToast("warning", "파일 용량은 최대 5MB까지 가능합니다.", {
        size: "s",
      });
    }

    // 파일 객체 저장 (ProfileEditFormType에 선언된 키값에 맞게 매핑)
    setValue("profileImgFile", file, { shouldValidate: true });

    // FileReader의 결과(string)를 타입 단언(as string)을 통해
    // ProfileEditFormType["profileImg"] 구조(string)와 일치시켜 할당합니다.
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setValue(name, reader.result, {
          shouldValidate: true,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div id="profile-image-section" className="relative w-fit h-fit mx-auto">
      <input
        id="profile-image-select"
        onChange={handleImageChange}
        className="hidden"
        accept=".jpg,.jpeg,.png,.webp"
        type="file"
      />
      <label htmlFor="profile-image-select" className="cursor-pointer">
        <Image
          src={(profileImg as string) || "/p1.png"}
          alt="프로필 이미지"
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover"
        />
        <span className="absolute bottom-0 right-0 bg-main flex items-center justify-center w-7.5 h-7.5 rounded-full">
          <CameraFill className="w-4.5 h-4.5" />
        </span>
      </label>
    </div>
  );
};

export default ProfileImageField;
