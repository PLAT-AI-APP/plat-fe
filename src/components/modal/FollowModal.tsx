import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ModalLayout } from "@/components/ModalLayout";
import { Close } from "@/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useFollowingListQuery } from "@/api/follow/getFollowingList";
import { useFollowerListQuery } from "@/api/follow/getFollowerList";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useFollowMutation } from "@/api/follow/postFollow";
import { useUnFollowMutation } from "@/api/follow/deleteFollow";
import { useQueryClient } from "@tanstack/react-query";

const TABS = [
  { id: "followers", title: "팔로워" },
  { id: "following", title: "팔로잉" },
] as const;

import { FollowModalProps } from "@/type/modal";

export const FollowModal = ({
  onClose,
  userId,
  activeTab = "followers",
}: FollowModalProps) => {
  const queryClient = useQueryClient();

  const [activeTabs, setActiveTabs] = useState<"followers" | "following">(
    activeTab,
  );

  const [followChangeIds, setFollowChangeIds] = useState<number[]>([]);
  const handleFollowChangeId = (id: number) => {
    setFollowChangeIds((prev) => {
      // 이미 배열에 해당 ID가 있는지 체크 (중복 방지용 선택 사항)
      if (prev.includes(id)) {
        return prev.filter((v) => v !== id);
      }

      // 이전 배열을 복사하고 새 ID를 추가하여 리턴합니다.
      return [...prev, id];
    });
  };
  const { mutate: follow } = useFollowMutation();
  const { mutate: unFollow } = useUnFollowMutation();

  // 탭 변경 시: 조용히 데이터 새로고침 (Invalidate)
  useEffect(() => {
    // 사용자가 탭을 바꿀 때, 지금까지 수행한 변경사항을 실제 데이터에 반영
    return () => {
      // 이전에 보던 탭의 데이터를 백그라운드에서 최신화
      queryClient.invalidateQueries({
        queryKey: ["get-following-list", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-follower-list", userId],
      });
    };
  }, [activeTabs, queryClient, userId]);

  const ulRef = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTop = 0;
    }
  }, [activeTabs]);

  // 현재 탭이 'following'일 때만 팔로잉 쿼리 활성화
  const followingQuery = useFollowingListQuery(
    userId,
    activeTabs === "following",
  );
  // 현재 탭이 'followers'일 때만 팔로워 쿼리 활성화
  const followerQuery = useFollowerListQuery(
    userId,
    activeTabs === "followers",
  );

  // 현재 활성화된 탭의 데이터 및 상태 추출
  const activeQuery =
    activeTabs === "following" ? followingQuery : followerQuery;

  // 모든 페이지의 content를 하나로 합침 (중요!)
  const listData = useMemo(
    () => activeQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [activeQuery.data, activeTabs],
  );

  const { targetRef } = useIntersectionObserver({
    onIntersect: activeQuery.fetchNextPage,
    enabled: !!activeQuery.hasNextPage && !activeQuery.isFetchingNextPage,
    rootMargin: "200px",
  });

  if (activeQuery.isLoading) return <div>로딩 중...</div>;
  return (
    <ModalLayout
      onClose={onClose}
      hasBackground={true}
      className="w-112.5 p-5 overflow-hidden"
    >
      {/* Header & Tabs */}
      <div className="">
        <header className="flex justify-between items-center mb-4">
          <nav className="flex gap-1 mb-1.5">
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTabs(tab.id)}
                className={cn(
                  "text-font-disabled px-7.25 py-2.75 cursor-pointer translate-y-0.5",
                  activeTabs === tab.id &&
                    "text-font-1 font-medium border-b-2 border-brand",
                )}
              >
                {tab.title}
              </button>
            ))}
          </nav>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6 rounded-lg hover:bg-btn-hover"
          >
            <Close className="w-5 h-5" />
          </button>
        </header>
      </div>

      {/* User List */}
      <ul className="flex flex-col gap-1 h-95 overflow-y-auto custom-scrollbar">
        {/* socialData 상태값을 기반으로 렌더링 */}
        {listData?.map((user, index) => {
          // 1. 이 유저의 최종 팔로우 상태 계산
          // 팔로워 탭: 클릭 안 했을 때(팔로우), 클릭 했을 때(팔로잉)
          // 팔로잉 탭: 클릭 안 했을 때(팔로잉), 클릭 했을 때(팔로우)
          const isToggled = followChangeIds.includes(user.userId);

          // 만약 API에서 user.isFollowing 정보를 준다면 그걸 기준으로 삼는 게 가장 정확합니다.
          // 정보가 없다면 아래처럼 탭 기준으로 임시 판별합니다.
          const isFollowing =
            activeTabs === "followers"
              ? isToggled // 팔로워 탭에선 클릭하면 팔로잉 중
              : !isToggled; // 팔로잉 탭에선 클릭하면 팔로우 해제(즉, 안 함)
          return (
            <li
              key={index + user.userId}
              className="cursor-pointer flex items-center justify-between rounded-2xl hover:bg-btn-hover p-2.5"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={user.profileImage || ""}
                  alt="유저 프로필 이미지"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm text-white">{user.nickname}</span>
              </div>

              {/* 팔로우/팔로잉 버튼 - 클릭 이벤트 연결 */}
              <button
                onClick={() => {
                  handleFollowChangeId(user.userId);
                  if (isFollowing) {
                    unFollow({ userId: user.userId });
                  } else {
                    follow({ userId: user.userId });
                  }
                }}
                className={cn(
                  "px-2.5 py-1 rounded-[100px] text-xs transition-colors",
                  isFollowing
                    ? "bg-card text-font-2" // 팔로잉 중인 상태 (차분한 색)
                    : "bg-font-1 text-bg-dark", // 팔로우 전 상태 (눈에 띄는 색)
                )}
              >
                {isFollowing ? "팔로잉" : "팔로우"}
              </button>
            </li>
          );
        })}

        {/* 무한 스크롤 감지 및 추가 로딩 표시 */}
        <div ref={targetRef} className="py-0.5 text-center">
          {activeQuery.isFetchingNextPage ? (
            <span className="text-xs text-font-2 animate-pulse">
              목록을 더 가져오는 중...
            </span>
          ) : activeQuery.hasNextPage ? (
            <div className="h-4" /> // 감지용 여백
          ) : null}
        </div>
      </ul>
    </ModalLayout>
  );
};
