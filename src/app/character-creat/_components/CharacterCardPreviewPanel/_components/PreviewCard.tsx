import { ChatFill } from "@/icons";
import PreviewImage from "./PreviewImage";

type PreviewCardSize = "S" | "M";

interface PreviewCardProps {
  size: PreviewCardSize;
  image: string;
  title: string;
  description: string;
  creatorName: string;
  chatCount: number;
}

const PreviewCard = ({
  size,
  image,
  title,
  description,
  creatorName,
  chatCount,
}: PreviewCardProps) => {
  const isSmall = size === "S";

  return (
    <article className="flex flex-col items-start">
      <div
        className={
          isSmall
            ? "relative h-[245px] w-[187px] overflow-hidden rounded-2xl"
            : "relative h-[227px] w-[227px] overflow-hidden rounded-t-2xl"
        }
      >
        <PreviewImage image={image} title={title} />
      </div>

      <div
        className={
          isSmall
            ? "mt-2 flex w-[187px] flex-col items-start gap-0.5"
            : "flex w-[227px] flex-col items-start gap-0.5 rounded-b-2xl bg-darkest px-4 py-5"
        }
      >
        <strong className="title-3 max-w-full truncate text-font-0">
          {title}
        </strong>
        <p
          className={
            isSmall
              ? "body-4 max-w-full truncate text-font-2"
              : "body-4 line-clamp-2 min-h-[42px] text-font-2"
          }
        >
          {description}
        </p>
        <p className="body-6 max-w-full truncate text-font-2">
          @ {creatorName}
        </p>
        <div className="body-6 flex items-center gap-1 text-font-2">
          <ChatFill className="size-3.5 text-font-2" />
          {chatCount}
        </div>
      </div>
    </article>
  );
};

export default PreviewCard;
