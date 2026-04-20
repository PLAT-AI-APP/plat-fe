import React, { ChangeEvent, useState } from "react";
import { ModalLayout } from "../ModalLayout";
import { CameraFill, Close, Google, Kakao, PhoneFill } from "@/icons";
import Image from "next/image";
import SmartInput from "../SmartInput";
import { FormProvider, useForm } from "react-hook-form";
import { ProfileEditFormType } from "@/type/user";
import { NICKNAME_REGEX } from "@/lib/regex";
import { BirthDateInput } from "../BirthDateInput";
import { LANGUAGE_LIST } from "@/constants/language";
import { cn } from "@/lib/utils";
import GoogleProvider from "@/icons/provider/GoogleProvider";
import KakaoProvider from "@/icons/provider/KakaoProvider";
import PlatProvider from "@/icons/provider/PlatProvider";
import ActiveButton from "../ActiveButton";
import PhoneNumberModal from "./PhoneNumberModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckNicknameQuery } from "@/api/auth/checkNickname";
import { useUserStore } from "@/store/useUserStore";

const PROVIDER_LOGOS: Record<string, React.ReactNode> = {
  google: <GoogleProvider />,
  kakao: <KakaoProvider />,
  plat: <PlatProvider />,
};

interface ProfileEditModalProps {
  onClose: () => void;
}

const ProfileEditModal = ({ onClose }: ProfileEditModalProps) => {
  const profileImage = useUserStore((state) => state.user?.profileImage);
  const nicknameStore = useUserStore((state) => state.user?.nickname);
  const birth = useUserStore((state) => state.user?.birth);
  const bio = useUserStore((state) => state.user?.bio);
  const genderStore = useUserStore((state) => state.user?.gender);
  const countryCode = useUserStore((state) => state.user?.phone.countryCode);
  const number = useUserStore((state) => state.user?.phone.number);

  // --- 1. 상태 및 폼 정의 ---
  const methods = useForm<ProfileEditFormType>({
    mode: "onChange",
    defaultValues: {
      profileImg: profileImage,
      birthDate: birth,
      countryCode: countryCode,
      email: "tmdi8635@gmail.com",
      gender: genderStore,
      introduce: bio,
      nickname: nicknameStore,
      phoneNumber: number,
      provider: "google",
    },
  });

  const {
    register,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = methods;

  const [isPhoneModal, setIsPhoneModal] = useState(false);

  // --- 2. 데이터 가공 및 파생 변수 ---
  const formValue = watch();
  const [nickname, gender, birthDate, profileImg] = watch([
    "nickname",
    "gender",
    "birthDate",
    "profileImg",
  ]);

  const LoginLogo = PROVIDER_LOGOS[formValue.provider];

  const isRequiredFieldsValid =
    !!nickname && !!gender && !errors.nickname && !errors.gender;

  const ToggleIsPhoneModal = () => {
    setIsPhoneModal((prev) => !prev);
  };

  const debouncedNickname = useDebounce({ value: nickname, delay: 500 });

  // 디바운스된 값이 있고, 공백을 제거했을 때도 내용이 있는 경우에만 실행
  const isEnabled = !!debouncedNickname && debouncedNickname.trim().length > 0;
  // 디바운스된 값이 있을 때만 쿼리를 활성화
  const { data, isFetching } = useCheckNicknameQuery(debouncedNickname, {
    enabled: isEnabled,
    retry: false,
  });

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
      setValue("profileImg", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // const previewRemove = () => {
  //   setValue("profileImg", "");
  // };

  return (
    <ModalLayout
      onClose={() => null}
      hasBackground
      className="p-5 min-h-112.5 max-h-160 w-150 max-w-[80vw]"
    >
      <FormProvider {...methods}>
        <form className="flex flex-col">
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
                  src={profileImg ? profileImg : "/p1.png"}
                  alt="user 프로필 이미지"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full"
                />
                <span className="absolute bottom-0 right-0 bg-border-main flex items-center justify-center w-7.5 h-7.5 rounded-full">
                  <CameraFill className="w-4.5 h-4.5" />
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-6">
              {/* 닉네임 input */}
              <SmartInput
                {...register("nickname", {
                  pattern: {
                    value: NICKNAME_REGEX,
                    message: "닉네임 형식이 올바르지 않습니다.",
                  },
                  // onChange: () => {
                  //   setError("nickname", {
                  //     message: "중복된 닉네임입니다.",
                  //   });
                  // },
                })}
                label="닉네임"
                required
                value={formValue.nickname}
                placeholder="닉네임을 입력해주세요."
                maxLength={15}
                error={
                  // 1순위: RHF 자체 형식 에러 (Regex 등)
                  errors.nickname?.message ||
                  // 2순위: API 중복 에러 (로딩 중이 아닐 때만, 명확하게 false인지 확인)
                  (!isFetching && data?.available === false
                    ? "이미 사용중인 닉네임입니다."
                    : undefined)
                }
              />

              {/* 소개글 input */}
              <SmartInput
                {...register("introduce")}
                type="textarea"
                label="소개글"
                value={formValue.introduce}
                placeholder="소개글을 작성해주세요."
                maxLine={2}
                minLine={2}
                maxLength={50}
                error={errors.introduce}
                inputClassName="bg-bg-darkest"
                inputBoxClassName="bg-bg-darkest"
              />

              {/* 생년월일 input */}
              <BirthDateInput
                // {...register("birthDate")}
                value={birthDate}
                disabled
                // handleBirthDate={handleBirthDate}
              />

              <div className={cn("flex flex-col flex-1 gap-2 w-full")}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 font-medium text-sm">
                    <span>성별</span>
                    <span className="text-font-accents">*</span>
                  </div>
                </div>

                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    // onClick={() => handleGender("male")}
                    className={cn(
                      "flex-1 bg-bg-darkest border border-border-main rounded-xl py-3",
                      formValue.gender === "MALE" &&
                        "text-brand font-medium bg-brand-opacity",
                    )}
                  >
                    남자
                  </button>
                  <button
                    type="button"
                    // onClick={() => handleGender("female")}
                    className={cn(
                      "flex-1 bg-bg-darkest border border-border-main rounded-xl py-3",
                      formValue.gender === "FEMALE" &&
                        "text-brand font-medium bg-brand-opacity",
                    )}
                  >
                    여자
                  </button>
                </div>
              </div>

              {/* 휴대폰 등록 modal */}
              <div onClick={ToggleIsPhoneModal}>
                <SmartInput
                  {...register("phoneNumber")}
                  type="modal"
                  label="휴대폰"
                  value={formValue.phoneNumber}
                  placeholder="휴대폰 번호를 등록해보세요."
                  rightElement={
                    formValue.countryCode ? (
                      (() => {
                        const targetCountry = LANGUAGE_LIST.find(
                          (v) => v.countryCode === formValue.countryCode,
                        );
                        if (targetCountry) {
                          const { Icon } = targetCountry;
                          return <Icon className="w-7.5 h-5 rounded-sm" />;
                        }
                      })()
                    ) : (
                      <PhoneFill className="w-5 h-5 text-font-2" />
                    )
                  }
                />
              </div>

              {/* 현재 계정 확인 */}
              <SmartInput
                {...register("email")}
                type="input"
                label="계정"
                disabled
                value={formValue.email}
                rightElement={LoginLogo}
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
              isActive={isRequiredFieldsValid}
              className="rounded-xl mt-10 mb-5"
            />
          </section>
          {isPhoneModal && <PhoneNumberModal onClose={ToggleIsPhoneModal} />}
        </form>
      </FormProvider>
    </ModalLayout>
  );
};

export default ProfileEditModal;
