import { useState } from "react";

export const useTogglePassword = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggle = () => setIsVisible((prev) => !prev);

  // 현재 상태에 따른 input type 결정
  const inputType = isVisible ? "text" : "password";

  return { isVisible, toggle, inputType };
};
