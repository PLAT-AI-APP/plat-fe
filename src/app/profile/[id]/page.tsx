import React from "react";
import ProfileContent from "./_components/ProfileContent";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Next.js 15+ 권장 방식에 따라 Page를 Server Component로 구성하고,
 * 비동기 params를 처리하며 클라이언트 로직은 ProfileContent로 위임합니다.
 */
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  return <ProfileContent id={id} />;
}
