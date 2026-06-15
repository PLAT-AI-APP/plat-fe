import type { AppLocale } from "./config";

const ko = {
  chatRoom: {
    generatedNotice: "캐릭터가 보내는 메시지는 모두 생성된 내용이에요",
    sidebar: {
      title: "채팅방 설정",
      memory: "장기기억",
      persona: "페르소나",
      userNote: "유저노트",
    },
  },
};

const en: typeof ko = {
  chatRoom: {
    generatedNotice:
      "All messages sent by the character are AI-generated content.",
    sidebar: {
      title: "Chat room settings",
      memory: "Memory",
      persona: "Persona",
      userNote: "User note",
    },
  },
};

const ja: typeof ko = {
  chatRoom: {
    generatedNotice:
      "キャラクターが送るメッセージはすべて生成された内容です。",
    sidebar: {
      title: "チャットルーム設定",
      memory: "長期記憶",
      persona: "ペルソナ",
      userNote: "ユーザーノート",
    },
  },
};

const zh: typeof ko = {
  chatRoom: {
    generatedNotice: "角色发送的消息均为生成内容。",
    sidebar: {
      title: "聊天室设置",
      memory: "长期记忆",
      persona: "Persona",
      userNote: "用户笔记",
    },
  },
};

const th: typeof ko = {
  chatRoom: {
    generatedNotice: "ข้อความทั้งหมดที่ตัวละครส่งมาเป็นเนื้อหาที่ระบบสร้างขึ้น",
    sidebar: {
      title: "ตั้งค่าห้องแชท",
      memory: "ความทรงจำระยะยาว",
      persona: "Persona",
      userNote: "โน้ตผู้ใช้",
    },
  },
};

const vi: typeof ko = {
  chatRoom: {
    generatedNotice:
      "Mọi tin nhắn do nhân vật gửi đều là nội dung được tạo ra.",
    sidebar: {
      title: "Cài đặt phòng chat",
      memory: "Ký ức dài hạn",
      persona: "Persona",
      userNote: "Ghi chú người dùng",
    },
  },
};

export const CHAT_ROOM_MESSAGES_BY_LOCALE: Record<AppLocale, typeof ko> = {
  ko,
  en,
  ja,
  zh,
  th,
  vi,
};
