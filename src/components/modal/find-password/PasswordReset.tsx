import { useTranslations } from "next-intl";
import React from "react";
import { Form, useFormContext, useWatch } from "react-hook-form";
import { notifyApiError } from "@/api";
import { usePasswordResetMutation } from "@/api/auth/postPasswordReset";
import ActiveButton from "@/components/ActiveButton";
import PasswordCheckField from "@/components/field/PasswordCheckField";
import PasswordField from "@/components/field/PasswordField";
import { showAppToast } from "@/lib/toast";
import { PasswordResetFormSchemaValues } from "@/schema/auth.schema";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";

/** 서버 검증 오류(fields) 중 이 화면에 칸이 있는 것 */
const RESET_FIELDS = ["password", "passwordCheck"] as const;

const PasswordReset = () => {
  const t = useTranslations("modalUi.passwordReset");
  const { mutate: passwrodReset, isPending: isResetting } =
    usePasswordResetMutation();
  const {
    control,
    setError,
    formState: { errors },
  } = useFormContext<PasswordResetFormSchemaValues>();

  const password = useWatch({
    control,
    name: "password",
  });

  const passwordCheck = useWatch({
    control,
    name: "passwordCheck",
  });

  const isPasswordResetActive =
    !!password &&
    !!passwordCheck &&
    !errors.password &&
    !errors.passwordCheck &&
    password === passwordCheck;

  const closeModal = useModalStore((state) => state.closeModal);
  const openModal = useModalStore((state) => state.openModal);
  const onSubmit = (data: PasswordResetFormSchemaValues) => {
    if (isResetting) return;

    // 결과를 받기 전에 창을 닫으면 실패해도 사용자는 바뀐 줄 알았다. 성공했을 때만 닫는다.
    passwrodReset(data, {
      onSuccess: () => {
        closeModal();
        const { isLoggedIn } = useAuthStore.getState();
        if (isLoggedIn) {
          showAppToast("success", t("successToast"));
          return;
        }
        showAppToast("success", t("successToast"), {
          description: t("successLoginHint"),
        });
        // 로그인 창에서 들어왔다면 그 창이 아래에 남아 있다. 아니면 새 비밀번호로 바로 로그인할 수 있게 연다.
        const hasLoginModal = useModalStore
          .getState()
          .modals.some((modal) => modal.type === "LOGIN");
        if (!hasLoginModal) openModal("LOGIN", { triggerRef: undefined });
      },
      onError: (error) => {
        let hasFieldError = false;
        RESET_FIELDS.forEach((field) => {
          const message = error.fields?.[field];
          if (!message) return;
          hasFieldError = true;
          setError(field, { type: "server", message });
        });
        // 칸에 붙일 수 없는 실패(인증 만료·네트워크 등)는 토스트로 알린다.
        if (!hasFieldError) notifyApiError(error);
      },
    });
  };

  return (
    <Form
      id="password-reset-form"
      control={control}
      onSubmit={({ data }) => onSubmit(data)}
      className="w-screen max-w-112.5 rounded-3xl border border-main bg-darker px-6 py-9"
    >
      <header className="flex flex-col gap-1.5 pb-9">
        <h2 className="heading-3">{t("title")}</h2>
        <p className="body-5 text-font-2">{t("description")}</p>
      </header>

      <fieldset className="flex flex-col gap-6">
        <PasswordField />
        <PasswordCheckField />
      </fieldset>

      <ActiveButton
        isActive={isPasswordResetActive}
        isPending={isResetting}
        text={t("submit")}
        className="mt-6"
        type="submit"
        form="password-reset-form"
      />
    </Form>
  );
};

export default PasswordReset;
