import type { AIModelType, ChatModelOption } from "@/type/chat";

const PROVIDER_ICON: Record<ChatModelOption["provider"], string> = {
  ANTHROPIC: "/ai-logo/claude.png",
  GOOGLE: "/ai-logo/gemini.png",
  OPENAI: "/ai-logo/chatgpt.png",
};

// 번역 문구가 있는 모델만 둔다. 없으면 서버가 준 설명(한국어)으로 떨어진다.
const DESCRIPTION_KEY: Record<string, string> = {
  CLAUDE_SONNET_4_6: "claudeSonnet46Description",
  CLAUDE_OPUS_4_8: "claudeOpus46Description",
  GEMINI_2_5_PRO: "gemini25Description",
  GEMINI_3_1_PRO_PREVIEW: "gemini31Description",
  GEMINI_3_FLASH_PREVIEW: "gemini3FlashDescription",
  GPT_5_5: "gpt51Description",
};

/** 백엔드 모델 카탈로그 한 줄을 화면용 모델로 바꿉니다. */
export const toAiModel = (option: ChatModelOption): AIModelType => {
  const label = option.displayName;
  // 제공사 이름은 아이콘이 말해 주므로, 좁은 선택 버튼에서는 뺀다.
  const name =
    option.provider === "OPENAI" ? label : label.split(" ").slice(1).join(" ");

  return {
    id: option.name,
    name,
    label,
    provider: option.provider,
    icon: PROVIDER_ICON[option.provider],
    descriptionKey: DESCRIPTION_KEY[option.name],
    description: option.description,
    price: option.creditCost,
  };
};
