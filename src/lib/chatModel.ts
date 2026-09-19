import type { AIModelType, ChatModelOption } from "@/type/chat";

const PROVIDER_ICON: Record<ChatModelOption["provider"], string> = {
  ANTHROPIC: "/ai-logo/claude.png",
  GOOGLE: "/ai-logo/gemini.png",
  OPENAI: "/ai-logo/chatgpt.png",
};

// 설명 문구가 있는 모델만 둔다. 없는 모델은 설명 줄을 그리지 않는다.
const DESCRIPTION_KEY: Record<string, string> = {
  CLAUDE_SONNET_4_6: "claudeSonnet46Description",
  CLAUDE_OPUS_4_8: "claudeOpus46Description",
  GEMINI_2_5_PRO: "gemini25Description",
  GEMINI_3_1_PRO_PREVIEW: "gemini31Description",
  GEMINI_3_FLASH_PREVIEW: "gemini3FlashDescription",
  GPT_5_5: "gpt51Description",
};

const isVersionToken = (token: string) => /^\d+(\.\d+)*$/.test(token);

/** "claude-sonnet-4-6" → "Claude Sonnet 4.6". 끝의 날짜 접미사는 버리고, 이어진 숫자는 버전으로 묶는다. */
const formatModelLabel = (value: string) => {
  const words: string[] = [];

  value
    .replace(/-\d{8}$/, "")
    .split("-")
    .forEach((token) => {
      const last = words[words.length - 1];

      if (/^\d+$/.test(token) && last && isVersionToken(last)) {
        words[words.length - 1] = `${last}.${token}`;
        return;
      }

      words.push(token);
    });

  return words
    .map((word) =>
      word === "gpt" ? "GPT" : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
};

/** 백엔드 모델 카탈로그 한 줄을 화면용 모델로 바꿉니다. */
export const toAiModel = (option: ChatModelOption): AIModelType => {
  const label = formatModelLabel(option.value);
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
  };
};
