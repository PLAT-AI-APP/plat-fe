"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useCompleteDevIdentityVerificationMutation,
  useConfirmIdentityVerificationMutation,
} from "@/api/verification/identityVerification";
import {
  IDENTITY_VERIFICATION_MESSAGE_TYPE,
  type CompleteDevIdentityVerificationRequest,
  type IdentityVerificationMessage,
} from "@/api/verification/types";
import Button from "@/components/ui/Button";
import StatusWarning from "@/icons/StatusWarning";
import { resolveErrorMessage } from "@/lib/apiError";
import { toSafeReturnPath } from "@/lib/safePath";
import { useAuthStore } from "@/store/useAuthStore";

type Gender = CompleteDevIdentityVerificationRequest["gender"];

const BIRTH_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const fieldClassName =
  "body-5 h-11 w-full rounded-xl border border-main bg-darkest px-4 text-font-1 outline-none focus:field-focus!";

/**
 * 개발용 가짜 본인인증. 서버의 dev 전용 API 로 인증 건을 "끝낸" 상태로 만든다.
 *
 * - 팝업(기본): 끝내면 연 화면(opener)에 알리고 창을 닫는다. 확정은 연 화면의 모달이 한다.
 * - 같은 탭(mode=redirect, 팝업이 막혔을 때): 여기서 확정까지 마치고 원래 화면으로 돌아간다.
 */
const DevIdentityVerificationContents = () => {
  const t = useTranslations("adultVerification.dev");
  const modalT = useTranslations("adultVerification.modal");
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationId = searchParams.get("vid") ?? "";
  const isRedirectMode = searchParams.get("mode") === "redirect";
  const returnTo = toSafeReturnPath(searchParams.get("returnTo"));
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn) && isAuthReady;

  const [name, setName] = useState("");
  const [birth, setBirth] = useState("2000-01-01");
  const [gender, setGender] = useState<Gender>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [doneMessage, setDoneMessage] = useState<string | null>(null);

  const completeMutation = useCompleteDevIdentityVerificationMutation();
  const confirmMutation = useConfirmIdentityVerificationMutation();
  const isPending = completeMutation.isPending || confirmMutation.isPending;
  const apiError = completeMutation.error ?? confirmMutation.error;

  const notifyOpener = () => {
    const opener = window.opener as Window | null;
    if (!opener || opener.closed) return false;

    const message: IdentityVerificationMessage = {
      type: IDENTITY_VERIFICATION_MESSAGE_TYPE,
      verificationId,
    };
    // 받는 쪽을 같은 사이트로 못 박는다. opener 가 다른 사이트로 옮겨 갔다면 전달되지 않는다.
    opener.postMessage(message, window.location.origin);
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !BIRTH_PATTERN.test(birth)) {
      setInputError(t("invalidInput"));
      return;
    }
    setInputError(null);

    completeMutation.mutate(
      { verificationId, body: { name: name.trim(), birth, gender } },
      {
        onSuccess: () => {
          if (!isRedirectMode && notifyOpener()) {
            setDoneMessage(t("popupDone"));
            window.close();
            return;
          }

          confirmMutation.mutate(verificationId, {
            onSuccess: (result) =>
              setDoneMessage(
                result.adult ? modalT("adultDoneTitle") : modalT("identityOnlyTitle"),
              ),
          });
        },
      },
    );
  };

  const renderBody = () => {
    if (!verificationId) {
      return <p className="body-4 text-font-error">{t("missingId")}</p>;
    }
    if (!isAuthReady) {
      return <div className="skeleton h-60 w-full rounded-xl" aria-hidden="true" />;
    }
    if (!isLoggedIn) {
      return <p className="body-4 text-font-error">{t("loginRequired")}</p>;
    }
    if (doneMessage) {
      return (
        <div className="flex flex-col gap-4">
          <p className="body-4 text-font-1" role="status">
            {doneMessage}
          </p>
          {(isRedirectMode || !window.opener) && (
            <Button size="lg" fullWidth onClick={() => router.replace(returnTo)}>
              {t("backToApp")}
            </Button>
          )}
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="title-5 text-font-1">{t("name")}</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("namePlaceholder")}
            maxLength={30}
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="title-5 text-font-1">{t("birth")}</span>
          <input
            type="date"
            value={birth}
            onChange={(event) => setBirth(event.target.value)}
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="title-5 text-font-1">{t("gender")}</span>
          <select
            value={gender ?? ""}
            onChange={(event) =>
              setGender((event.target.value || null) as Gender)
            }
            className={fieldClassName}
          >
            <option value="">{t("genderNone")}</option>
            <option value="MALE">{t("male")}</option>
            <option value="FEMALE">{t("female")}</option>
          </select>
        </label>

        {(inputError || apiError) && (
          <p className="body-6 text-font-error" role="alert">
            {inputError ?? resolveErrorMessage(apiError)}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={isPending}
          isPending={isPending}
        >
          {t("submit")}
        </Button>
      </form>
    );
  };

  return (
    <section className="flex w-full justify-center px-5 py-8">
      <div className="flex w-full max-w-100 flex-col gap-6">
        <p
          role="note"
          className="body-6 flex items-start gap-2 rounded-xl border border-danger bg-danger-bg px-4 py-3 text-danger"
        >
          <StatusWarning className="mt-0.5 size-4 shrink-0" />
          {t("banner")}
        </p>
        <h1 className="heading-2 text-font-1">{t("title")}</h1>
        {renderBody()}
      </div>
    </section>
  );
};

export default DevIdentityVerificationContents;
