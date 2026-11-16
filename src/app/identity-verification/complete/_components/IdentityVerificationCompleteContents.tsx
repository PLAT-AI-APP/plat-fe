"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useConfirmIdentityVerificationMutation } from "@/api/verification/identityVerification";
import { IDENTITY_VERIFICATION_NOT_FOUND } from "@/api/verification/types";
import AdultEmblem from "@/components/adult/AdultEmblem";
import Button from "@/components/ui/Button";
import { toSafeReturnPath } from "@/lib/safePath";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * 포트원이 ?identityVerificationId=..(실패면 code·message 도) 를 붙여 돌려보낸다. 성공 여부는 쿼리를 믿지 않고
 * 서버 확정 결과로 정한다.
 */
const IdentityVerificationCompleteContents = () => {
  const t = useTranslations("adultVerification.modal");
  const devT = useTranslations("adultVerification.dev");
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationId = searchParams.get("identityVerificationId") ?? "";
  const isFailed = !verificationId || searchParams.get("code") !== null;
  const isIdentityOnly = searchParams.get("purpose") === "identity";
  const returnTo = toSafeReturnPath(searchParams.get("returnTo"));
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn && state.isAuthReady);

  const { mutate: confirm, data: result, error } = useConfirmIdentityVerificationMutation();
  const requested = useRef(false);

  useEffect(() => {
    if (isFailed || !isLoggedIn || requested.current) return;
    requested.current = true;
    confirm(verificationId);
  }, [confirm, isFailed, isLoggedIn, verificationId]);

  const errorMessage =
    isFailed || error
      ? error?.code === IDENTITY_VERIFICATION_NOT_FOUND
        ? t("errorExpired")
        : t("errorDefault")
      : null;
  const isPending = !errorMessage && !result;
  const title = result
    ? isIdentityOnly
      ? t("identity.doneTitle")
      : result.adult
        ? t("adultDoneTitle")
        : t("identityOnlyTitle")
    : null;

  return (
    <section className="flex w-full justify-center px-5 py-8 sm:py-14">
      <div
        className="flex w-full max-w-110 flex-col items-center gap-2 rounded-3xl border border-main bg-dark px-5 py-10 text-center"
        role="status"
        aria-busy={isPending}
      >
        {isPending ? (
          <div className="skeleton size-24 rounded-full" aria-hidden="true" />
        ) : (
          <AdultEmblem
            size="md"
            mark={isIdentityOnly ? "identity" : "adult"}
            badge={errorMessage || (!isIdentityOnly && result?.adult === false) ? "warn" : "done"}
          />
        )}
        {title && <p className="title-2 mt-2 text-font-0">{title}</p>}
        {errorMessage && <p className="body-4 mt-2 text-font-error">{errorMessage}</p>}
        {!isPending && (
          <Button size="lg" fullWidth className="mt-6" onClick={() => router.replace(returnTo)}>
            {devT("backToApp")}
          </Button>
        )}
      </div>
    </section>
  );
};

export default IdentityVerificationCompleteContents;
