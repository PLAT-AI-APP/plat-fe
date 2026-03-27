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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="font-semibold text-[20px] text-font-1">{title}</p>
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
      </div>

      <div className="text-sm text-font-2 leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {markdownContent}
        </ReactMarkdown>
      </div>

      <TagList list={tags} />
    </div>
  );
};

export default CharacterBasicInfo;
