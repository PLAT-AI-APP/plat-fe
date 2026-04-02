import React from "react";

interface LoginLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: LoginLayoutProps) => {
  return (
    <article className="overflow-hidden relative w-full h-[calc(100vh-60px)] flex items-center justify-center isolate bg-bg-dark">
      {children}
    </article>
  );
};

export default AuthLayout;
