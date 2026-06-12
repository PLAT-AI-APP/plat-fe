import type React from "react";
import { Prohibition, ShareOutline } from "@/icons";
import { PopoverLayout } from "./layout";

interface ProfileActionPopoverProps {
  onBlock: () => void;
  onClose: () => void;
  onShare: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const ProfileActionPopover = ({
  onBlock,
  onClose,
  onShare,
  triggerRef,
}: ProfileActionPopoverProps) => {
  const handleShareClick = () => {
    // 팝오버 액션은 실행 전 먼저 닫아 다음 모달/토스트와 레이어가 겹치지 않게 합니다.
    onClose();
    onShare();
  };

  const handleBlockClick = () => {
    // 차단 확인 Dialog가 열릴 때 기존 팝오버는 닫아 포커스 대상이 하나만 남게 합니다.
    onClose();
    onBlock();
  };

  // 메뉴 항목을 데이터로 관리해 항목 추가/삭제 시 렌더링 구조를 중복 수정하지 않게 합니다.
  const profileActions = [
    {
      icon: <ShareOutline className="size-6 shrink-0 text-font-2" />,
      label: "프로필 공유하기",
      onClick: handleShareClick,
    },
    {
      icon: <Prohibition className="size-6 shrink-0 text-font-2" />,
      label: "유저 차단하기",
      onClick: handleBlockClick,
    },
  ];

  return (
    <PopoverLayout
      onClose={onClose}
      triggerRef={triggerRef}
      className="left-1/2 w-[161px] -translate-x-1/2 rounded-xl border-0 bg-btn-selected p-2"
    >
      <menu className="flex flex-col items-center gap-1">
        {profileActions.map(({ icon, label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="body-2 flex w-full items-center gap-2 rounded-lg p-2 text-left text-font-1 transition-colors hover:bg-btn-hover"
          >
            {icon}
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}
      </menu>
    </PopoverLayout>
  );
};

export default ProfileActionPopover;
