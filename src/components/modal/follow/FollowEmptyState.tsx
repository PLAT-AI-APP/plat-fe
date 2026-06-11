import React from "react";
import { FollowTab } from "./constants";

interface FollowEmptyStateProps {
  activeTab: FollowTab;
  isOwnProfile: boolean;
  nickname: string;
  onCreateCharacter: () => void;
  onExploreCharacter: () => void;
  onFollow: () => void;
}

type ProfileScope = "own" | "other";
type EmptyAction = "createCharacter" | "exploreCharacter" | "follow";

interface OwnEmptyState {
  variant: "own";
  lines: string[];
  highlight: string;
  suffix: string;
  buttonText: string;
  action: EmptyAction;
}

interface OtherEmptyState {
  variant: "other";
  lines: string[];
  title: string;
  buttonText: string;
  action: EmptyAction;
}

type EmptyState = OwnEmptyState | OtherEmptyState;

// 빈 상태는 "내 프로필/타인 프로필"과 "팔로워/팔로잉 탭" 조합으로 총 4개가 나옵니다.
// 문구와 CTA만 이 config에서 바꾸고, 아래 렌더링 로직은 디자인 variant만 보고 그립니다.
const EMPTY_STATE_BY_CONTEXT: Record<
  ProfileScope,
  Record<FollowTab, EmptyState>
> = {
  own: {
    followers: {
      variant: "own",
      lines: ["많은 유저들의 팔로우를 받을 수 있게"],
      highlight: "매력적인 캐릭터를 제작",
      suffix: "해 볼까요?",
      buttonText: "캐릭터 제작하기",
      action: "createCharacter",
    },
    following: {
      variant: "own",
      lines: ["관심 있는 크리에이터를 팔로우할 수 있게"],
      highlight: "취향에 맞는 캐릭터를 둘러",
      suffix: "볼까요?",
      buttonText: "캐릭터 둘러보기",
      action: "exploreCharacter",
    },
  },
  other: {
    followers: {
      variant: "other",
      lines: ["아직, {nickname}님이", "팔로우한 크리에이터가 없어요"],
      title: "내가 먼저 팔로우 걸어볼까요?",
      buttonText: "팔로우",
      action: "follow",
    },
    following: {
      variant: "other",
      lines: ["아직, {nickname}님을", "팔로잉한 유저가 없어요"],
      title: "내가 먼저 팔로우 걸어볼까요?",
      buttonText: "팔로우",
      action: "follow",
    },
  },
};

const FollowEmptyState = ({
  activeTab,
  isOwnProfile,
  nickname,
  onCreateCharacter,
  onExploreCharacter,
  onFollow,
}: FollowEmptyStateProps) => {
  const scope: ProfileScope = isOwnProfile ? "own" : "other";
  const state = EMPTY_STATE_BY_CONTEXT[scope][activeTab];
  const handleClick = {
    createCharacter: onCreateCharacter,
    exploreCharacter: onExploreCharacter,
    follow: onFollow,
  }[state.action];

  if (state.variant === "own") {
    return (
      <div className="flex min-h-95 items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
          <div className="body-2 text-font-1">
            {state.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>
              <strong className="font-bold">{state.highlight}</strong>
              {state.suffix}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClick}
            className="title-5 rounded-xl border border-brand-dark bg-brand-opacity px-8 py-3 text-brand-dark"
          >
            {state.buttonText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-95 items-center justify-center">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <p className="body-6 w-[228px] text-font-2">
            {state.lines.map((line) => (
              <React.Fragment key={line}>
                {line.replace("{nickname}", nickname)}
                <br />
              </React.Fragment>
            ))}
          </p>
          <p className="title-3 w-[228px] text-font-1">{state.title}</p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="title-5 rounded-xl bg-font-1 px-8 py-2 text-bg-dark"
        >
          {state.buttonText}
        </button>
      </div>
    </div>
  );
};

export default FollowEmptyState;
