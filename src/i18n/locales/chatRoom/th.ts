import type ko from "./ko";

const th: typeof ko = {
  chatRoom: {
    closedNotice:
      "ตัวละครถูกลบแล้ว จึงไม่สามารถแชตต่อได้ แต่ยังดูบทสนทนาเดิมได้",
    generatedNotice: "บทสนทนานี้สร้างโดย AI อาจไม่ตรงกับบุคคลหรือข้อเท็จจริงจริง",
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
      memoryTurn: "เทิร์น {turn}",
      editMemory: "แก้ไขความจำระยะยาว",
      memoryCancelButton: "ยกเลิก",
      memoryEmpty: "ยังไม่มีบทสนทนาที่จดจำไว้",
      persona: "Persona",
      userNote: "โน้ตผู้ใช้",
      assetGallery: "แกลเลอรีแอสเซ็ต",
      assetGalleryEmpty: "ยังไม่มีแอสเซ็ต",
      assetTotal: "ทั้งหมด  {count} รายการ",
      suggestedReply: "คำตอบแนะนำ",
      novelView: "อ่านแบบนิยาย",
      assetView: "แสดงแอสเซ็ต",
      assetLocked: "แอสเซ็ตที่ล็อกอยู่",
      backToAssetGallery: "กลับไปที่แกลเลอรีแอสเซ็ต",
      responseLength: "ความยาวคำตอบ",
      responseLengthShort: "สั้น",
      responseLengthMedium: "ปานกลาง",
      responseLengthLong: "ยาว",
      responseLengthShortDescription: "ประหยัดเครดิตและแชตกับตัวละครได้นานขึ้น",
      responseLengthMediumDescription: "สนทนากับตัวละครได้อย่างเป็นธรรมชาติ",
      responseLengthLongDescription: "คำตอบจะละเอียดและสมบูรณ์ยิ่งขึ้น",
      responseLengthNotice: "ใช้เครดิต {factor} เท่าของค่าบริการพื้นฐานของโมเดลที่เลือก คำตอบยิ่งยาวยิ่งใช้เครดิตมากขึ้น",
      responseLengthCustom: "คุณกำลังใช้ตัวคูณ x{multiplier} ที่ตั้งไว้ก่อนหน้า เลือกด้านล่างเพื่อเปลี่ยนเป็นความยาวนั้น",
      restartChat: "เริ่มบทสนทนาใหม่",
      leaveChat: "ออกจากห้องแชต",
    },
  },
};

export default th;
