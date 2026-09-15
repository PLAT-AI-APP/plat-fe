import Image from "next/image";
import CharacterChat from "@/components/chat/CharacterChat";
import Scenario from "@/components/chat/Scenario";
import UserChatBubble from "@/components/chat/UserChatBubble";
import { useUserDisplayName } from "@/hooks/data/useUserDisplayName";
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
  // {{user}} 자리에 보여줄 이름. 만드는 본인이 보는 미리보기라 본인 닉네임을 씁니다 —
  // 실제 값(item.value)은 그대로 두고 화면에 보여줄 문자열만 치환합니다.
  const userDisplayName = useUserDisplayName();
  const displayValue = item.value.replaceAll("{{user}}", userDisplayName);

  if (item.type === "chat") {
    return (
      <CharacterChat
        CharacterName={characterName}
        chatText={displayValue}
        image={profileImage}
      />
    );
  }

  if (item.type === "userChat") {
    return <UserChatBubble text={displayValue} />;
  }

  if (item.type === "action") {
    return <Scenario text={displayValue} />;
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
