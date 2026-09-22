import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import EmptyMascot, { type MascotMood } from "./EmptyMascot";

interface StateSceneProps {
  mood: MascotMood;
  title: string;
  description?: string;
  /** 제목 아래 버튼 자리 */
  actions?: ReactNode;
  className?: string;
}

/**
 * 캐릭터 + 제목 + 설명 + 버튼으로 된 한 화면짜리 안내.
 *
 * 빈 목록(EmptyState)보다 무게가 큰 자리 — 잘못된 접근, 권한 없음처럼 "여기서
 * 더 할 게 없으니 다른 데로 가야 하는" 순간에 쓴다. 문구는 문자열로 받는다.
 * 번역 Provider 가 없는 전역 오류 화면에서도 쓸 수 있게 하기 위해서다.
 */
const StateScene = ({
  mood,
  title,
  description,
  actions,
  className,
}: StateSceneProps) => (
  <div
    className={cn(
      "flex w-full flex-col items-center justify-center px-6 py-12 text-center",
      className,
    )}
  >
    <EmptyMascot
      mood={mood}
      className="w-72 max-w-full [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]"
    />
    <h1 className="heading-2 scene-rise mt-4 text-font-0 text-balance break-keep">
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

export default StateScene;
