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
import AdultEmblem from "@/components/adult/AdultEmblem";
import Button from "@/components/ui/Button";
import StatusWarning from "@/icons/StatusWarning";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import { resolveErrorMessage } from "@/lib/apiError";
import { toSafeReturnPath } from "@/lib/safePath";
import { useAuthStore } from "@/store/useAuthStore";

type Gender = CompleteDevIdentityVerificationRequest["gender"];

const BIRTH_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const fieldClassName =
  "body-5 h-12 w-full rounded-xl border border-main bg-darkest px-4 text-font-1 outline-none transition-colors focus:field-focus!";

/** 시험용 생년월일. 오늘(한국 날짜) 기준으로 만든다 — 생일 당일·하루 전 같은 경계를 손으로 계산하지 않게. */
const presetBirth = (years: number, dayOffset = 0) => {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const today = dayjs(kst.toISOString().slice(0, 10));
  return today.subtract(years, "year").add(dayOffset, "day").format("YYYY-MM-DD");
};

const PRESETS = [
  { key: "presetAdult", birth: () => presetBirth(25) },
  { key: "presetBirthday", birth: () => presetBirth(19) },
  { key: "presetMinor", birth: () => presetBirth(19, 1) },
] as const;

const GENDERS: { value: Gender; key: "genderNone" | "male" | "female" }[] = [
  { value: null, key: "genderNone" },
  { value: "MALE", key: "male" },
  { value: "FEMALE", key: "female" },
];

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
  const [done, setDone] = useState<{ title: string; adult: boolean | null } | null>(null);

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
            setDone({ title: t("popupDone"), adult: null });
            window.close();
            return;
          }

          confirmMutation.mutate(verificationId, {
            onSuccess: (result) =>
              setDone({
                title: result.adult ? modalT("adultDoneTitle") : modalT("identityOnlyTitle"),
                adult: result.adult,
              }),
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
      return <div className="skeleton h-80 w-full rounded-2xl" aria-hidden="true" />;
    }
    if (!isLoggedIn) {
      return <p className="body-4 text-font-error">{t("loginRequired")}</p>;
    }
    if (done) {
      return (
        <div className="flex flex-col items-center gap-2 py-4 text-center" role="status">
          <AdultEmblem size="md" badge={done.adult === false ? "warn" : "done"} />
          <p className="title-2 mt-2 text-font-0">{done.title}</p>
          {(isRedirectMode || !window.opener) && (
            <Button size="lg" fullWidth className="mt-6" onClick={() => router.replace(returnTo)}>
              {t("backToApp")}
            </Button>
          )}
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="title-5 text-font-1">{t("name")}</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("namePlaceholder")}
            maxLength={30}
            autoComplete="off"
            className={fieldClassName}
          />
        </label>

        <div className="flex flex-col gap-2">
          <label htmlFor="dev-birth" className="title-5 text-font-1">
            {t("birth")}
          </label>
          <input
            id="dev-birth"
            type="date"
            value={birth}
            onChange={(event) => setBirth(event.target.value)}
            className={fieldClassName}
          />
          <div className="flex flex-wrap gap-1.5" aria-label={t("presets")}>
            {PRESETS.map((preset) => {
              const value = preset.birth();
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => setBirth(value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                    birth === value
                      ? "border-brand bg-brand-opacity text-brand"
                      : "border-main text-font-2 hover:text-font-1",
                  )}
                >
                  {t(preset.key)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="title-5 text-font-1">{t("gender")}</span>
          <div role="radiogroup" aria-label={t("gender")} className="grid grid-cols-3 gap-1 rounded-xl bg-darkest p-1">
            {GENDERS.map((option) => (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={gender === option.value}
                onClick={() => setGender(option.value)}
                className={cn(
                  "body-5 h-10 rounded-lg font-semibold transition-colors",
                  gender === option.value ? "bg-card text-font-0 shadow-sm" : "text-font-2 hover:text-font-1",
                )}
              >
                {t(option.key)}
              </button>
            ))}
          </div>
        </div>

        {(inputError || apiError) && (
          <p className="body-6 text-font-error" role="alert">
            {inputError ?? resolveErrorMessage(apiError)}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          className="mt-1"
          disabled={isPending}
          isPending={isPending}
        >
          {t("submit")}
        </Button>
      </form>
    );
  };

  return (
    <section className="flex w-full justify-center px-5 py-8 sm:py-14">
      <div className="w-full max-w-110 overflow-hidden rounded-3xl border border-main bg-dark shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        {/* 인증 창 머리 — 통신사 본인확인 창처럼 "지금 어디서 무엇을 하는지" 를 먼저 보여 준다 */}
        <header className="flex items-center gap-3 border-b border-main bg-darkest px-5 py-4">
          <AdultEmblem size="sm" />
          <div className="flex min-w-0 flex-col">
            <span className="title-4 text-font-0">{t("windowTitle")}</span>
            <span className="body-7 text-font-2">{t("subtitle")}</span>
          </div>
          <span className="ml-auto rounded-md bg-danger px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
            DEV
          </span>
        </header>

        <div className="flex flex-col gap-5 px-5 py-6">
          <p
            role="note"
            className="body-7 flex items-start gap-2 rounded-xl bg-danger-bg px-3.5 py-2.5 text-danger"
          >
            <StatusWarning className="mt-px size-3.5 shrink-0" />
            {t("banner")}
          </p>
          {renderBody()}
        </div>
      </div>
    </section>
  );
};

export default DevIdentityVerificationContents;
