import React from "react";

interface LoginLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: LoginLayoutProps) => {
  return (
    <article className="relative flex min-h-[calc(100vh-60px)] w-full items-center justify-center bg-bg-dark">
      {children}
    </article>
  );
};

export default AuthLayout;
