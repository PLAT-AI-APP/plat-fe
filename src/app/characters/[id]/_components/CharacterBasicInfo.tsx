import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ChatFill } from "@/icons";
import TagList from "@/components/character/TagList";
import { formatStatCount } from "@/lib/utils";

const markdownComponents: Partial<Components> = {
  // 제목: 마진을 최소화하고 폰트 크기를 단계별로 설정
  h1: ({ ...props }) => <h1 className="text-2xl font-bold" {...props} />,
  h2: ({ ...props }) => <h2 className="text-xl font-semibold " {...props} />,
  h3: ({ ...props }) => <h3 className="text-lg font-semibold " {...props} />,

  // 문장: 가장 문제가 되었던 마진을 0으로 잡고, 문장 간 간격은 flex나 gap으로 조절 가능하게 설정
  p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
};

interface CharacterBasicInfoProps {
  title: string;
  chatCount: number;
  // heartCount: number;
  markdownContent: string;
  tags: string[];
}

const CharacterBasicInfo = ({
  title,
  chatCount,
  // heartCount,
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
          {/* <span className="flex items-center gap-1 text-sm text-font-2">
            <HeartFill className="h-4 w-4" />
            {formatStatCount(heartCount)}
          </span> */}
        </div>
      </header>

      <div
        id="character-introduction"
        className="flex flex-col gap-0.5 text-sm text-font-2"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={markdownComponents}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>

      <TagList list={tags} />
    </article>
  );
};

export default CharacterBasicInfo;
