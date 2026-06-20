import Image from "next/image";
import CharacterChat from "@/components/chat/CharacterChat";
import Scenario from "@/components/chat/Scenario";
import { ScenarioContentItem } from "@/type/character";

interface PreviewContentViewProps {
  item: ScenarioContentItem;
  assetImageAlt: string;
  characterName: string;
  profileImage: string;
}

const PreviewContentView = ({
  item,
  assetImageAlt,
  characterName,
  profileImage,
}: PreviewContentViewProps) => {
  if (item.type === "chat") {
    return (
      <CharacterChat
        CharacterName={characterName}
        chatText={item.value}
        image={profileImage}
      />
    );
  }

  if (item.type === "action") {
    return <Scenario text={item.value} />;
  }

  return (
    <Image
      src={item.value}
      alt={assetImageAlt}
      width={120}
      height={120}
      unoptimized
      className="h-auto w-30 rounded-2xl"
    />
  );
};

export default PreviewContentView;
