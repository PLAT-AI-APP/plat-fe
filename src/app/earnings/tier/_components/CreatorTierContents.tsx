"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { m } from "framer-motion";
import Button from "@/components/ui/Button";
import { QueryStateBoundary } from "@/components/state";
import { cn } from "@/lib/utils";
import { isDevToolsEnabledFor } from "@/constants/identityVerification";
import { useCreatorTierQuery } from "@/api/earning/getCreatorTier";
import {
  useInvalidateEarning,
  useTierPromotionMutation,
} from "@/api/earning/postTierPromotion";
import { useTierCelebrationAckMutation } from "@/api/earning/postTierCelebrationAck";
import type { CreatorTierStatus } from "@/type/earning";
import TierPromotionCelebration from "./TierPromotionCelebration";
import {
  LADDER,
  benefitLinesOf,
  bpsToPercent,
  formatCount,
  meetsTier,
  toOrigin,
  toTier,
  type CreatorStats,
  type Tier,
} from "./tiers";

/** 등급 색은 뱃지와 카드 뒤 은은한 빛에만 쓴다. 글자·막대·버튼은 앱 기본 색을 따른다. */

const TierBadge = ({
  tier,
  size,
  dim,
}: {
  tier: Tier;
  size: number;
  dim?: boolean;
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={tier.badge}
    alt=""
    width={size}
    height={size}
    className={cn(
      "shrink-0 transition-[filter,opacity]",
      dim && "opacity-35 grayscale",
    )}
  />
);

/** 카드 뒤에 등급 색을 아주 옅게 깐다. */
const tierGlow = (tier: Tier, at = "12% 20%") => ({
  backgroundImage: `radial-gradient(90% 140% at ${at}, ${tier.color}26, transparent 60%)`,
});

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 12 12" className={className ?? "size-2.5"} aria-hidden>
    <path
      d="M2.5 6.2 5 8.6l4.5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
    <rect x="2.5" y="5.5" width="7" height="5" rx="1.2" fill="currentColor" />
    <path
      d="M4 5.5V4a2 2 0 0 1 4 0v1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    />
  </svg>
);

/** 개발 서버(로컬·dev)에서만 등급별 승급 연출 미리보기 버튼을 연다. 운영 빌드·운영 호스트에서는 닫힌다. */
const subscribeNothing = () => () => {};
const useDevTools = () =>
  useSyncExternalStore(
    subscribeNothing,
    () => isDevToolsEnabledFor(window.location.host),
    () => false,
  );

const formatDay = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));

/* ───────── 등급 슬라이더: 내 등급 상자를 그대로 두고 좌우로 넘겨 다른 등급을 본다 ───────── */

interface TierSliderProps {
  tiers: Tier[];
  tierIndex: number;
  viewIndex: number;
  onView: (index: number) => void;
}

const TierSlider = ({
  tiers,
  tierIndex,
  viewIndex,
  onView,
}: TierSliderProps) => {
  const t = useTranslations("earnings.tier");
  const locale = useLocale();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // 화살표로 넘길 때는 지나가는 카드마다 보고 있는 등급이 바뀌며 깜빡이지 않도록
  // 스크롤이 멈출 때까지 스크롤 위치로 판정하지 않는다.
  const jumpingRef = useRef(false);
  const jumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTo = (index: number, smooth = true) => {
    const scroller = scrollerRef.current;
    const card = cardRefs.current[index];
    if (!scroller || !card) return;
    scroller.scrollTo({
      left: card.offsetLeft - (scroller.clientWidth - card.clientWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // 처음 열 때와 승급했을 때 내 등급을 가운데로
  useEffect(() => {
    scrollTo(Math.max(tierIndex, 0), false);
  }, [tierIndex]);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (jumpingRef.current) {
      // 스크롤 이벤트가 끊기면 이동이 끝난 것으로 본다.
      if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
      jumpTimerRef.current = setTimeout(() => {
        jumpingRef.current = false;
      }, 120);
      return;
    }
    const middle = scroller.scrollLeft + scroller.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const distance = Math.abs(
        card.offsetLeft + card.clientWidth / 2 - middle,
      );
      if (distance < best) {
        best = distance;
        nearest = index;
      }
    });
    if (nearest !== viewIndex) onView(nearest);
  };

  const go = (index: number) => {
    const next = Math.min(Math.max(index, 0), tiers.length - 1);
    if (next === viewIndex) return;
    jumpingRef.current = true;
    onView(next);
    scrollTo(next);
  };

  return (
    <div className="relative -mx-1">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-[7%] py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tiers.map((tier, index) => {
          const isCurrent = index === tierIndex;
          const locked = index > tierIndex;
          const isViewed = index === viewIndex;
          const steps = index - tierIndex;
          return (
            <div
              key={tier.code}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => !isViewed && go(index)}
              className={cn(
                "flex w-[86%] shrink-0 snap-center items-center gap-4 rounded-3xl border bg-darker p-5 transition-[opacity,transform,border-color] duration-300",
                isCurrent ? "border-main" : "border-main/60",
                !isViewed && "cursor-pointer scale-[0.96] opacity-50",
              )}
              style={locked ? undefined : tierGlow(tier)}
            >
              <TierBadge tier={tier} size={64} dim={locked} />
              <div className="flex min-w-0 flex-col gap-1">
                <span className="body-6 flex items-center gap-1.5 text-font-2">
                  {isCurrent && t("myTier")}
                  {index < tierIndex && (
                    <>
                      <CheckIcon className="size-3" /> {t("achieved")}
                    </>
                  )}
                  {locked && (
                    <>
                      <LockIcon />{" "}
                      {steps === 1
                        ? t("nextTier")
                        : t("stepsAbove", { count: steps })}
                    </>
                  )}
                </span>
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className={cn("title-1", locked && "text-font-2")}>
                    {tier.name}
                  </span>
                  {!locked && tier.achievedAt && (
                    <span className="body-7 shrink-0 tabular-nums text-font-2">
                      {t("achievedOn", {
                        date: formatDay(tier.achievedAt, locale),
                      })}
                    </span>
                  )}
                </span>
                {/* 수익률·부스트는 아래 혜택 목록에 있으니 카드에는 잠긴 등급의 조건만 적는다. */}
                {locked && (
                  <span className="body-6 truncate text-font-2">
                    {t("conditions", {
                      characters: formatCount(tier.publicCharacters, locale),
                      chats: formatCount(tier.paidChats, locale),
                      followers: formatCount(tier.followers, locale),
                    })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 넓은 화면용 넘기기 버튼 */}
      {[-1, 1].map((dir) => {
        const disabled =
          dir < 0 ? viewIndex === 0 : viewIndex === tiers.length - 1;
        return (
          <button
            key={dir}
            type="button"
            aria-label={dir < 0 ? t("prevTierAria") : t("nextTierAria")}
            disabled={disabled}
            onClick={() => go(viewIndex + dir)}
            className={cn(
              "absolute top-1/2 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-main bg-dark text-font-1 shadow-popover transition-opacity sm:flex",
              dir < 0 ? "left-0" : "right-0",
              disabled && "pointer-events-none opacity-0",
            )}
          >
            <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
              <path
                d={dir < 0 ? "M7.5 2.5 4 6l3.5 3.5" : "M4.5 2.5 8 6l-3.5 3.5"}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

/* ───────── 혜택: 한 줄 목록. 모든 등급에서 같은 순서라, 등급을 넘기면 같은 줄의 값이 바뀌고
   위 등급에서 생기는 혜택은 아래에 이어 붙는다. ───────── */

const BenefitList = ({
  tiers,
  tierIndex,
  viewIndex,
}: {
  tiers: Tier[];
  tierIndex: number;
  viewIndex: number;
}) => {
  const t = useTranslations("earnings.tier");
  const labels = {
    rate: t("rate"),
    boost: t("boost"),
    holdLabel: t("holdLabel"),
    hold: (days: number) => t("holdDays", { days }),
    giftLabel: t("giftLabel"),
    gift: (count: number) => t("giftCount", { count: count.toLocaleString() }),
  };
  const tier = tiers[viewIndex];
  const locked = viewIndex > tierIndex;
  const lines = benefitLinesOf(tier, labels);
  // 바로 아래 등급과 비교해 달라진 값은 이전 값을 왼쪽에 함께 보여 준다. 첫 등급은 비교하지 않는다.
  const previous =
    viewIndex > 0 ? benefitLinesOf(tiers[viewIndex - 1], labels) : null;
  const previousValue = (key: string, value: string) =>
    previous ? previous.find((line) => line.key === key)?.value : value;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="title-3 flex items-center gap-2">
        {viewIndex === tierIndex
          ? t("myBenefits")
          : t("tierBenefits", { name: tier.name })}
        {locked && (
          <span className="body-8 flex items-center gap-1 rounded-full bg-font-1/[0.06] px-2 py-0.5 text-font-2">
            <LockIcon /> {t("afterPromotion")}
          </span>
        )}
      </h2>
      <ul className="flex flex-col rounded-3xl border border-main bg-darker px-5 py-1">
        {lines.map((line) => {
          const before = previousValue(line.key, line.value);
          const isNew = before === undefined;
          return (
            <li
              key={line.key}
              className="body-5 flex items-center justify-between gap-3 border-b border-main/60 py-3 last:border-b-0"
            >
              <span className="text-font-2">{line.label}</span>
              <span className="flex items-center gap-2 tabular-nums">
                {!isNew && before !== line.value && (
                  <>
                    <span className="body-5 text-font-2">{before}</span>
                    <span className="body-7 text-font-2">→</span>
                  </>
                )}
                <span
                  className={cn(
                    "title-5",
                    isNew ? "text-brand" : "text-font-1",
                  )}
                >
                  {line.value}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

/* ───────── 다음 등급까지의 진행 ───────── */

interface MetricProps {
  label: string;
  format: (value: string) => string;
  current: number;
  target: number;
  index: number;
}

const Metric = ({ label, format, current, target, index }: MetricProps) => {
  const t = useTranslations("earnings.tier");
  const locale = useLocale();
  const done = current >= target;
  const ratio = target > 0 ? Math.min(current / target, 1) : 1;
  return (
    <li className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="body-5 flex items-center gap-2">
          <span
            className={cn(
              "flex size-4 items-center justify-center rounded-full transition-colors",
              done ? "bg-brand text-on-brand" : "border border-main",
            )}
          >
            {done && <CheckIcon />}
          </span>
          <span className={done ? "text-font-1" : "text-font-2"}>{label}</span>
        </span>
        <span className="body-6 tabular-nums">
          {done ? (
            <span className="text-font-2">
              {t("metricAchieved", {
                target: format(formatCount(target, locale)),
              })}
            </span>
          ) : (
            <>
              <span className="text-font-1">
                {formatCount(current, locale)}
              </span>
              <span className="text-font-2">
                {t("progressOf", {
                  target: format(formatCount(target, locale)),
                })}
              </span>
            </>
          )}
        </span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-font-1/[0.08]">
        <m.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            !done && "bg-font-2/60",
          )}
          style={
            done
              ? {
                  background: "linear-gradient(90deg,var(--brand),#FFB547)",
                  boxShadow: "0 0 12px rgba(255,122,0,.45)",
                }
              : undefined
          }
          initial={{ width: 0 }}
          animate={{ width: `${ratio * 100}%` }}
          transition={{
            duration: 0.9,
            delay: 0.15 + index * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </li>
  );
};

interface Celebration {
  from: Tier | null;
  to: Tier;
  giftNotes: number;
  /** 미리보기·관리자가 올린 등급의 연출. 닫을 때 동작이 다르다. */
  kind: "promotion" | "preview" | "pending";
}

const TierBody = ({ data }: { data: CreatorTierStatus }) => {
  const t = useTranslations("earnings.tier");
  const devTools = useDevTools();
  const invalidate = useInvalidateEarning();
  const promotion = useTierPromotionMutation();
  const ack = useTierCelebrationAckMutation();

  const ladder = useMemo(
    () =>
      LADDER.map((code) => data.tiers.find((tier) => tier.code === code))
        .filter((info) => info !== undefined)
        .map((info) => toTier(info, t(`names.${info.code}`))),
    [data.tiers, t],
  );
  const origin = useMemo(
    () => toOrigin(ladder[ladder.length - 1], t("names.ORIGIN")),
    [ladder, t],
  );
  const isOrigin = data.currentTier === "ORIGIN";
  /** 오리진이면 사다리 끝에 오리진 카드를 붙여 그 위치를 내 등급으로 보여 준다. */
  const sliderTiers = useMemo(
    () => (isOrigin ? [...ladder, origin] : ladder),
    [isOrigin, ladder, origin],
  );
  /** 슬라이더에서 내 위치. 등급이 없으면 -1. */
  const tierIndex = sliderTiers.findIndex(
    (tier) => tier.code === data.currentTier,
  );
  const [viewIndex, setViewIndex] = useState(Math.max(tierIndex, 0));
  const [celebration, setCelebration] = useState<Celebration | null>(() =>
    data.celebration
      ? {
          from:
            ladder.find((tier) => tier.code === data.celebration?.from) ?? null,
          to: sliderTiers[Math.max(tierIndex, 0)],
          giftNotes: data.celebration.giftNotes,
          kind: "pending",
        }
      : null,
  );

  const stats: CreatorStats = {
    publicCharacters: data.publicUniverses,
    paidChats: data.paidTurns,
    followers: data.followers,
  };
  const current = tierIndex >= 0 ? sliderTiers[tierIndex] : null;
  const next = isOrigin ? null : (ladder[tierIndex + 1] ?? null);
  const canPromote = data.canPromote && next !== null && meetsTier(stats, next);

  const handlePromote = () => {
    if (!next || !canPromote) return;
    promotion.mutate(undefined, {
      onSuccess: (result) =>
        setCelebration({
          from: current,
          to: ladder.find((tier) => tier.code === result.to) ?? next,
          giftNotes: result.giftNotes,
          kind: "promotion",
        }),
    });
  };

  const handleCelebrationDone = () => {
    if (celebration?.kind === "pending") ack.mutate();
    if (celebration?.kind !== "preview") {
      invalidate();
      setViewIndex(Math.min(tierIndex + 1, sliderTiers.length - 1));
    }
    setCelebration(null);
  };

  const units = {
    characters: (value: string) => t("unitCharacters", { value }),
    chats: (value: string) => t("unitChats", { value }),
    followers: (value: string) => t("unitFollowers", { value }),
  };

  return (
    <div className="flex flex-col gap-8">
      {devTools && (
        <div className="flex flex-wrap gap-2">
          {[...ladder, origin].map((tier, index) => (
            <Button
              key={tier.code}
              size="md"
              variant="secondary"
              onClick={() =>
                setCelebration({
                  from: tier.official
                    ? ladder[ladder.length - 1]
                    : (ladder[index - 1] ?? null),
                  to: tier,
                  giftNotes: tier.giftNotes,
                  kind: "preview",
                })
              }
            >
              {t("preview", { name: tier.name })}
            </Button>
          ))}
        </div>
      )}

      <TierSlider
        tiers={sliderTiers}
        tierIndex={tierIndex}
        viewIndex={viewIndex}
        onView={setViewIndex}
      />

      <BenefitList
        tiers={sliderTiers}
        tierIndex={tierIndex}
        viewIndex={viewIndex}
      />

      {next ? (
        <section className="flex flex-col gap-5 rounded-3xl border border-main bg-darker p-5">
          <div className="flex items-center gap-3">
            <TierBadge tier={next} size={36} />
            <div className="flex min-w-0 flex-col">
              <span className="body-7 text-font-2">{t("toNext")}</span>
              <h2 className="title-3">{next.name}</h2>
            </div>
          </div>

          <ul className="flex flex-col gap-4">
            <Metric
              index={0}
              label={t("publicCharacters")}
              format={units.characters}
              current={stats.publicCharacters}
              target={next.publicCharacters}
            />
            <Metric
              index={1}
              label={t("paidChats")}
              format={units.chats}
              current={stats.paidChats}
              target={next.paidChats}
            />
            <Metric
              index={2}
              label={t("followers")}
              format={units.followers}
              current={stats.followers}
              target={next.followers}
            />
          </ul>

          <Button
            size="lg"
            fullWidth
            disabled={!canPromote || promotion.isPending}
            isPending={promotion.isPending}
            onClick={handlePromote}
          >
            {data.locked
              ? t("locked")
              : canPromote
                ? t("promote", { name: next.name })
                : t("notEligible")}
          </Button>
        </section>
      ) : (
        <div className="body-5 rounded-3xl border border-main bg-darker p-5 text-font-2">
          {isOrigin ? t("official") : t("max")}
        </div>
      )}

      {celebration && (
        <TierPromotionCelebration
          key={`${celebration.kind}-${celebration.to.code}`}
          from={celebration.from}
          to={celebration.to}
          giftNotes={celebration.giftNotes}
          baseRate={bpsToPercent(data.baseShareBps)}
          ladderIndex={LADDER.indexOf(
            celebration.to.code as (typeof LADDER)[number],
          )}
          onClose={handleCelebrationDone}
        />
      )}
    </div>
  );
};

const TierSkeleton = () => (
  <div className="flex flex-col gap-8">
    <div className="h-28 animate-pulse rounded-3xl border border-main bg-darker" />
    <div className="h-64 animate-pulse rounded-3xl border border-main bg-darker" />
  </div>
);

/** 내 등급 슬라이더, 혜택, 다음 등급까지의 진행과 승급 신청. */
const CreatorTierContents = () => {
  const t = useTranslations("earnings.tier");
  const { data, isPending, isError, error, refetch } = useCreatorTierQuery();

  return (
    <section className="mx-auto mb-10 flex w-full max-w-160 flex-col gap-8 pt-5">
      <h1 className="heading-2">{t("title")}</h1>
      <QueryStateBoundary
        isPending={isPending}
        isError={isError}
        error={error}
        onRetry={refetch}
        pendingFallback={<TierSkeleton />}
      >
        {data && <TierBody data={data} />}
      </QueryStateBoundary>
    </section>
  );
};

export default CreatorTierContents;
