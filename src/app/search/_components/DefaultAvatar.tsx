interface DefaultAvatarProps {
  className?: string;
}

// Figma에서 내보낸 에셋(만료되는 원격 URL 대신 로컬에 저장)
const AVATAR_BLOB_SRC = "/images/search-results/avatar-ellipse-1.svg";
const AVATAR_EYE_SRC = "/images/search-results/avatar-ellipse-2.svg";
const AVATAR_MOUTH_SRC = "/images/search-results/avatar-ellipse-3.svg";

/** 프로필 이미지가 없는 유저에게 보여주는 그라디언트 기본 아바타 */
const DefaultAvatar = ({ className }: DefaultAvatarProps) => {
  return (
    <div
      className={
        className ||
        "relative aspect-square w-[100px] overflow-hidden rounded-full"
      }
      style={{
        backgroundImage:
          "linear-gradient(-45deg, rgb(34, 197, 94) 0%, rgb(6, 182, 212) 100%)",
      }}
    >
      <div className="contents absolute inset-[15%_-34.89%_-48.44%_4%]">
        <div
          className="absolute inset-[15%_-34.89%_-48.44%_4%] flex items-center justify-center"
          style={{ containerType: "size" }}
        >
          <div className="h-[hypot(30.9891cqw,71.0279cqh)] w-[hypot(69.0109cqw,-28.9721cqh)] flex-none rotate-[-23.17deg]">
            <div className="relative size-full">
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={AVATAR_BLOB_SRC}
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-[65.22%_58.99%_30.37%_36.6%]">
          <img
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            src={AVATAR_EYE_SRC}
          />
        </div>
        <div className="absolute inset-[42.32%_34.32%_53.28%_61.27%]">
          <img
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            src={AVATAR_EYE_SRC}
          />
        </div>

        <div
          className="absolute inset-[60.82%_32.74%_29.52%_56.87%] flex items-center justify-center"
          style={{ containerType: "size" }}
        >
          <div className="h-[hypot(30.3962cqw,42.7825cqh)] w-[hypot(69.6038cqw,-57.2175cqh)] flex-none rotate-[-37.39deg]">
            <div className="relative size-full">
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={AVATAR_MOUTH_SRC}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultAvatar;
