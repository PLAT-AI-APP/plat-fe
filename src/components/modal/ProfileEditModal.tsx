"use client";

import React from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { ModalLayout } from "../ModalLayout";
import { Close } from "@/icons";
import { BirthDateInput } from "../BirthDateInput";
import ActiveButton from "../ActiveButton";

import { ProfileEditFormType } from "@/type/user";
import { useUserStore } from "@/store/useUserStore";
import { useUpdateMyInfoMutation } from "@/api/user/patchMyInfo";
import { useFormServerError } from "@/hooks/useFormServerError";

import ProfileImageField from "../field/ProfileImageField";
import NicknameField from "../field/NicknameField";
import BioField from "../field/BioField";
import GenderField from "../field/GenderField";
// import PhoneField from "../field/PhoneField";
import AccountField from "../field/AccountField";
import Link from "next/link";

interface ProfileEditModalProps {
  onClose: () => void;
}

const ProfileEditForm = ({ onClose }: ProfileEditModalProps) => {
  const { handleSubmit, watch } = useFormContext<ProfileEditFormType>();
  const { mutate: updateMyInfo } = useUpdateMyInfoMutation();
  const { setFieldErrors } = useFormServerError<ProfileEditFormType>();
  // const [isPhoneModal, setIsPhoneModal] = useState(false);

  const birth = watch("birth");

  const onSave = (data: ProfileEditFormType) => {
    updateMyInfo(
      {
        bio: data.bio || "",
        birth: data.birth,
        gender: data.gender,
        phone: {
          countryCode: data.countryCode || "",
          number: data.phoneNumber || "",
        },
        profileImage: data.profileImg || "",
        nickname: data.nickname,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => {
          setFieldErrors(err.fields);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col">
      <header className="flex items-center justify-between pb-8">
        <h2 className="text-[20px] font-medium">프로필 수정</h2>
        <Close onClick={onClose} className="w-5 h-5 cursor-pointer" />
      </header>

      <section
        id="profile-form-body"
        className="flex-1 max-h-140 overflow-y-auto"
      >
        <ProfileImageField />

        <div className="flex flex-col gap-6">
          <NicknameField />
          <BioField />
          <BirthDateInput value={birth} disabled />
          <GenderField />
          {/* <PhoneField onOpenModal={() => setIsPhoneModal(true)} /> */}
          <AccountField />
        </div>

        <footer className="flex gap-9 justify-center mt-9">
          <Link
            href={"/find-password"}
            className="underline text-sm text-font-2 w-fit"
          >
            비밀번호 변경
          </Link>
          <button type="button" className="underline text-sm text-font-2 w-fit">
            회원탈퇴
          </button>
        </footer>

        <ActiveButton
          text="저장"
          type="submit"
          isActive={true}
          className="rounded-xl mt-10 mb-5"
        />
      </section>
      {/* {isPhoneModal && (
        <PhoneNumberModal onClose={() => setIsPhoneModal(false)} />
      )} */}
    </form>
  );
};

const ProfileEditModal = ({ onClose }: ProfileEditModalProps) => {
  const user = useUserStore((state) => state.user);

  const methods = useForm<ProfileEditFormType>({
    mode: "onChange",
    defaultValues: {
      profileImg: user?.profileImage || "",
      birth: user?.birth || "",
      countryCode: user?.phone.countryCode || "",
      email: user?.email || "",
      gender: user?.gender || "MALE",
      bio: user?.bio || "",
      nickname: user?.nickname || "",
      phoneNumber: user?.phone.number || "",
      provider: user?.provider || "plat",
    },
  });

  return (
    <ModalLayout
      onClose={() => null}
      hasBackground
      className="p-5 min-h-112.5 max-h-160 w-150 max-w-[80vw]"
    >
      <FormProvider {...methods}>
        <ProfileEditForm onClose={onClose} />
      </FormProvider>
    </ModalLayout>
  );
};

export default ProfileEditModal;
