import type { AppLocale } from "./config";

const ko = {
  modalUi: {
    common: {
      close: "닫기",
      save: "저장",
      add: "추가",
      loading: "로딩 중..",
      loadingMore: "목록을 불러오는 중..",
      follow: "팔로우",
      following: "팔로잉",
      defaultBadge: "기본",
    },
    addLanguage: {
      title: "언어 추가",
      confirm: "추가",
    },
    personaAdd: {
      titleAdd: "페르소나 추가",
      titleEdit: "페르소나 수정",
      description:
        "페르소나로 설정한 역할에 맞춰 캐릭터와 대화할 수 있어요",
      nameLabel: "이름",
      namePlaceholder: "이름을 입력해 주세요",
      infoLabel: "정보",
      infoPlaceholder: "나이, 성격 등을 자유롭게 입력해 주세요\n...",
      submitAdd: "추가하기",
      submitEdit: "저장하기",
    },
    profileEdit: {
      title: "프로필 수정",
      changePassword: "비밀번호 변경",
      submit: "저장",
    },
    storage: {
      title: "장기기억",
      description:
        "대화내용이 자동으로 요약되어 캐릭터가 오래 기억할 수 있어요",
      placeholder: "장기기억을 생성하려면 더 많은 대화가 필요해요...",
      submit: "저장",
    },
    userNote: {
      title: "유저노트",
      description:
        "대화내용이 자동으로 요약되어 캐릭터가 오래 기억할 수 있어요",
      placeholder:
        "잊으면 안되는 중요한 내용, 추가하고 싶은 설정 등\n...",
      submit: "저장",
    },
    passwordReset: {
      title: "비밀번호 재설정",
      description: "이메일 인증을 통해 비밀번호를 재설정할 수 있습니다.",
      next: "다음",
      submit: "비밀번호 변경",
    },
    imageCrop: {
      title: "이미지 자르기",
      description: "비율을 선택하고 이미지를 드래그해 대표이미지 영역을 맞춰주세요.",
      dragGuide: "이미지를 드래그해 위치를 조정할 수 있어요",
      zoom: "확대",
      cancel: "취소",
      apply: "적용",
      ratios: {
        original: "원본 비율",
        square: "1:1",
        landscape: "4:3",
        portrait: "3:4",
        widescreen: "16:9",
      },
    },
    personaList: {
      title: "페르소나",
      description:
        "페르소나로 설정한 역할에 맞춰 캐릭터와 대화할 수 있어요",
      helper: "페르소나는 최대 5개까지 만들 수 있어요",
      add: "페르소나 추가",
      menuAria: "{name} 페르소나 메뉴 열기",
    },
    follow: {
      followers: "팔로워",
      following: "팔로잉",
      fallbackNickname: "유저",
      ownFollowersLine1: "많은 유저들의 팔로우를 받을 수 있게",
      ownFollowersHighlight: "매력적인 캐릭터를 시작",
      ownFollowersSuffix: "해볼까?",
      ownFollowersAction: "캐릭터를 시작하기",
      ownFollowingLine1: "관심있는 크리에이터를 팔로우할 수 있게",
      ownFollowingHighlight: "취향에 맞는 캐릭터를 둘러",
      ownFollowingSuffix: "볼까?",
      ownFollowingAction: "캐릭터 둘러보기",
      otherFollowersLine1: "아직, {nickname}의",
      otherFollowersLine2: "팔로워가 없어요",
      otherFollowingLine1: "아직, {nickname}이",
      otherFollowingLine2: "팔로우한 유저가 없어요",
      otherTitle: "내가 먼저 팔로우 걸어볼까?",
      otherAction: "팔로우",
      profileImageAlt: "{nickname} 프로필 이미지",
    },
  },
};

const en: typeof ko = {
  modalUi: {
    common: {
      close: "Close",
      save: "Save",
      add: "Add",
      loading: "Loading..",
      loadingMore: "Loading more..",
      follow: "Follow",
      following: "Following",
      defaultBadge: "Default",
    },
    addLanguage: {
      title: "Add language",
      confirm: "Add",
    },
    personaAdd: {
      titleAdd: "Add persona",
      titleEdit: "Edit persona",
      description:
        "You can talk with the character according to the role set in the persona.",
      nameLabel: "Name",
      namePlaceholder: "Please enter a name",
      infoLabel: "Info",
      infoPlaceholder:
        "Feel free to enter age, personality, and more.\n...",
      submitAdd: "Add",
      submitEdit: "Save",
    },
    profileEdit: {
      title: "Edit profile",
      changePassword: "Change password",
      submit: "Save",
    },
    storage: {
      title: "Long-term memory",
      description:
        "The conversation is summarized automatically so the character can remember it longer.",
      placeholder:
        "You need more conversation before long-term memory can be created...",
      submit: "Save",
    },
    userNote: {
      title: "User note",
      description:
        "The conversation is summarized automatically so the character can remember it longer.",
      placeholder:
        "Important things not to forget, settings you want to add, etc.\n...",
      submit: "Save",
    },
    passwordReset: {
      title: "Reset password",
      description: "You can reset your password through email verification.",
      next: "Next",
      submit: "Change password",
    },
    imageCrop: {
      title: "Crop image",
      description: "Choose a ratio and drag the image to fit the cover area.",
      dragGuide: "Drag the image to adjust its position.",
      zoom: "Zoom",
      cancel: "Cancel",
      apply: "Apply",
      ratios: {
        original: "Original",
        square: "1:1",
        landscape: "4:3",
        portrait: "3:4",
        widescreen: "16:9",
      },
    },
    personaList: {
      title: "Persona",
      description:
        "You can talk with the character according to the role set in the persona.",
      helper: "You can create up to 5 personas.",
      add: "Add persona",
      menuAria: "Open {name} persona menu",
    },
    follow: {
      followers: "Followers",
      following: "Following",
      fallbackNickname: "User",
      ownFollowersLine1: "To receive more follows,",
      ownFollowersHighlight: "start an attractive character",
      ownFollowersSuffix: ".",
      ownFollowersAction: "Create a character",
      ownFollowingLine1: "To follow creators you like,",
      ownFollowingHighlight: "browse characters that match",
      ownFollowingSuffix: " your taste.",
      ownFollowingAction: "Browse characters",
      otherFollowersLine1: "{nickname} doesn't have",
      otherFollowersLine2: "any followers yet",
      otherFollowingLine1: "{nickname} hasn't",
      otherFollowingLine2: "followed anyone yet",
      otherTitle: "Want to follow first?",
      otherAction: "Follow",
      profileImageAlt: "{nickname} profile image",
    },
  },
};

const ja: typeof ko = {
  modalUi: {
    common: {
      close: "閉じる",
      save: "保存",
      add: "追加",
      loading: "読み込み中..",
      loadingMore: "一覧を読み込み中..",
      follow: "フォロー",
      following: "フォロー中",
      defaultBadge: "基本",
    },
    addLanguage: {
      title: "言語を追加",
      confirm: "追加",
    },
    personaAdd: {
      titleAdd: "ペルソナを追加",
      titleEdit: "ペルソナを修正",
      description:
        "ペルソナに設定した役割に合わせてキャラクターと会話できます。",
      nameLabel: "名前",
      namePlaceholder: "名前を入力してください",
      infoLabel: "情報",
      infoPlaceholder: "年齢や性格などを自由に入力してください\n...",
      submitAdd: "追加する",
      submitEdit: "保存する",
    },
    profileEdit: {
      title: "プロフィール修正",
      changePassword: "パスワード変更",
      submit: "保存",
    },
    storage: {
      title: "長期記憶",
      description:
        "会話内容が自動で要約され、キャラクターが長く記憶できます。",
      placeholder:
        "長期記憶を作るには、もう少し会話が必要です...",
      submit: "保存",
    },
    userNote: {
      title: "ユーザーノート",
      description:
        "会話内容が自動で要約され、キャラクターが長く記憶できます。",
      placeholder:
        "忘れてはいけない大事な内容、追加したい設定など\n...",
      submit: "保存",
    },
    passwordReset: {
      title: "パスワード再設定",
      description: "メール認証を通してパスワードを再設定できます。",
      next: "次へ",
      submit: "パスワード変更",
    },
    imageCrop: {
      title: "画像を切り抜く",
      description:
        "比率を選んで画像をドラッグし、代表画像の範囲を合わせてください。",
      dragGuide: "画像をドラッグして位置を調整できます。",
      zoom: "拡大",
      cancel: "キャンセル",
      apply: "適用",
      ratios: {
        original: "元の比率",
        square: "1:1",
        landscape: "4:3",
        portrait: "3:4",
        widescreen: "16:9",
      },
    },
    personaList: {
      title: "ペルソナ",
      description:
        "ペルソナに設定した役割に合わせてキャラクターと会話できます。",
      helper: "ペルソナは最大5個まで作成できます。",
      add: "ペルソナ追加",
      menuAria: "{name} ペルソナメニューを開く",
    },
    follow: {
      followers: "フォロワー",
      following: "フォロー中",
      fallbackNickname: "ユーザー",
      ownFollowersLine1: "たくさんのユーザーに",
      ownFollowersHighlight: "魅力的なキャラクターを始めて",
      ownFollowersSuffix: "みよう",
      ownFollowersAction: "キャラクターを始める",
      ownFollowingLine1: "気になるクリエイターをフォローできるように",
      ownFollowingHighlight: "好みに合うキャラクターを",
      ownFollowingSuffix: "見てみよう",
      ownFollowingAction: "キャラクターを見る",
      otherFollowersLine1: "まだ {nickname} には",
      otherFollowersLine2: "フォロワーがいません",
      otherFollowingLine1: "まだ {nickname} は",
      otherFollowingLine2: "誰もフォローしていません",
      otherTitle: "先にフォローしてみますか？",
      otherAction: "フォロー",
      profileImageAlt: "{nickname} のプロフィール画像",
    },
  },
};

const zh: typeof ko = {
  modalUi: {
    common: {
      close: "关闭",
      save: "保存",
      add: "添加",
      loading: "加载中..",
      loadingMore: "正在加载列表..",
      follow: "关注",
      following: "已关注",
      defaultBadge: "默认",
    },
    addLanguage: {
      title: "添加语言",
      confirm: "添加",
    },
    personaAdd: {
      titleAdd: "添加 Persona",
      titleEdit: "编辑 Persona",
      description: "你可以根据 Persona 中设定的角色与角色聊天。",
      nameLabel: "名称",
      namePlaceholder: "请输入名称",
      infoLabel: "信息",
      infoPlaceholder: "请自由输入年龄、性格等信息\n...",
      submitAdd: "添加",
      submitEdit: "保存",
    },
    profileEdit: {
      title: "编辑个人资料",
      changePassword: "修改密码",
      submit: "保存",
    },
    storage: {
      title: "长期记忆",
      description: "对话内容会自动总结，角色可以记住更久。",
      placeholder: "需要更多对话后才能生成长期记忆...",
      submit: "保存",
    },
    userNote: {
      title: "用户笔记",
      description: "对话内容会自动总结，角色可以记住更久。",
      placeholder: "不要忘记的重要内容、想追加的设定等\n...",
      submit: "保存",
    },
    passwordReset: {
      title: "重设密码",
      description: "你可以通过邮箱验证来重设密码。",
      next: "下一步",
      submit: "修改密码",
    },
    imageCrop: {
      title: "裁剪图片",
      description: "请选择比例并拖动图片，使其适配代表图片区域。",
      dragGuide: "可以拖动图片来调整位置。",
      zoom: "缩放",
      cancel: "取消",
      apply: "应用",
      ratios: {
        original: "原始比例",
        square: "1:1",
        landscape: "4:3",
        portrait: "3:4",
        widescreen: "16:9",
      },
    },
    personaList: {
      title: "Persona",
      description: "你可以根据 Persona 中设定的角色与角色聊天。",
      helper: "最多可以创建 5 个 Persona。",
      add: "添加 Persona",
      menuAria: "打开 {name} 的 Persona 菜单",
    },
    follow: {
      followers: "粉丝",
      following: "关注中",
      fallbackNickname: "用户",
      ownFollowersLine1: "为了获得更多关注，",
      ownFollowersHighlight: "创建一个有魅力的角色",
      ownFollowersSuffix: "吧",
      ownFollowersAction: "创建角色",
      ownFollowingLine1: "为了关注感兴趣的创作者，",
      ownFollowingHighlight: "去看看符合你喜好的角色",
      ownFollowingSuffix: "吧",
      ownFollowingAction: "浏览角色",
      otherFollowersLine1: "{nickname} 还没有",
      otherFollowersLine2: "任何粉丝",
      otherFollowingLine1: "{nickname} 还没有",
      otherFollowingLine2: "关注任何人",
      otherTitle: "要不要先关注一下？",
      otherAction: "关注",
      profileImageAlt: "{nickname} 的头像",
    },
  },
};

const th: typeof ko = {
  modalUi: {
    common: {
      close: "ปิด",
      save: "บันทึก",
      add: "เพิ่ม",
      loading: "กำลังโหลด..",
      loadingMore: "กำลังโหลดรายการ..",
      follow: "ติดตาม",
      following: "กำลังติดตาม",
      defaultBadge: "ค่าเริ่มต้น",
    },
    addLanguage: {
      title: "เพิ่มภาษา",
      confirm: "เพิ่ม",
    },
    personaAdd: {
      titleAdd: "เพิ่ม Persona",
      titleEdit: "แก้ไข Persona",
      description: "คุณสามารถคุยกับตัวละครตามบทบาทที่ตั้งไว้ใน Persona ได้",
      nameLabel: "ชื่อ",
      namePlaceholder: "กรุณากรอกชื่อ",
      infoLabel: "ข้อมูล",
      infoPlaceholder: "กรอกอายุ นิสัย และข้อมูลอื่น ๆ ได้อย่างอิสระ\n...",
      submitAdd: "เพิ่ม",
      submitEdit: "บันทึก",
    },
    profileEdit: {
      title: "แก้ไขโปรไฟล์",
      changePassword: "เปลี่ยนรหัสผ่าน",
      submit: "บันทึก",
    },
    storage: {
      title: "ความทรงจำระยะยาว",
      description:
        "บทสนทนาจะถูกสรุปอัตโนมัติ เพื่อให้ตัวละครจดจำได้ยาวนานขึ้น",
      placeholder:
        "ต้องมีบทสนทนาเพิ่มอีกเล็กน้อยจึงจะสร้างความทรงจำระยะยาวได้...",
      submit: "บันทึก",
    },
    userNote: {
      title: "โน้ตผู้ใช้",
      description:
        "บทสนทนาจะถูกสรุปอัตโนมัติ เพื่อให้ตัวละครจดจำได้ยาวนานขึ้น",
      placeholder:
        "เรื่องสำคัญที่ห้ามลืม หรือการตั้งค่าที่อยากเพิ่ม\n...",
      submit: "บันทึก",
    },
    passwordReset: {
      title: "รีเซ็ตรหัสผ่าน",
      description: "คุณสามารถรีเซ็ตรหัสผ่านผ่านการยืนยันอีเมลได้",
      next: "ถัดไป",
      submit: "เปลี่ยนรหัสผ่าน",
    },
    imageCrop: {
      title: "ครอปรูปภาพ",
      description: "เลือกสัดส่วนและลากรูปภาพเพื่อจัดกรอบภาพตัวแทน",
      dragGuide: "คุณสามารถลากรูปภาพเพื่อปรับตำแหน่งได้",
      zoom: "ซูม",
      cancel: "ยกเลิก",
      apply: "นำไปใช้",
      ratios: {
        original: "อัตราส่วนเดิม",
        square: "1:1",
        landscape: "4:3",
        portrait: "3:4",
        widescreen: "16:9",
      },
    },
    personaList: {
      title: "Persona",
      description: "คุณสามารถคุยกับตัวละครตามบทบาทที่ตั้งไว้ใน Persona ได้",
      helper: "คุณสามารถสร้าง Persona ได้สูงสุด 5 รายการ",
      add: "เพิ่ม Persona",
      menuAria: "เปิดเมนู Persona ของ {name}",
    },
    follow: {
      followers: "ผู้ติดตาม",
      following: "กำลังติดตาม",
      fallbackNickname: "ผู้ใช้",
      ownFollowersLine1: "เพื่อให้มีผู้ติดตามมากขึ้น",
      ownFollowersHighlight: "ลองเริ่มต้นตัวละครที่น่าสนใจ",
      ownFollowersSuffix: "กันไหม",
      ownFollowersAction: "เริ่มสร้างตัวละคร",
      ownFollowingLine1: "เพื่อให้ติดตามครีเอเตอร์ที่สนใจได้",
      ownFollowingHighlight: "ลองดูตัวละครที่ตรงกับรสนิยม",
      ownFollowingSuffix: "ของคุณ",
      ownFollowingAction: "ดูตัวละคร",
      otherFollowersLine1: "ตอนนี้ {nickname} ยังไม่มี",
      otherFollowersLine2: "ผู้ติดตามเลย",
      otherFollowingLine1: "ตอนนี้ {nickname} ยังไม่ได้",
      otherFollowingLine2: "ติดตามใครเลย",
      otherTitle: "อยากเป็นคนแรกที่ติดตามไหม",
      otherAction: "ติดตาม",
      profileImageAlt: "รูปโปรไฟล์ของ {nickname}",
    },
  },
};

const vi: typeof ko = {
  modalUi: {
    common: {
      close: "Đóng",
      save: "Lưu",
      add: "Thêm",
      loading: "Đang tải..",
      loadingMore: "Đang tải danh sách..",
      follow: "Theo dõi",
      following: "Đang theo dõi",
      defaultBadge: "Mặc định",
    },
    addLanguage: {
      title: "Thêm ngôn ngữ",
      confirm: "Thêm",
    },
    personaAdd: {
      titleAdd: "Thêm Persona",
      titleEdit: "Chỉnh sửa Persona",
      description:
        "Bạn có thể trò chuyện với nhân vật theo vai trò được đặt trong Persona.",
      nameLabel: "Tên",
      namePlaceholder: "Vui lòng nhập tên",
      infoLabel: "Thông tin",
      infoPlaceholder:
        "Hãy nhập tuổi, tính cách và các thông tin khác một cách tự do.\n...",
      submitAdd: "Thêm",
      submitEdit: "Lưu",
    },
    profileEdit: {
      title: "Chỉnh sửa hồ sơ",
      changePassword: "Đổi mật khẩu",
      submit: "Lưu",
    },
    storage: {
      title: "Ký ức dài hạn",
      description:
        "Nội dung trò chuyện được tóm tắt tự động để nhân vật ghi nhớ lâu hơn.",
      placeholder:
        "Cần thêm nhiều cuộc trò chuyện hơn để tạo ký ức dài hạn...",
      submit: "Lưu",
    },
    userNote: {
      title: "Ghi chú người dùng",
      description:
        "Nội dung trò chuyện được tóm tắt tự động để nhân vật ghi nhớ lâu hơn.",
      placeholder:
        "Những nội dung quan trọng không được quên, các thiết lập muốn thêm\n...",
      submit: "Lưu",
    },
    passwordReset: {
      title: "Đặt lại mật khẩu",
      description: "Bạn có thể đặt lại mật khẩu thông qua xác thực email.",
      next: "Tiếp theo",
      submit: "Đổi mật khẩu",
    },
    imageCrop: {
      title: "Cắt ảnh",
      description: "Chọn tỷ lệ và kéo ảnh để căn vùng ảnh đại diện.",
      dragGuide: "Bạn có thể kéo ảnh để điều chỉnh vị trí.",
      zoom: "Thu phóng",
      cancel: "Hủy",
      apply: "Áp dụng",
      ratios: {
        original: "Tỷ lệ gốc",
        square: "1:1",
        landscape: "4:3",
        portrait: "3:4",
        widescreen: "16:9",
      },
    },
    personaList: {
      title: "Persona",
      description:
        "Bạn có thể trò chuyện với nhân vật theo vai trò được đặt trong Persona.",
      helper: "Bạn có thể tạo tối đa 5 Persona.",
      add: "Thêm Persona",
      menuAria: "Mở menu Persona của {name}",
    },
    follow: {
      followers: "Người theo dõi",
      following: "Đang theo dõi",
      fallbackNickname: "Người dùng",
      ownFollowersLine1: "Để nhận được nhiều lượt theo dõi hơn,",
      ownFollowersHighlight: "hãy bắt đầu một nhân vật thật cuốn hút",
      ownFollowersSuffix: ".",
      ownFollowersAction: "Tạo nhân vật",
      ownFollowingLine1: "Để theo dõi những creator bạn quan tâm,",
      ownFollowingHighlight: "hãy xem các nhân vật hợp gu",
      ownFollowingSuffix: ".",
      ownFollowingAction: "Xem nhân vật",
      otherFollowersLine1: "{nickname} vẫn chưa có",
      otherFollowersLine2: "người theo dõi nào",
      otherFollowingLine1: "{nickname} vẫn chưa",
      otherFollowingLine2: "theo dõi ai cả",
      otherTitle: "Bạn muốn theo dõi trước không?",
      otherAction: "Theo dõi",
      profileImageAlt: "Ảnh hồ sơ của {nickname}",
    },
  },
};

export const MODAL_MESSAGES_BY_LOCALE: Record<AppLocale, typeof ko> = {
  ko,
  en,
  ja,
  zh,
  th,
  vi,
};
