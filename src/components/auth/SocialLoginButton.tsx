import React from "react";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SocialLoginButton = ({ icon, label, onClick }: SocialButtonProps) => (
  <button
    id="social-login-button"
    onClick={onClick}
    className="relative w-full h-11.5 flex items-center justify-center rounded-lg border border-white/10 bg-black/20 shadow-[inset_0px_1px_100px_rgba(255,255,255,0.06)]"
  >
    <span
      id="social-icon-wrapper"
      className="absolute left-7.5 top-1/2 -translate-y-1/2"
    >
      {icon}
    </span>
    <span id="social-label" className="title-5 text-font-1 font-semibold">
      {label}
    </span>
  </button>
);

export default SocialLoginButton;
