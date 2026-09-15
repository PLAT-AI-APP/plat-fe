import type { AppLocale } from "./config";

const ko = {
  chatRoom: {
    generatedNotice: "캐릭터가 보내는 메시지는 모두 생성된 내용이에요",
    sidebar: {
      title: "채팅방 설정",
      back: "뒤로가기",
      openSettings: "채팅방 설정 열기",
      close: "채팅방 설정 닫기",
      backToSettings: "채팅방 설정으로 돌아가기",
      ownedNotes: "보유 노트",
      userSettings: "유저 설정",
      memoryLog: "메모리 로그",
      chatSettings: "채팅 환경 설정",
      memory: "지나온 대화",
      pastConversations: "지나온 대화",
      memoryDescription:
        "대화를 자동 요약해 캐릭터가 더 오래 기억할 수 있어요.",
      memoryPlaceholder:
        "이 캐릭터와 나눈 대화 중 기억해 두고 싶은 내용을 적어주세요",
      memorySaveButton: "저장",
      memorySavedToast: "장기기억이 저장되었습니다",
      persona: "페르소나",
      userNote: "유저노트",
      assetGallery: "에셋 갤러리",
      assetTotal: "총  {count}개",
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
      back: "Go back",
      openSettings: "Open chat room settings",
      close: "Close chat room settings",
      backToSettings: "Back to chat room settings",
      ownedNotes: "Owned notes",
      userSettings: "User settings",
      memoryLog: "Memory log",
      chatSettings: "Chat settings",
      memory: "Past conversations",
      pastConversations: "Past conversations",
      memoryDescription:
        "Conversations are summarized automatically so the character can remember longer.",
      memoryPlaceholder:
        "Write what you'd like the character to remember from your conversations so far",
      memorySaveButton: "Save",
      memorySavedToast: "Memory has been saved",
      persona: "Persona",
      userNote: "User note",
      assetGallery: "Asset gallery",
      assetTotal: "Total  {count}",
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
      back: "戻る",
      openSettings: "チャットルーム設定を開く",
      close: "チャットルーム設定を閉じる",
      backToSettings: "チャットルーム設定に戻る",
      ownedNotes: "保有ノート",
      userSettings: "ユーザー設定",
      memoryLog: "メモリーログ",
      chatSettings: "チャット環境設定",
      memory: "過去の会話",
      pastConversations: "過去の会話",
      memoryDescription:
        "会話を自動で要約し、キャラクターがより長く記憶できます。",
      memoryPlaceholder:
        "これまでの会話の中で覚えておいてほしい内容を書いてください",
      memorySaveButton: "保存",
      memorySavedToast: "長期記憶が保存されました",
      persona: "ペルソナ",
      userNote: "ユーザーノート",
      assetGallery: "アセットギャラリー",
      assetTotal: "合計  {count}件",
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
      back: "返回",
      openSettings: "打开聊天室设置",
      close: "关闭聊天室设置",
      backToSettings: "返回聊天室设置",
      ownedNotes: "持有笔记",
      userSettings: "用户设置",
      memoryLog: "记忆日志",
      chatSettings: "聊天环境设置",
      memory: "过往对话",
      pastConversations: "过往对话",
      memoryDescription: "系统会自动总结对话，让角色记得更久。",
      memoryPlaceholder: "请写下您希望角色记住的以往对话内容",
      memorySaveButton: "保存",
      memorySavedToast: "长期记忆已保存",
      persona: "Persona",
      userNote: "用户笔记",
      assetGallery: "素材图库",
      assetTotal: "共  {count}个",
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
      back: "ย้อนกลับ",
      openSettings: "เปิดการตั้งค่าห้องแชต",
      close: "ปิดการตั้งค่าห้องแชต",
      backToSettings: "กลับไปที่การตั้งค่าห้องแชต",
      ownedNotes: "โน้ตที่มี",
      userSettings: "การตั้งค่าผู้ใช้",
      memoryLog: "บันทึกความจำ",
      chatSettings: "ตั้งค่าสภาพแวดล้อมแชต",
      memory: "บทสนทนาที่ผ่านมา",
      pastConversations: "บทสนทนาที่ผ่านมา",
      memoryDescription:
        "ระบบจะสรุปบทสนทนาอัตโนมัติเพื่อให้ตัวละครจดจำได้นานขึ้น",
      memoryPlaceholder:
        "เขียนสิ่งที่คุณต้องการให้ตัวละครจดจำจากบทสนทนาที่ผ่านมา",
      memorySaveButton: "บันทึก",
      memorySavedToast: "บันทึกความจำระยะยาวแล้ว",
      persona: "Persona",
      userNote: "โน้ตผู้ใช้",
      assetGallery: "แกลเลอรีแอสเซ็ต",
      assetTotal: "ทั้งหมด  {count} รายการ",
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
      back: "Quay lại",
      openSettings: "Mở cài đặt phòng chat",
      close: "Đóng cài đặt phòng chat",
      backToSettings: "Quay lại cài đặt phòng chat",
      ownedNotes: "Ghi chú sở hữu",
      userSettings: "Cài đặt người dùng",
      memoryLog: "Nhật ký trí nhớ",
      chatSettings: "Cài đặt môi trường chat",
      memory: "Cuộc trò chuyện đã qua",
      pastConversations: "Cuộc trò chuyện đã qua",
      memoryDescription:
        "Cuộc trò chuyện được tự động tóm tắt để nhân vật có thể ghi nhớ lâu hơn.",
      memoryPlaceholder:
        "Hãy viết những điều bạn muốn nhân vật ghi nhớ từ các cuộc trò chuyện trước đây",
      memorySaveButton: "Lưu",
      memorySavedToast: "Đã lưu trí nhớ dài hạn",
      persona: "Persona",
      userNote: "Ghi chú người dùng",
      assetGallery: "Thư viện asset",
      assetTotal: "Tổng  {count}",
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
