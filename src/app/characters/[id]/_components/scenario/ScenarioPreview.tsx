import { Message } from "@/icons";
import Image from "next/image";

interface ScenarioPreviewProps {
  content: string;
  mainImage: string;
  charName: string;
  charProfile: string;
  charMessage: string;
}

export const ScenarioPreview = ({
  content,
  mainImage,
  charName,
  charProfile,
  charMessage,
}: ScenarioPreviewProps) => (
  <section id="scenario-preview-container" className="flex flex-col gap-6">
    {/* 지문 섹션 */}
    <article className="flex gap-5">
      <Message className="min-w-7 h-7 text-font-2" />
      <p className="text-sm text-font-2 whitespace-pre-line">{content}</p>
    </article>

    {/* 메인 이미지 */}
    <Image
      src={mainImage}
      alt="시나리오 이미지"
      width={744}
      height={446}
      className="object-cover aspect-744/446.4 rounded-2xl w-full"
    />

    {/* 캐릭터 대화 예시 */}
    <div id="character-chat-preview" className="flex gap-2">
      <Image
        src={charProfile}
        alt={charName}
        width={40}
        height={40}
        className="rounded-full w-10 h-10"
      />
      <div className="flex flex-col gap-1.5 text-sm font-medium">
        <p>{charName}</p>
        <p className="px-3 py-2 bg-card rounded-[0px_16px_16px_16px]">
          {charMessage}
        </p>
      </div>
    </div>
  </section>
);
