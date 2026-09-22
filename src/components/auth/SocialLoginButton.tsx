import React from "react";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

// id 를 고정값으로 박아 두면 카카오·구글 버튼이 같은 id 를 갖게 된다. 넘겨받은 id 를 쓴다.
const SocialLoginButton = ({ icon, label, onClick, ...props }: SocialButtonProps) => (
  <button
    type="button"
    {...props}
    onClick={onClick}
    className="relative flex h-11 w-full items-center justify-center rounded-lg border border-main bg-card hover:bg-card-hover"
  >
    <span
      className="absolute left-7.5 top-1/2 -translate-y-1/2"
    >
      {icon}
    </span>
    <span className="title-5 text-font-1">
      {label}
    </span>
  </button>
);

export default SocialLoginButton;
