import React, { useState } from "react";
import { ModalLayout } from "@/components/ModalLayout";
import { Close } from "@/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const USER_SOCIAL_MOCK = {
  followers: [
    {
      id: "u1",
      name: "새벽안개_04",
      avatar: "/public/p1.png",
      isFollowing: false,
    },
    {
      id: "u2",
      name: "루시_Lucie",
      avatar: "/public/p1.png",
      isFollowing: false,
    },
    {
      id: "u3",
      name: "코딩하는고양이",
      avatar: "/public/p1.png",
      isFollowing: false,
    },
    {
      id: "u4",
      name: "StarGazer",
      avatar: "/public/p1.png",
      isFollowing: false,
    },
    {
      id: "u5",
      name: "민트초코단장",
      avatar: "/public/p1.png",
      isFollowing: false,
    },
    {
      id: "u6",
      name: "오늘도배고파",
      avatar: "/public/p1.png",
      isFollowing: false,
    },
    {
      id: "u7",
      name: "오늘도배고파",
      avatar: "/public/p1.png",
      isFollowing: false,
    },
    {
      id: "u8",
      name: "오늘도배고파",
      avatar: "/public/p1.png",
      isFollowing: false,
    },
  ],
  following: [
    {
      id: "u7",
      name: "김철수_KR",
      avatar: "/public/p1.png",
      isFollowing: true,
    },
    {
      id: "u8",
      name: "Winter_Forest",
      avatar: "/public/p1.png",
      isFollowing: true,
    },
    {
      id: "u9",
      name: "레벨업마스터",
      avatar: "/public/p1.png",
      isFollowing: true,
    },
  ],
};

const TABS = [
  { id: "followers", title: "팔로워" },
  { id: "following", title: "팔로잉" },
] as const;

export const FollowModal = ({ onClose }: { onClose: () => void }) => {
  // 'follower' 또는 'following' 탭 상태 관리
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );

  // 데이터를 상태로 관리 (추후 react-query 도입 시 이 부분이 useMutation 등으로 대체됩니다)
  const [socialData, setSocialData] = useState(USER_SOCIAL_MOCK);
  // 팔로우 상태 토글 함수
  const handleFollowToggle = (userId: string) => {
    setSocialData((prev) => ({
      ...prev,
      // 현재 탭뿐만 아니라 반대쪽 탭에도 같은 유저가 있다면 함께 업데이트하기 위해 둘 다 맵핑
      followers: prev.followers.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user,
      ),
      following: prev.following.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user,
      ),
    }));

    // TODO: 여기서 바로 서버 API 호출 (react-query mutation)
    // 리스트에서 바로 사라지지 않게 하려면, 필터링 로직 없이 데이터의 속성값만 바꿉니다.
  };
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
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "text-font-disabled px-7.25 py-2.75 cursor-pointer translate-y-0.5",
                  activeTab === tab.id &&
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
        {socialData[activeTab].map((user) => (
          <li
            key={user.id}
            className="cursor-pointer flex items-center justify-between rounded-2xl hover:bg-btn-hover p-2.5"
          >
            <div className="flex items-center gap-4">
              <Image
                src={user.avatar}
                alt="유저 프로필 이미지"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-sm text-white">{user.name}</span>
            </div>

            {/* 팔로우/팔로잉 버튼 - 클릭 이벤트 연결 */}
            <button
              onClick={() => handleFollowToggle(user.id)}
              className={cn(
                "px-2.5 py-1 rounded-[100px] text-xs transition-colors",
                user.isFollowing
                  ? "bg-card" // 팔로잉 중인 상태
                  : "bg-font-1 text-bg-dark", // 팔로우 전 상태
              )}
            >
              {user.isFollowing ? "팔로잉" : "팔로우"}
            </button>
          </li>
        ))}
      </ul>
    </ModalLayout>
  );
};
