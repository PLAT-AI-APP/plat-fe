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
      <main id="main-container" className="flex h-[calc(100vh-60px)]">
        <Sidebar isFolded={isFolded} />

        <div
          id="page-content"
          className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col"
        >
          {children}
          <Footer />
        </div>
      </main>
    </>
  );
}
