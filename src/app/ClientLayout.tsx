"use client";

import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFolded, setIsFolded] = useState(true);
  const handleFoldToggle = () => setIsFolded((prev) => !prev);

  return (
    <>
      <Header handleFoldToggle={handleFoldToggle} />
      <main className="min-h-screen flex">
        <Sidebar isFolded={isFolded} />
        <div className="flex-1">{children}</div>
      </main>
      <Footer />
    </>
  );
}
