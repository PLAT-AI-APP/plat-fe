"use client";
import Image from "next/image";
import { MouseEvent, Ref } from "react";
import { useTranslations } from "next-intl";

interface ProfileProps {
  triggerRef: Ref<HTMLButtonElement | null> | undefined;
  handleToggle: (event: MouseEvent<HTMLButtonElement>) => void;
  /** 포인터를 올리거나 포커스했을 때. 팝오버 코드를 미리 받아 첫 클릭에 바로 뜨게 한다. */
  onIntent?: () => void;
  profileImg: string;
  isOpen?: boolean;
}

/**
 * 헤더의 프로필 사진 = 계정 메뉴 버튼.
 *
 * 예전에는 <Image onClick> 이라 버튼이 아니었다. 키보드로 열 수 없고, 눌렀을 때의 반응
 * (base.css 의 :active)도 받지 못했다.
 */
const Profile = ({
  triggerRef,
  handleToggle,
  onIntent,
  profileImg,
  isOpen,
}: ProfileProps) => {
  const t = useTranslations("profilePopover");

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-label={t("profileImageAlt")}
      onClick={handleToggle}
      onPointerEnter={onIntent}
      onFocus={onIntent}
      className="relative block size-8 shrink-0 cursor-pointer rounded-full"
    >
      <Image
        src={profileImg || ""}
        alt=""
        width={32}
        height={32}
        className="size-full rounded-full"
      />
    </button>
  );
};

export default Profile;
