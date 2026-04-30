"use client";

import React, { ChangeEvent, useState, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Image from "next/image";

import { ModalLayout } from "../ModalLayout";
import { CameraFill, Close, PhoneFill } from "@/icons";
import SmartInput from "../SmartInput";
import { BirthDateInput } from "../BirthDateInput";
import ActiveButton from "../ActiveButton";
import PhoneNumberModal from "./PhoneNumberModal";

import { ProfileEditFormType } from "@/type/user";
import { NICKNAME_REGEX } from "@/lib/regex";
import { LANGUAGE_LIST } from "@/constants/language";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import { useUserStore } from "@/store/useUserStore";
import { useUpdateMyInfoMutation } from "@/api/user/patchMyInfo";

import GoogleProvider from "@/icons/provider/GoogleProvider";
import KakaoProvider from "@/icons/provider/KakaoProvider";
import PlatProvider from "@/icons/provider/PlatProvider";

const PROVIDER_LOGOS: Record<string, React.ReactNode> = {
  google: <GoogleProvider />,
  kakao: <KakaoProvider />,
  plat: <PlatProvider />,
};

interface ProfileEditModalProps {
  onClose: () => void;
}

const ProfileEditModal = ({ onClose }: ProfileEditModalProps) => {
  const user = useUserStore((state) => state.user);
  const { mutate: updateMyInfo } = useUpdateMyInfoMutation();
  const [isPhoneModal, setIsPhoneModal] = useState(false);
  console.log(user);
  // --- 1. 폼 초기화 ---
  const methods = useForm<ProfileEditFormType>({
    mode: "onChange",
    defaultValues: {
      profileImg: user?.profileImage || "",
      birth: user?.birth || "",
      countryCode: user?.phone.countryCode || "",
      email: "tmdi8635@gmail.com",
      gender: user?.gender || "MALE",
      bio: user?.bio || "",
      nickname: user?.nickname || "",
      phoneNumber: user?.phone.number || "",
      provider: "google",
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = methods;

  // --- 2. 실시간 감시 (필요한 값만 개별 구독하여 리렌더링 최적화) ---
  const [
    nickname,
    profileImg,
    gender,
    countryCode,
    phoneNumber,
    bio,
    provider,
    birth,
  ] = watch([
    "nickname",
    "profileImg",
    "gender",
    "countryCode",
    "phoneNumber",
    "bio",
    "provider",
    "birth",
  ]);

  // --- 3. 닉네임 중복 체크 로직 ---
  const debouncedNickname = useDebounce({ value: nickname, delay: 500 });
  const isNicknameCheckEnabled =
    !!debouncedNickname &&
    debouncedNickname.trim().length > 0 &&
    debouncedNickname !== user?.nickname;

  const { data: nicknameData, isFetching } = useCheckNicknameQuery(
    debouncedNickname,
    {
      enabled: isNicknameCheckEnabled,
      retry: false,
    },
  );

  // --- 4. 핸들러 함수들 ---
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
      setValue("profileImg", reader.result as string, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSave = (data: ProfileEditFormType) => {
    const {
      birth,
      gender,
      nickname,
      profileImg,
      bio,
      countryCode,
      phoneNumber,
    } = data;
    updateMyInfo(
      {
        bio: bio || "",
        birth: birth,
        gender: gender,
        phone: {
          countryCode: countryCode || "",
          number: phoneNumber || "",
        },
        profileImage: profileImg || "",
        nickname: nickname,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => {
          setError("nickname", { message: err.fields?.nickname });
          setError("gender", { message: err.fields?.gender });
          setError("birth", { message: err.fields?.birth });
        },
      },
    );
  };

  // --- 5. 파생 데이터 ---
  const isSaveActive = true;

  return (
    <ModalLayout
      onClose={() => null}
      hasBackground
      className="p-5 min-h-112.5 max-h-160 w-150 max-w-[80vw]"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSave)} className="flex flex-col">
          <header className="flex items-center justify-between pb-8">
            <h2 className="text-[20px] font-medium">프로필 수정</h2>
            <Close onClick={onClose} className="w-5 h-5 cursor-pointer" />
          </header>

          <section
            id="profile-form-body"
            className="flex-1 max-h-140 overflow-y-auto"
          >
            <div
              id="profile-image-section"
              className="relative w-fit h-fit mx-auto"
            >
              <input
                id="profile-image-select"
                onChange={handleImageChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp"
                type="file"
              />
              <label htmlFor="profile-image-select" className="cursor-pointer">
                <Image
                  src={profileImg || "/p1.png"}
                  alt="user 프로필 이미지"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 bg-border-main flex items-center justify-center w-7.5 h-7.5 rounded-full">
                  <CameraFill className="w-4.5 h-4.5" />
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-6">
              <SmartInput
                {...register("nickname", {
                  pattern: {
                    value: NICKNAME_REGEX,
                    message: "닉네임 형식이 올바르지 않습니다.",
                  },
                  required: "닉네임은 필수입니다.",
                })}
                label="닉네임"
                required
                value={nickname}
                placeholder="닉네임을 입력해주세요."
                maxLength={15}
                error={
                  errors.nickname?.message ||
                  (!isFetching && nicknameData?.available === false
                    ? "이미 사용중인 닉네임입니다."
                    : undefined)
                }
              />

              <SmartInput
                {...register("bio")}
                type="textarea"
                label="소개글"
                value={bio}
                placeholder="소개글을 작성해주세요."
                maxLine={2}
                minLine={2}
                maxLength={50}
                error={errors.bio}
              />

              <BirthDateInput value={birth} disabled />

              <div className={cn("flex flex-col flex-1 gap-2 w-full")}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 font-medium text-sm">
                    <span>성별</span>
                    <span className="text-font-accents">*</span>
                  </div>
                </div>

                <div className="flex gap-2 text-sm">
                  {(["MALE", "FEMALE"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() =>
                        setValue("gender", g, { shouldValidate: true })
                      }
                      className={cn(
                        "flex-1 bg-bg-darkest border border-border-main rounded-xl py-3 transition-colors",
                        gender === g &&
                          "text-brand font-medium bg-brand-opacity",
                      )}
                    >
                      {g === "MALE" ? "남자" : "여자"}
                    </button>
                  ))}
                </div>
              </div>

              <div onClick={() => setIsPhoneModal(true)}>
                <SmartInput
                  {...register("phoneNumber")}
                  type="modal"
                  label="휴대폰"
                  value={phoneNumber}
                  placeholder="휴대폰 번호를 등록해보세요."
                  leftElement={(() => {
                    const target = LANGUAGE_LIST.find(
                      (v) => v.countryCode === countryCode,
                    );
                    if (!target)
                      return <PhoneFill className="w-5 h-5 text-font-2" />;

                    // 대문자로 시작하는 변수에 할당해야 JSX가 컴포넌트로 인식합니다.
                    const IconComponent = target.Icon;
                    return <IconComponent className="w-7.5 h-5 rounded-sm" />;
                  })()}
                />
              </div>

              <SmartInput
                {...register("email")}
                label="계정"
                disabled
                value={watch("email")}
                leftElement={PROVIDER_LOGOS[provider]}
              />
            </div>

            <footer className="flex justify-center">
              <button
                type="button"
                className="underline text-sm text-font-2 mx-auto mt-9"
              >
                회원탈퇴
              </button>
            </footer>

            <ActiveButton
              text="저장"
              onClick={handleSubmit(onSave)}
              isActive={isSaveActive}
              className="rounded-xl mt-10 mb-5"
            />
          </section>
          {isPhoneModal && (
            <PhoneNumberModal onClose={() => setIsPhoneModal(false)} />
          )}
        </form>
      </FormProvider>
    </ModalLayout>
  );
};

export default ProfileEditModal;
