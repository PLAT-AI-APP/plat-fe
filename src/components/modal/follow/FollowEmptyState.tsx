import React from "react";
import { useTranslations } from "next-intl";
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

const FollowEmptyState = ({
  activeTab,
  isOwnProfile,
  nickname,
  onCreateCharacter,
  onExploreCharacter,
  onFollow,
}: FollowEmptyStateProps) => {
  const t = useTranslations("modalUi.follow");
  const scope: ProfileScope = isOwnProfile ? "own" : "other";
  const emptyStateByContext: Record<
    ProfileScope,
    Record<FollowTab, EmptyState>
  > = {
    own: {
      followers: {
        variant: "own",
        lines: [t("ownFollowersLine1")],
        highlight: t("ownFollowersHighlight"),
        suffix: t("ownFollowersSuffix"),
        buttonText: t("ownFollowersAction"),
        action: "createCharacter",
      },
      following: {
        variant: "own",
        lines: [t("ownFollowingLine1")],
        highlight: t("ownFollowingHighlight"),
        suffix: t("ownFollowingSuffix"),
        buttonText: t("ownFollowingAction"),
        action: "exploreCharacter",
      },
    },
    other: {
      followers: {
        variant: "other",
        lines: [
          t("otherFollowersLine1", { nickname }),
          t("otherFollowersLine2"),
        ],
        title: t("otherTitle"),
        buttonText: t("otherAction"),
        action: "follow",
      },
      following: {
        variant: "other",
        lines: [
          t("otherFollowingLine1"),
          t("otherFollowingLine2", { nickname }),
        ],
        title: t("otherTitle"),
        buttonText: t("otherAction"),
        action: "follow",
      },
    },
  };

  const state = emptyStateByContext[scope][activeTab];
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
          <p className="body-6 max-w-[280px] text-font-2">
            {state.lines.map((line) => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <p className="title-3 max-w-[280px] text-font-1">{state.title}</p>
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
