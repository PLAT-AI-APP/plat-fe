"use client";
import Footer from "@/components/Footer";
import Header from "@/components/header/index";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFolded, setIsFolded] = useState(true);
  const handleFoldToggle = () => {
    setIsFolded((prev) => !prev);
  };
  return (
    <>
      <Header handleFoldToggle={handleFoldToggle} />
      <main className="min-h-screen flex">
        <Sidebar isFolded={isFolded} />
        {children}
      </main>
      <Footer />
    </>
  );
}
