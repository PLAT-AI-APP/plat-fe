import { Heart, HeartFill } from "@/icons";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Image
        className="dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        priority
      />
      <Heart />
      <HeartFill />
    </div>
  );
}
