"use client";

import FindPasswordModal from "@/components/modal/find-password";
import { useRouter } from "next/navigation";

const FindPasswordPage = () => {
  const router = useRouter();

  return <FindPasswordModal onClose={() => router.back()} />;
};

export default FindPasswordPage;
