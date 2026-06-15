import type { AppLocale } from "./config";

const ko = {
  studio: {
    worksCount: "작품목록 {count}",
    emptyTitle: "아직 캐릭터가 없어요",
    emptyDescription: "나만의 매력적인 AI 캐릭터를 만들어보세요",
    createTitle: "캐릭터 제작",
    createDescription: "나만의 캐릭터를 직접 만들고 공유해 보세요",
    createAction: "제작하기",
    stats: {
      characters: "캐릭터",
      chats: "채팅수",
      identity: "본인인증",
      adult: "성인인증",
      verified: "인증완료",
      unverified: "미인증",
    },
    profileImageAlt: "프로필 이미지",
    characterImageAlt: "{title} 대표 이미지",
    switchToGrid: "그리드 보기로 전환",
    switchToList: "리스트 보기로 전환",
  },
};

const en: typeof ko = {
  studio: {
    worksCount: "Works {count}",
    emptyTitle: "No characters yet",
    emptyDescription: "Create your own charming AI character",
    createTitle: "Create character",
    createDescription: "Build and share your own character",
    createAction: "Create",
    stats: {
      characters: "Characters",
      chats: "Chats",
      identity: "Identity verification",
      adult: "Adult verification",
      verified: "Verified",
      unverified: "Not verified",
    },
    profileImageAlt: "Profile image",
    characterImageAlt: "{title} cover image",
    switchToGrid: "Switch to grid view",
    switchToList: "Switch to list view",
  },
};

const ja: typeof ko = {
  studio: {
    worksCount: "作品リスト {count}",
    emptyTitle: "まだキャラクターがありません",
    emptyDescription: "自分だけの魅力的なAIキャラクターを作ってみましょう",
    createTitle: "キャラクター制作",
    createDescription: "自分だけのキャラクターを作って共有してみましょう",
    createAction: "作成する",
    stats: {
      characters: "キャラクター",
      chats: "チャット数",
      identity: "本人認証",
      adult: "成人認証",
      verified: "認証完了",
      unverified: "未認証",
    },
    profileImageAlt: "プロフィール画像",
    characterImageAlt: "{title} の代表画像",
    switchToGrid: "グリッド表示に切り替え",
    switchToList: "リスト表示に切り替え",
  },
};

const zh: typeof ko = {
  studio: {
    worksCount: "作品列表 {count}",
    emptyTitle: "还没有角色",
    emptyDescription: "创建属于你的迷人 AI 角色吧",
    createTitle: "创建角色",
    createDescription: "亲手创建并分享你的专属角色",
    createAction: "去创建",
    stats: {
      characters: "角色",
      chats: "聊天数",
      identity: "实名认证",
      adult: "成人认证",
      verified: "已认证",
      unverified: "未认证",
    },
    profileImageAlt: "个人资料图片",
    characterImageAlt: "{title} 代表图片",
    switchToGrid: "切换到网格视图",
    switchToList: "切换到列表视图",
  },
};

const th: typeof ko = {
  studio: {
    worksCount: "รายการผลงาน {count}",
    emptyTitle: "ยังไม่มีตัวละคร",
    emptyDescription: "ลองสร้างตัวละคร AI ที่มีเสน่ห์ในแบบของคุณดูสิ",
    createTitle: "สร้างตัวละคร",
    createDescription: "สร้างและแชร์ตัวละครของคุณด้วยตัวเอง",
    createAction: "เริ่มสร้าง",
    stats: {
      characters: "ตัวละคร",
      chats: "จำนวนแชต",
      identity: "ยืนยันตัวตน",
      adult: "ยืนยันอายุผู้ใหญ่",
      verified: "ยืนยันแล้ว",
      unverified: "ยังไม่ยืนยัน",
    },
    profileImageAlt: "รูปโปรไฟล์",
    characterImageAlt: "ภาพหลักของ {title}",
    switchToGrid: "สลับเป็นมุมมองกริด",
    switchToList: "สลับเป็นมุมมองรายการ",
  },
};

const vi: typeof ko = {
  studio: {
    worksCount: "Danh sách tác phẩm {count}",
    emptyTitle: "Vẫn chưa có nhân vật nào",
    emptyDescription: "Hãy tạo một nhân vật AI thật cuốn hút của riêng bạn",
    createTitle: "Tạo nhân vật",
    createDescription: "Tự tạo và chia sẻ nhân vật của riêng bạn",
    createAction: "Bắt đầu tạo",
    stats: {
      characters: "Nhân vật",
      chats: "Số cuộc trò chuyện",
      identity: "Xác minh danh tính",
      adult: "Xác minh độ tuổi trưởng thành",
      verified: "Đã xác minh",
      unverified: "Chưa xác minh",
    },
    profileImageAlt: "Ảnh hồ sơ",
    characterImageAlt: "Ảnh đại diện của {title}",
    switchToGrid: "Chuyển sang chế độ lưới",
    switchToList: "Chuyển sang chế độ danh sách",
  },
};

export const STUDIO_MESSAGES_BY_LOCALE: Record<AppLocale, typeof ko> = {
  ko,
  en,
  ja,
  zh,
  th,
  vi,
};
