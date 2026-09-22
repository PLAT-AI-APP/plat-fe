"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Logo from "@/icons/Logo";
import { Google, Kakao } from "@/icons";
import { cn } from "@/lib/utils";

export type SocialProvider = "kakao" | "google";

/** 소셜 계정 뱃지. 카카오·구글이 제시하는 배경색을 그대로 쓴다. */
const ProviderBadge = ({
  provider,
  large = false,
  className,
}: {
  provider: SocialProvider | null;
  /** 연결 시안처럼 뱃지가 큰 자리에서 안쪽 아이콘도 키운다 */
  large?: boolean;
  className?: string;
}) => (
  <span
    className={cn(
      "flex items-center justify-center rounded-2xl shadow-card",
      provider === "kakao" && "bg-[#FEE500]",
      provider === "google" && "bg-white",
      !provider && "bg-card text-font-2",
      className,
    )}
  >
    {provider === "kakao" && <Kakao className={large ? "size-10" : "size-7"} />}
    {provider === "google" && (
      <Google className={large ? "size-9" : "size-6"} />
    )}
    {!provider && (
      <svg
        viewBox="0 0 24 24"
        className={large ? "size-9" : "size-6"}
        fill="none"
        aria-hidden
      >
        <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M5 19c1.2-3.4 4-5 7-5s5.8 1.6 7 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )}
  </span>
);

/** 소셜 계정 → 점 → PLAT. "두 곳을 잇고 있다"는 걸 가장 곧게 보여준다. */
const Bridge = ({ provider }: { provider: SocialProvider | null }) => (
  <div className="flex items-center gap-3" aria-hidden>
    <ProviderBadge provider={provider} large className="size-16 scene-float" />
    <div className="flex items-center gap-2 px-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          className="scene-flow size-2 rounded-full bg-brand"
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ))}
    </div>
    <span className="scene-glow flex size-16 items-center justify-center rounded-2xl">
      <Logo className="size-16" />
    </span>
  </div>
);

interface AuthProcessingProps {
  provider?: SocialProvider | null;
}

/** 소셜 로그인 콜백에서 토큰을 받는 동안의 화면 */
const AuthProcessing = ({ provider = null }: AuthProcessingProps) => {
  const t = useTranslations("auth.callback");
  const title = provider
    ? t("titleWith", { provider: t(provider) })
    : t("title");

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
    >
      {/* 화면 전체로 번지는 배경 빛. 가운데가 가장 밝고 가장자리로 갈수록 바탕색에 녹는다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_42%_at_50%_45%,var(--brand-opacity)_0%,var(--brand-opacity-3)_45%,transparent_80%)]"
      />

      <div className="relative flex flex-col items-center">
        <Bridge provider={provider} />

        <h1
          className="heading-2 scene-rise mt-10 text-font-0 text-balance break-keep"
          style={{ animationDelay: "0.1s" }}
        >
          {title}
          <span aria-hidden className="ml-1.5 inline-flex gap-1 align-middle">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="scene-dot size-1.5 rounded-full bg-brand"
                style={{ animationDelay: `${index * 0.15}s` }}
              />
            ))}
          </span>
        </h1>
        <p
          className="body-4 scene-rise mt-3 max-w-80 text-font-2 break-keep"
          style={{ animationDelay: "0.2s" }}
        >
          {t("hint")}
        </p>
      </div>
    </div>
  );
};

export default AuthProcessing;
