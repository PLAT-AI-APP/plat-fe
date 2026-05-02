"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import { useFormContext, useWatch, FieldValues, Path, PathValue } from "react-hook-form";
import { CameraFill } from "@/icons";

interface ProfileImageFieldProps<T extends FieldValues> {
  name?: Path<T>;
}

const ProfileImageField = <T extends FieldValues>({
  name = "profileImg" as Path<T>,
}: ProfileImageFieldProps<T>) => {
  const { setValue, control } = useFormContext<T>();
  const profileImg = useWatch({ control, name });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return alert("jpg, png, webp 이미지 파일만 가능합니다.");
    }
    if (file.size > 5 * 1024 * 1024) {
      return alert("파일 용량은 최대 5MB까지 가능합니다.");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue(name, reader.result as PathValue<T, Path<T>>, { shouldValidate: true });
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
        <span className="absolute bottom-0 right-0 bg-border-main flex items-center justify-center w-7.5 h-7.5 rounded-full">
          <CameraFill className="w-4.5 h-4.5" />
        </span>
      </label>
    </div>
  );
};

export default ProfileImageField;
