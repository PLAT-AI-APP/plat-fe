"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalLayout } from "../ModalLayout";
import { Close } from "@/icons";
import { BirthDateInput } from "../BirthDateInput";
import ActiveButton from "../ActiveButton";
import { useUserStore } from "@/store/useUserStore";
import { useUpdateMyInfoMutation } from "@/api/user/patchMyInfo";
import { useFormServerError } from "@/hooks/useFormServerError";
import {
  profileEditFormSchema,
  ProfileEditFormType,
} from "@/schema/profile.schema";
import ProfileImageField from "../field/ProfileImageField";
import NicknameField from "../field/NicknameField";
import BioField from "../field/BioField";
import GenderField from "../field/GenderField";
import AccountField from "../field/AccountField";
import { ProfileEditModalProps } from "@/type/modal";
import { useModalStore } from "@/store/useModalStore";
import { showFirstFieldErrorToast } from "@/lib/formError";
import { useTranslateText } from "@/hooks/useTranslateText";

const ProfileEditForm = ({ onClose }: ProfileEditModalProps) => {
  const t = useTranslations("modalUi.profileEdit");
  const commonT = useTranslations("modalUi.common");
  const translateText = useTranslateText();
  const {
    handleSubmit,
    watch,
    setFocus,
    formState: { isValid },
  } = useFormContext<ProfileEditFormType>();
  const { mutate: updateMyInfo, isPending: isUpdating } =
    useUpdateMyInfoMutation();
  const { setFieldErrors } = useFormServerError<ProfileEditFormType>();
  const openModal = useModalStore((state) => state.openModal);
  const birth = watch("birth");

  const onSave = (data: ProfileEditFormType) => {
    updateMyInfo(
      {
        bio: data.bio || "",
        birth: data.birth,
        gender: data.gender,
        profileImgFile: data.profileImgFile || "",
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
    <form
      onSubmit={handleSubmit(onSave, (formErrors) =>
        showFirstFieldErrorToast(formErrors, setFocus, translateText),
      )}
      className="flex flex-col"
    >
      <header className="flex items-center justify-between pb-8">
        <h2 className="title-1">{t("title")}</h2>
        <Close
          onClick={onClose}
          aria-label={commonT("close")}
          className="h-5 w-5 cursor-pointer"
        />
      </header>

      <section
        id="profile-form-body"
        className="max-h-140 flex-1 overflow-y-auto"
      >
        <ProfileImageField />

        <div className="flex flex-col gap-6">
          <NicknameField />
          <BioField />
          <BirthDateInput value={birth} />
          <GenderField />
          <AccountField />
        </div>

        <footer className="mt-4 flex justify-end gap-9">
          <button
            type="button"
            onClick={() => openModal("FIND_PASSWORD")}
            className="body-5 w-fit text-font-2 underline hover:text-font-1"
          >
            {t("changePassword")}
          </button>
        </footer>

        <ActiveButton
          text={t("submit")}
          type="submit"
          isActive={isValid}
          disabled={!isValid || isUpdating}
          className="mt-10 mb-5 rounded-xl"
        />
      </section>
    </form>
  );
};

const ProfileEditModal = ({ onClose }: ProfileEditModalProps) => {
  const user = useUserStore((state) => state.user);

  const methods = useForm<ProfileEditFormType>({
    mode: "onChange",
    resolver: zodResolver(profileEditFormSchema),
    defaultValues: {
      profileImg: user?.profileImage || "",
      profileImgFile: "",
      birth: user?.birth || "",
      email: user?.email || "",
      gender: user?.gender || "",
      bio: user?.bio || "",
      nickname: user?.nickname || "",
      provider: user?.provider || "EMAIL",
    },
  });

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="min-h-112.5 max-h-160 w-150 max-w-[80vw] p-5"
    >
      <FormProvider {...methods}>
        <ProfileEditForm onClose={onClose} />
      </FormProvider>
    </ModalLayout>
  );
};

export default ProfileEditModal;
