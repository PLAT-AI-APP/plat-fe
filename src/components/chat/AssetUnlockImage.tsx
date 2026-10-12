"use client";

import { AnimatePresence, m } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";
import Sparkles from "@/components/motion/Sparkles";
import { EASE_OUT } from "@/constants/motion";
import { UnlockLine } from "@/icons";

/**
 * 대화 중 처음 해금된 에셋이 나올 때의 연출(차분한 쪽으로 다듬은 안).
 *
 * locked   흐린 그림 위 자물쇠
 * nudge    자물쇠가 작게 두 번 까딱
 * open     고리가 살짝 들리며 열리고 주황으로 물든다
 * revealed 자물쇠가 위로 사라지고 흐림이 천천히 걷힌다 → 옅은 광택, "새 에셋" 칩
 * done     칩이 사라지고 그림만 남는다
 */
type Phase = "locked" | "nudge" | "open" | "revealed" | "done";

const PHASE_AT: Record<Exclude<Phase, "locked">, number> = {
  nudge: 500,
  open: 1150,
  revealed: 1600,
  done: 5200,
};
/** 이만큼 지나면 연출이 다 끝난 것으로 보고 그냥 그린다 */
const TOTAL_MS = PHASE_AT.done;

/**
 * 연출을 시작한 시각(에셋 파일 id → ms).
 * 답을 다 받으면 임시 말풍선이 서버 메시지로 바뀌며 컴포넌트가 새로 그려진다. 그때 처음부터
 * 다시 틀거나 끊기지 않도록 시작 시각을 모듈에 두고 이어서 재생한다.
 */
const unlockStartedAt = new Map<string, number>();

const phaseAt = (elapsed: number): Phase => {
  if (elapsed >= PHASE_AT.done) return "done";
  if (elapsed >= PHASE_AT.revealed) return "revealed";
  if (elapsed >= PHASE_AT.open) return "open";
  if (elapsed >= PHASE_AT.nudge) return "nudge";
  return "locked";
};

/** 몸통과 고리를 따로 움직이는 자물쇠 */
const Padlock = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="size-7 overflow-visible"
    fill="none"
    aria-hidden
  >
    <m.path
      d="M8.25 10.5V7.25a3.75 3.75 0 0 1 7.5 0v3.25"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      // 오른쪽 다리를 축으로 살짝 들렸다가 조금만 젖혀진다
      style={{ originX: 1, originY: 1 }}
      initial={false}
      animate={open ? { y: -2.5, rotate: -24 } : { y: 0, rotate: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    />
    <rect
      x="4.75"
      y="10.5"
      width="14.5"
      height="10.25"
      rx="2.4"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M12 14.4v2.4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

interface AssetUnlockImageProps {
  /** 에셋 파일 id. 같은 에셋의 연출을 이어 붙이는 열쇠다. */
  code: string;
  /** 이번 답에서 처음 풀린 에셋인지. 아니면 그림만 그린다. */
  isNewUnlock: boolean;
  /** 실제 그림(next/image). 크기는 그림이 정한다. */
  children: ReactNode;
}

const AssetUnlockImage = ({
  code,
  isNewUnlock,
  children,
}: AssetUnlockImageProps) => {
  const t = useTranslations("chatUI");
  // 처음 그릴 때 한 번만 정한다 — 연출 중인지, 어디까지 왔는지
  const [startedAt] = useState(() => {
    const known = unlockStartedAt.get(code);
    if (known !== undefined) return known;
    if (!isNewUnlock) return null;
    const now = Date.now();
    unlockStartedAt.set(code, now);
    return now;
  });
  const [phase, setPhase] = useState<Phase>(() =>
    startedAt === null ? "revealed" : phaseAt(Date.now() - startedAt),
  );
  const [isFinished] = useState(
    () => startedAt === null || Date.now() - startedAt > TOTAL_MS,
  );

  useEffect(() => {
    if (startedAt === null || isFinished) return;
    const elapsed = Date.now() - startedAt;
    const timers = (
      Object.entries(PHASE_AT) as [Exclude<Phase, "locked">, number][]
    )
      .filter(([, at]) => at > elapsed)
      .map(([next, at]) => setTimeout(() => setPhase(next), at - elapsed));
    return () => timers.forEach(clearTimeout);
  }, [startedAt, isFinished]);

  if (isFinished) return <>{children}</>;

  const revealed = phase === "revealed" || phase === "done";
  const opened = phase === "open" || revealed;

  return (
    <div className="mx-auto flex w-fit flex-col items-center gap-3">
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl">
          <m.div
            initial={false}
            animate={
              revealed
                ? { filter: "blur(0px) saturate(1)", scale: 1 }
                : { filter: "blur(16px) saturate(0.5)", scale: 1.08 }
            }
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            {children}
          </m.div>
          <m.div
            aria-hidden
            className="absolute inset-0 bg-scrim/45"
            initial={false}
            animate={{ opacity: revealed ? 0 : 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          />

          <AnimatePresence>
            {!revealed && (
              <m.div
                className="absolute inset-0 flex items-center justify-center"
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <m.span
                  className="flex size-14 items-center justify-center rounded-full bg-dark/75 backdrop-blur"
                  animate={
                    phase === "nudge"
                      ? { rotate: [0, -8, 7, -4, 0] }
                      : opened
                        ? { scale: [1, 1.08, 1.04] }
                        : {}
                  }
                  transition={{
                    duration: phase === "nudge" ? 0.55 : 0.35,
                    ease: "easeInOut",
                  }}
                >
                  <span
                    className={
                      opened
                        ? "text-brand transition-colors duration-300"
                        : "text-font-1"
                    }
                  >
                    <Padlock open={opened} />
                  </span>
                </m.span>
              </m.div>
            )}
          </AnimatePresence>

          {revealed && (
            <>
              {/* 걷힌 뒤 옅은 광택이 한 번 */}
              <m.div
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "0%" }}
                animate={{ x: "400%" }}
                transition={{ delay: 0.5, duration: 1.1, ease: "easeInOut" }}
              />
              {/* 얇은 테두리 빛이 천천히 사라진다 */}
              <m.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-brand ring-inset"
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 1.4 }}
              />
            </>
          )}
        </div>
        {revealed && (
          <Sparkles
            repeat={false}
            className="-inset-5"
            spots={[
              { top: "4%", left: "88%", size: 14, delay: 0.6 },
              { top: "86%", left: "0%", size: 10, delay: 0.8 },
            ]}
          />
        )}
      </div>

      <AnimatePresence>
        {phase === "revealed" && (
          <m.span
            role="status"
            className="body-6 flex items-center gap-1.5 rounded-full bg-brand-opacity px-3 py-1.5 text-brand-dark"
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.7, duration: 0.45, ease: EASE_OUT },
            }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <UnlockLine className="size-4" />
            {t("assetUnlocked")}
          </m.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetUnlockImage;
