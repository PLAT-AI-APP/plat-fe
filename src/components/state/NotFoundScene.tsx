import type { ReactNode } from "react";

/**
 * 404 — 가운데 0 자리에 캐릭터 얼굴이 들어가 두리번거린다.
 * 숫자는 장식이고, 읽히는 내용은 제목·설명이 맡는다.
 */
const RoundFace = () => (
  <span className="relative inline-flex flex-col items-center">
    <svg viewBox="0 0 120 120" className="scene-bob size-[1em]" aria-hidden>
      <circle cx="60" cy="60" r="58" fill="var(--mascot-halo)" />
      <circle cx="60" cy="62" r="50" fill="var(--mascot-body)" />
      <g className="scene-peer">
        <circle className="scene-blink" cx="47" cy="58" r="5.5" fill="var(--mascot-face)" />
        <circle className="scene-blink" cx="77" cy="50" r="5.5" fill="var(--mascot-face)" />
        <path d="M55 71 L73 67 Q74 80 64 81 Q56 81 55 71 Z" fill="var(--mascot-face)" />
      </g>
    </svg>
    <span
      aria-hidden
      className="scene-shadow -mt-[0.04em] h-[0.06em] w-[0.6em] rounded-full bg-mascot-halo"
    />
  </span>
);

interface NotFoundSceneProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const NotFoundScene = ({ title, description, actions }: NotFoundSceneProps) => (
  <div className="flex w-full flex-col items-center justify-center px-6 py-12 text-center">
    <p
      aria-hidden
      className="flex items-center gap-[0.06em] text-[112px] leading-none font-extrabold tracking-tight text-brand tabular-nums sm:text-[144px]"
    >
      <span>4</span>
      <RoundFace />
      <span>4</span>
    </p>
    <h1 className="heading-2 scene-rise mt-8 text-font-0 text-balance break-keep">
      {title}
    </h1>
    {description && (
      <p
        className="body-4 scene-rise mt-3 max-w-90 text-font-2 break-keep"
        style={{ animationDelay: "0.08s" }}
      >
        {description}
      </p>
    )}
    {actions && (
      <div
        className="scene-rise mt-8 flex w-full max-w-80 flex-col gap-2.5"
        style={{ animationDelay: "0.16s" }}
      >
        {actions}
      </div>
    )}
  </div>
);

export default NotFoundScene;
