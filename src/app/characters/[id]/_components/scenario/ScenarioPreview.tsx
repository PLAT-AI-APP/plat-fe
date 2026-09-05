import { Message } from "@/icons";
import { CharacterScenario } from "@/type/character";
import Image from "next/image";

interface ScenarioPreviewProps {
  currentScenario: CharacterScenario | undefined;
}
export const ScenarioPreview = ({ currentScenario }: ScenarioPreviewProps) => {
  if (!currentScenario) return null;
  const { firstDialogue, situation } = currentScenario;
  return (
    <section id="scenario-preview-container" className="flex flex-col gap-6">
      {/* 지문 섹션 */}
      <article className="flex items-center gap-5">
        <Message className="min-w-7 h-7 text-font-2" />
        <p className="body-5 text-font-2 whitespace-pre-line">{situation}</p>
      </article>

      {/* 시나리오 이미지(이미지 파일로 내려오지 않을 것 같다) */}
      <Image
        src={"/mainImage"}
        alt="시나리오 이미지"
        width={744}
        height={446}
        className="object-cover aspect-744/446.4 rounded-2xl w-full"
      />

      {/* 캐릭터 대화 예시 */}
      <div id="character-chat-preview" className="flex gap-2">
        <Image
          src={"/charProfile"} // 추후 캐릭터 api연동시 image
          alt={"charName"}
          width={40}
          height={40}
          className="rounded-full w-10 h-10"
        />
        <div className="flex flex-col gap-1.5 body-5">
          {/* 추후 캐릭터 api연동시 name */}
          <p>{"charName"}</p>
          <p className="px-3 py-2 bg-card rounded-[0px_16px_16px_16px]">
            {firstDialogue}
          </p>
        </div>
      </div>
    </section>
  );
};
