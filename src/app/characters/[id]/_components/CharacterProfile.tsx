import ActiveButton from "@/components/ActiveButton";
import { Heart } from "@/icons";
import { formatStatCount } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CharacterProfileProps {
  imageSrc: string;
  creatorImage: string;
  creatorName: string;
  followerCount: number;
}

const CharacterProfile = ({
  imageSrc,
  creatorImage,
  creatorName,
  followerCount,
}: CharacterProfileProps) => {
  return (
    <section className="flex flex-col gap-4 max-w-100">
      <Image
        src={imageSrc}
        alt="메인 캐릭터 이미지"
        width={500}
        height={500}
        className="object-cover aspect-square rounded-2xl"
      />

      {/* 대화하기 좋아요 button */}
      <div className="flex gap-3">
        <ActiveButton
          text="대화하기"
          isActive
          className="rounded-xl font-normal"
        />
        <button className="flex rounded-xl justify-center items-center bg-card hover:bg-card-hover cursor-pointer w-11.5 aspect-square">
          <Heart className="text-font-2" />
        </button>
      </div>

      {/* 제작자 정보, 팔로우 button */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Image
            src={creatorImage}
            alt="캐릭터 제작자 이미지"
            width={40}
            height={40}
            className="object-cover aspect-square rounded-full"
          />
          <div className="flex flex-col gap-0.5">
            <Link href={"/"} className="text-font-1 hover:underline">
              {creatorName}
            </Link>
            <span className="text-font-2 text-[12px]">
              팔로워 {formatStatCount(followerCount)}
            </span>
          </div>
        </div>
        <button className="px-2.5 py-1 rounded-[10px] text-bg-dark bg-font-1 text-sm font-medium">
          팔로우
        </button>
      </div>
    </section>
  );
};

export default CharacterProfile;
