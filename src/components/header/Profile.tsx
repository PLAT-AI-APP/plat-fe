"use client";
import Image from "next/image";
import ProfileImg from "../../../public/p1.png";
import { Ref } from "react";

interface ProfileProps {
  triggerRef: Ref<HTMLImageElement | null> | undefined;
  handleToggle: () => void;
}
const Profile = ({ triggerRef, handleToggle }: ProfileProps) => {
  return (
    <div className="relative text-nowrap w-8 h-8">
      <Image
        ref={triggerRef}
        src={ProfileImg}
        alt="profile image"
        className="w-full h-full cursor-pointer shrink-0"
        onClick={handleToggle}
      />
    </div>
  );
};

export default Profile;
