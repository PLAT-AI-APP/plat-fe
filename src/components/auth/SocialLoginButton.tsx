import React from "react";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SocialLoginButton = ({ icon, label, onClick }: SocialButtonProps) => (
  <button type="button"
    id="social-login-button"
    onClick={onClick}
    className="relative w-full h-11.5 flex items-center justify-center rounded-lg border border-main bg-card"
  >
    <span
      id="social-icon-wrapper"
      className="absolute left-7.5 top-1/2 -translate-y-1/2"
    >
      {icon}
    </span>
    <span id="social-label" className="title-5 text-font-1">
      {label}
    </span>
  </button>
);

export default SocialLoginButton;
