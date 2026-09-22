import type ko from "./ko";

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
    deleteSuccess: "ลบตัวละครแล้ว",
    deleteFailed: "ลบตัวละครไม่สำเร็จ กรุณาลองอีกครั้ง",
  },
};

export default th;
