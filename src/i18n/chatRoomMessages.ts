import type { AppLocale } from "./config";

const ko = {
  chatRoom: {
    generatedNotice: "캐릭터가 보내는 메시지는 모두 생성된 내용이에요",
    sidebar: {
      title: "채팅방 설정",
      close: "채팅방 설정 닫기",
      ownedNotes: "보유 노트",
      userSettings: "유저 설정",
      memoryLog: "메모리 로그",
      chatSettings: "채팅 환경 설정",
      memory: "장기기억",
      persona: "페르소나",
      userNote: "유저노트",
      assetGallery: "에셋 갤러리",
      suggestedReply: "추천 답변",
      assetView: "에셋 보기",
      restartChat: "대화 새로하기",
      leaveChat: "채팅방 나가기",
    },
  },
};

const en: typeof ko = {
  chatRoom: {
    generatedNotice:
      "All messages sent by the character are AI-generated content.",
    sidebar: {
      title: "Chat room settings",
      close: "Close chat room settings",
      ownedNotes: "Owned notes",
      userSettings: "User settings",
      memoryLog: "Memory log",
      chatSettings: "Chat settings",
      memory: "Long-term memory",
      persona: "Persona",
      userNote: "User note",
      assetGallery: "Asset gallery",
      suggestedReply: "Suggested replies",
      assetView: "Show assets",
      restartChat: "Restart chat",
      leaveChat: "Leave chat room",
    },
  },
};

const ja: typeof ko = {
  chatRoom: {
    generatedNotice:
      "キャラクターが送信するメッセージはすべて生成された内容です。",
    sidebar: {
      title: "チャットルーム設定",
      close: "チャットルーム設定を閉じる",
      ownedNotes: "保有ノート",
      userSettings: "ユーザー設定",
      memoryLog: "メモリーログ",
      chatSettings: "チャット環境設定",
      memory: "長期記憶",
      persona: "ペルソナ",
      userNote: "ユーザーノート",
      assetGallery: "アセットギャラリー",
      suggestedReply: "おすすめ返信",
      assetView: "アセット表示",
      restartChat: "会話を新しく始める",
      leaveChat: "チャットルームを退出",
    },
  },
};

const zh: typeof ko = {
  chatRoom: {
    generatedNotice: "角色发送的所有消息均为生成内容。",
    sidebar: {
      title: "聊天室设置",
      close: "关闭聊天室设置",
      ownedNotes: "持有笔记",
      userSettings: "用户设置",
      memoryLog: "记忆日志",
      chatSettings: "聊天环境设置",
      memory: "长期记忆",
      persona: "Persona",
      userNote: "用户笔记",
      assetGallery: "素材图库",
      suggestedReply: "推荐回复",
      assetView: "显示素材",
      restartChat: "重新开始对话",
      leaveChat: "退出聊天室",
    },
  },
};

const th: typeof ko = {
  chatRoom: {
    generatedNotice: "ข้อความทั้งหมดที่ตัวละครส่งเป็นเนื้อหาที่สร้างขึ้น",
    sidebar: {
      title: "ตั้งค่าห้องแชต",
      close: "ปิดการตั้งค่าห้องแชต",
      ownedNotes: "โน้ตที่มี",
      userSettings: "การตั้งค่าผู้ใช้",
      memoryLog: "บันทึกความจำ",
      chatSettings: "ตั้งค่าสภาพแวดล้อมแชต",
      memory: "ความจำระยะยาว",
      persona: "Persona",
      userNote: "โน้ตผู้ใช้",
      assetGallery: "แกลเลอรีแอสเซ็ต",
      suggestedReply: "คำตอบแนะนำ",
      assetView: "แสดงแอสเซ็ต",
      restartChat: "เริ่มบทสนทนาใหม่",
      leaveChat: "ออกจากห้องแชต",
    },
  },
};

const vi: typeof ko = {
  chatRoom: {
    generatedNotice:
      "Tất cả tin nhắn do nhân vật gửi đều là nội dung được tạo.",
    sidebar: {
      title: "Cài đặt phòng chat",
      close: "Đóng cài đặt phòng chat",
      ownedNotes: "Ghi chú sở hữu",
      userSettings: "Cài đặt người dùng",
      memoryLog: "Nhật ký trí nhớ",
      chatSettings: "Cài đặt môi trường chat",
      memory: "Trí nhớ dài hạn",
      persona: "Persona",
      userNote: "Ghi chú người dùng",
      assetGallery: "Thư viện asset",
      suggestedReply: "Trả lời gợi ý",
      assetView: "Hiển thị asset",
      restartChat: "Bắt đầu lại cuộc trò chuyện",
      leaveChat: "Rời phòng chat",
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
