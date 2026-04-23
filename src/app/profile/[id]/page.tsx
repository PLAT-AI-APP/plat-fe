import React from "react";
import ProfileContent from "./_components/ProfileContent";
import { Metadata } from "next";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "프로필",
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  return <ProfileContent id={id} />;
}
