import { useState } from "react";

const useToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = (e?: React.BaseSyntheticEvent) => {
    console.log("열기");

    e?.stopPropagation();
    e?.preventDefault();
    setIsOpen(true);
  };

  const close = (e?: React.BaseSyntheticEvent) => {
    console.log("닫기");

    e?.stopPropagation();
    e?.preventDefault();
    setIsOpen(false);
  };

  const toggle = (e?: React.BaseSyntheticEvent) => {
    console.log("토글");
    e?.stopPropagation();
    e?.preventDefault();
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen, // 현재 상태
    open, // 열기 함수
    close, // 닫기 함수
    toggle, // 토글 함수
    setIsOpen, // 필요한 경우 직접 제어용
  };
};

export default useToggle;
