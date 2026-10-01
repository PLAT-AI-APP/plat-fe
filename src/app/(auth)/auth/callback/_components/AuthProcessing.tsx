"use client";

import React, { type CSSProperties, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import AppIcon from "@/icons/AppIcon";
import { Google, Kakao } from "@/icons";
import { cn } from "@/lib/utils";

export type SocialProvider = "kakao" | "google";

/**
 * 연결 연출을 최소한 보여 주는 시간. 응답이 빠르면 화면이 번쩍이고 바로 넘어가 어색하다.
 * 성공이면 이만큼 채운 뒤 이동하고, 실패면 이만큼 이어지다 끊긴다.
 */
export const MIN_PROCESSING_MS = 1000;

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
        <circle
          cx="12"
          cy="8.5"
          r="3.5"
          stroke="currentColor"
          strokeWidth="2"
        />
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

const FLOW_DOTS = [0, 1, 2, 3, 4];
/** 끊길 때 각 점이 물러나는 거리. 가운데를 비워 X 자리를 만든다. */
const SNAP_OFFSETS = ["-6px", "-10px", "0px", "10px", "6px"];

/**
 * 소셜 계정 → 점 → PLAT. "두 곳을 잇고 있다"는 걸 가장 곧게 보여준다.
 * 실패하면 흐르던 점이 양쪽으로 물러나고, 가운데에 X 가 뜨고, 소셜 뱃지는 고개를 젓고, PLAT 은 빛을 잃는다.
 */
const Bridge = ({
  provider,
  failed,
}: {
  provider: SocialProvider | null;
  failed: boolean;
}) => (
  <div className="flex items-center gap-3" aria-hidden>
    <ProviderBadge
      provider={provider}
      large
      className={cn("size-16", failed ? "scene-shake" : "scene-float")}
    />
    <div className="relative flex items-center gap-2 px-1">
      {FLOW_DOTS.map((index) => (
        <span
          key={index}
          className={cn(
            "size-2 rounded-full",
            failed
              ? cn("scene-snap bg-font-disabled", index === 2 && "invisible")
              : "scene-flow bg-brand",
          )}
          style={
            failed
              ? ({ "--snap-x": SNAP_OFFSETS[index] } as CSSProperties)
              : { animationDelay: `${index * 0.15}s` }
          }
        />
      ))}
      {failed && (
        // 꽉 찬 빨강은 화면에서 너무 튄다. 어두운 원에 옅은 빨강 테두리를 두르고, X 는 가는 획으로 그려 넣는다.
        <span className="scene-pop scene-halo absolute top-1/2 left-1/2 -mt-4 -ml-4 flex size-8 items-center justify-center rounded-full border border-danger/30 bg-card text-danger shadow-card">
          <span className="absolute inset-0 rounded-full bg-danger-bg" />
          <svg viewBox="0 0 24 24" className="relative size-3.5" fill="none">
            <path
              d="M7 7l10 10"
              className="scene-draw"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M17 7L7 17"
              className="scene-draw"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ animationDelay: "0.82s" }}
            />
          </svg>
        </span>
      )}
    </div>
    <span
      className={cn(
        // 시안은 각진 정사각형이라 모서리는 여기서 깎는다. 바탕이 화면색과 비슷해 테두리로 윤곽을 잡는다.
        "flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-main shadow-card",
        failed ? "scene-dim" : "scene-glow",
      )}
    >
      <AppIcon className="size-16" />
    </span>
  </div>
);

interface AuthProcessingProps {
  provider?: SocialProvider | null;
  /** 있으면 연결이 끊기는 실패 연출로 바꾸고 사유와 버튼을 보여 준다 */
  failure?: {
    /** 사용자에게 보여 줄 사유. 텍스트로만 그린다. */
    reason: string;
    actions: ReactNode;
  };
}

/** 소셜 로그인 콜백 화면. 토큰을 받는 동안 두 곳을 잇는 연출을, 실패하면 그 연결이 끊기는 연출을 보여 준다. */
const AuthProcessing = ({ provider = null, failure }: AuthProcessingProps) => {
  const t = useTranslations("auth.callback");
  const failed = failure !== undefined;
  const title = failed
    ? provider
      ? t("failedTitleWith", { provider: t(provider) })
      : t("failedTitle")
    : provider
      ? t("titleWith", { provider: t(provider) })
      : t("title");

  return (
    <div
      role={failed ? "alert" : "status"}
      aria-live={failed ? "assertive" : "polite"}
      className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
    >
      {/* 화면 전체로 번지는 배경 빛. 가운데가 가장 밝고 가장자리로 갈수록 바탕색에 녹는다. 실패하면 거둔다. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_42%_at_50%_45%,var(--brand-opacity)_0%,var(--brand-opacity-3)_45%,transparent_80%)] transition-opacity duration-700",
          failed && "opacity-0",
        )}
      />

      <div className="relative flex w-full flex-col items-center">
        <Bridge provider={provider} failed={failed} />

        <h1
          // 진행 중 → 실패로 바뀔 때 제목이 다시 떠오르도록 key 를 나눈다.
          key={failed ? "failed" : "pending"}
          className="heading-2 scene-rise mt-10 text-font-0 text-balance break-keep"
          style={{ animationDelay: failed ? "0.25s" : "0.1s" }}
        >
          {title}
          {!failed && (
            <span aria-hidden className="ml-1.5 inline-flex gap-1 align-middle">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className="scene-dot size-1.5 rounded-full bg-brand"
                  style={{ animationDelay: `${index * 0.15}s` }}
                />
              ))}
            </span>
          )}
        </h1>
        <p
          key={failed ? "failed-hint" : "pending-hint"}
          className="body-4 scene-rise mt-3 max-w-80 text-font-2 break-keep"
          style={{ animationDelay: failed ? "0.35s" : "0.2s" }}
        >
          {failed ? failure.reason.trim() || t("failedHint") : t("hint")}
        </p>

        {/*
         * 버튼 자리는 진행 중에도 높이 0 으로 둔다. 화면이 세로 가운데 정렬이라 실패할 때 버튼이 한 번에
         * 생기면 연출 전체가 위로 뚝 튄다. 높이를 천천히 늘려 연출이 미끄러지듯 올라가게 한다.
         */}
        <div
          className={cn(
            "grid w-full max-w-80 transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            failed ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="-mx-1 min-h-0 overflow-hidden px-1 pb-1">
            {failed && (
              <div
                className="scene-rise flex flex-col gap-2.5 pt-8"
                style={{ animationDelay: "0.45s" }}
              >
                {failure.actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthProcessing;
