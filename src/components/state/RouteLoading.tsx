"use client";

import { useTranslations } from "next-intl";
import EmptyMascot from "./EmptyMascot";

/**
 * 라우트 전환 중 잠깐 보이는 자리표시자.
 *
 * 이 앱은 데이터를 전부 클라이언트에서 받으므로 loading.tsx가 오래 머무르지 않는다.
 * 그래서 화면을 흉내 내는 대신, 콘텐츠가 들어올 자리의 높이만 잡고 가운데서
 * 캐릭터가 통통 튄다 — 어설픈 스켈레톤이 실제 화면과 어긋나면 오히려 레이아웃이
 * 튀어 보인다. 잠깐 보이는 자리라 문구는 화면 낭독기에만 준다.
 */
const RouteLoading = () => {
  const t = useTranslations("loading");

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      // 빠른 이동에서는 금방 사라지는데 바로 뜨면 마스코트가 한 번 번쩍인다. 스켈레톤처럼 300ms 뒤에 나타난다.
      className="delayed-appear flex min-h-[60vh] w-full flex-col items-center justify-center gap-3"
    >
      <span className="sr-only">{t("text")}</span>
      <EmptyMascot
        mood="hop"
        className="w-28 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]"
      />
      <span aria-hidden className="flex gap-1.5">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="scene-dot size-1.5 rounded-full bg-font-disabled"
            style={{ animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </span>
    </div>
  );
};

export default RouteLoading;
