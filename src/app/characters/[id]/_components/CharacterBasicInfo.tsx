import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ChatFill, HeartFill } from "@/icons";
import TagList from "@/components/character/TagList";
import { formatStatCount } from "@/lib/utils";

interface CharacterBasicInfoProps {
  title: string;
  chatCount: number;
  heartCount: number;
  markdownContent: string;
  tags: string[];
}

const CharacterBasicInfo = ({
  title,
  chatCount,
  heartCount,
  markdownContent,
  tags,
}: CharacterBasicInfoProps) => {
  return (
    <article className="flex flex-col gap-4">
      <header className="flex flex-col gap-1.5">
        <h2 className="font-semibold text-[20px] text-font-1">{title}</h2>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-sm text-font-2">
            <ChatFill className="h-4 w-4" />
            {formatStatCount(chatCount)}
          </span>
          <span className="flex items-center gap-1 text-sm text-font-2">
            <HeartFill className="h-4 w-4" />
            {formatStatCount(heartCount)}
          </span>
        </div>
      </header>

      <div
        id="character-introduction"
        className="text-sm text-font-2 leading-relaxed"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {markdownContent}
        </ReactMarkdown>
      </div>

      <TagList list={tags} />
    </article>
  );
};

export default CharacterBasicInfo;
