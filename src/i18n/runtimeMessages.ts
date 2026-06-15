import type { AppLocale } from "./config";

const en = {
  sidebar: {
    home: "Home",
    myChatting: "My chats",
    studio: "Studio",
    navigation: "Sidebar menu",
    recentChats: "Recent chats",
  },
  footer: {
    menu: "Footer menu",
    about: "About",
    support: "Support",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    youth: "Youth Protection Policy",
    companyName: "Orbitlab Co., Ltd.",
    representative: "CEO Kim Seungwoo",
    registrationNumberLabel: "Business registration number",
    address:
      "707-A19, 707, 7F, 22 Harmony-ro 178beon-gil, Yeonsu-gu, Incheon",
    copyright: "© 2025 Wrtn. All rights reserved.",
  },
  searchBar: {
    placeholder: "Search by keyword",
    recentTitle: "Recent searches",
    clearAll: "Clear all",
    popularTitle: "Popular searches",
  },
  mainTabs: {
    navigation: "Character categories",
    home: "Home",
    ranking: "Ranking",
    new: "New",
    official: "Official",
    categories: "Categories",
  },
  ranking: {
    live: "Live",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    dailySortTime: "Updated every day at 12:00",
    weeklySortTime: "Updated every Monday",
    monthlySortTime: "Updated on the 1st of every month",
    liveSuffix: "as of",
  },
  withdrawalPage: {
    title: "Delete account",
    defaultMember: "Member",
    heading: "{nickname}, we'll miss you",
    description:
      "We're truly sorry to see you go. Before leaving PLAT, please make sure to review the information below.",
    notices: {
      dataDeleted:
        "All data and personal information will be deleted and cannot be recovered.",
      recordsRetained:
        "Order and transaction records are safely retained for a certain period.",
      creditsRemoved:
        "Unused credits are not refunded and will be removed together.",
      rejoinRestricted:
        "You cannot sign up again with the same email address for 7 days.",
      creationsDeleted:
        "Characters and worlds you created will all be deleted after withdrawal.",
      chatsReadOnly:
        "Existing chat rooms stay, but you won't be able to send new messages.",
    },
    legalNotice:
      "Payment, refund, and credit transaction records are not deleted immediately because the retention obligation (5 years) is required by applicable commerce and tax laws.",
    agreement: "I have checked everything written above.",
    back: "I need more time",
    submit: "Delete my account",
    submitPending: "Deleting account",
  },
  profile: {
    defaultName: "Name",
    moreMenu: "Open profile more menu",
    editProfile: "Edit profile",
    follow: "Follow",
    following: "Following",
    followers: "Followers",
    followingTab: "Following",
    chatCount: "Chats",
    characterTab: "Characters",
    worksList: "Works",
    sort: {
      latest: "Latest",
      chats: "Most chatted",
    },
  },
  notification: {
    title: "Notice",
    filters: {
      all: "All",
      notice: "Notice",
      update: "Update",
      event: "Event",
    },
  },
  tokenCharge: {
    title: "Token charge",
    myNote: "My notes",
    purchase: "Purchase products",
    noteUnit: "Notes",
    bonusNoteUnit: "Notes",
    priceUnit: "KRW",
    policiesTitle: "Refund policy and note usage guide",
    policies: {
      item1:
        "Refunds are not available for notes that have already been used. (Unused items can be refunded within 7 days of payment.)",
      item2:
        "Paid notes you purchase are valid for one year from the date you receive them.",
      item3:
        "Refunds are not available for subjective dissatisfaction with AI responses or a simple change of mind.",
      item4:
        "Refund requests and inquiries are available through the PLAT customer center.",
      item5:
        "Free promotional notes are excluded from refunds, and their validity period may differ depending on how they were provided.",
      item6:
        "Notes are automatically used starting with those closest to expiration.",
      item7:
        "If you need any other help, please contact the PLAT customer center.",
    },
    badges: {
      popular: "Popular",
      firstCharge: "First charge",
    },
  },
  myChatting: {
    title: "My chats",
  },
  fieldsExtra: {
    bioLabel: "Bio",
    bioPlaceholder: "Write a short introduction",
    accountLabel: "Account",
    genderLabel: "Gender",
    male: "Male",
    female: "Female",
  },
  chattingStart: {
    title: "Start chatting",
    personaLabel: "My persona",
    personaDescription:
      "Who are you in this conversation? Set your name, job, and defining traits.",
    change: "Change",
    personaValue: "Yuna",
    scenarioLabel: "Scenario",
    scenarioDescription:
      "What kind of theme would you like to start with? Pick one of the prepared scenarios.",
    submit: "Start",
  },
  chatUI: {
    modelSelect: "Select AI model",
    modelIcon: "{name} icon",
    coin: "coins",
    perChat: "chat",
    messageForm: "Message input form",
    messagePlaceholder: "Send a message",
    situation: "Situation",
    suggestedReply: "Suggested reply",
  },
  characterDetail: {
    noScenario: "No scenario has been registered.",
    chat: "Chat",
    followers: "Followers {count}",
    follow: "Follow",
    infoTitle: "Character info",
    collapse: "Collapse",
    expand: "Expand",
    comments: "Comments {count}",
    myProfileAlt: "My profile",
    commentPlaceholder: "Write a comment...",
    reply: "Reply",
    submit: "Post",
    creatorImageAlt: "Character creator image",
    mainImageAlt: "Main character image",
    scenarioTitle: "Scenario",
  },
  loading: {
    text: "Loading...",
  },
};

type RuntimeMessages = typeof en;

const ko: RuntimeMessages = {
  sidebar: {
    home: "홈",
    myChatting: "내 채팅",
    studio: "스튜디오",
    navigation: "사이드바 메뉴",
    recentChats: "최근 대화",
  },
  footer: {
    menu: "푸터 메뉴",
    about: "회사 소개",
    support: "고객센터",
    terms: "이용약관",
    privacy: "개인정보처리방침",
    youth: "청소년 보호정책",
    companyName: "(주)오비트랩",
    representative: "대표 김승우",
    registrationNumberLabel: "사업자등록번호",
    address: "인천광역시 연수구 하모니로178번길 22, 7층 707호 707-아19호",
    copyright: "© 2025 Wrtn. All rights reserved.",
  },
  searchBar: {
    placeholder: "검색어를 입력하세요",
    recentTitle: "최근 검색어",
    clearAll: "전체삭제",
    popularTitle: "인기 검색어",
  },
  mainTabs: {
    navigation: "캐릭터 카테고리",
    home: "홈",
    ranking: "랭킹",
    new: "신작",
    official: "공식",
    categories: "카테고리",
  },
  ranking: {
    live: "실시간",
    daily: "일간",
    weekly: "주간",
    monthly: "월간",
    dailySortTime: "매일 12시 집계",
    weeklySortTime: "매주 월요일 집계",
    monthlySortTime: "매달 1일 집계",
    liveSuffix: "기준",
  },
  withdrawalPage: {
    title: "회원탈퇴",
    defaultMember: "회원",
    heading: "{nickname}님과의 이별이 너무 아쉬워요",
    description:
      "헤어지게 되어 정말 아쉬워요. PLAT에서 탈퇴 전, 아래의 내용을 꼭 확인해 주세요",
    notices: {
      dataDeleted:
        "모든 데이터와 개인정보는 삭제되며 다시 찾을 수 없어요",
      recordsRetained:
        "주문과 거래 내역은 일정기간 동안 안전하게 보관돼요",
      creditsRemoved:
        "사용하지 않은 크레딧은 환불되지 않고 함께 지워져요",
      rejoinRestricted:
        "같은 이메일 주소로는 7일 동안 가입할 수 없어요",
      creationsDeleted:
        "직접 제작한 캐릭터와 세계관은 탈퇴 후 모두 지워져요",
      chatsReadOnly:
        "단, 기존 채팅방은 유지되며 신규 메세지는 전송할 수 없어요",
    },
    legalNotice:
      "결제·환불·크레딧 거래 기록은 「전자상거래법」·「국세기본법」 등에 따른 보관 의무(5년)가 있어 즉시 삭제되지 않습니다.",
    agreement: "위에 적힌 내용을 전부 확인했어요",
    back: "좀 더 생각할래요",
    submit: "탈퇴할게요",
    submitPending: "탈퇴 처리 중",
  },
  profile: {
    defaultName: "이름",
    moreMenu: "프로필 더보기 메뉴 열기",
    editProfile: "프로필 수정",
    follow: "팔로우",
    following: "팔로잉",
    followers: "팔로워",
    followingTab: "팔로잉",
    chatCount: "대화량",
    characterTab: "캐릭터",
    worksList: "작품 목록",
    sort: {
      latest: "최신순",
      chats: "채팅순",
    },
  },
  notification: {
    title: "공지사항",
    filters: {
      all: "전체",
      notice: "공지",
      update: "업데이트",
      event: "이벤트",
    },
  },
  tokenCharge: {
    title: "토큰 충전",
    myNote: "내 노트",
    purchase: "상품 구매",
    noteUnit: "노트",
    bonusNoteUnit: "노트",
    priceUnit: "원",
    policiesTitle: "환불 정책 및 노트 이용 안내",
    policies: {
      item1:
        "사용 이력이 있는 노트에 대해서는 환불이 불가능합니다. (단, 미사용 상품은 결제 후 7일 이내 환불 가능)",
      item2:
        "구매한 유료 노트의 유효기간은 획득 시점으로부터 1년입니다.",
      item3:
        "AI의 답변 결과에 대한 주관적인 불만족이나 단순 변심으로 인한 환불은 불가능합니다.",
      item4: "환불 요청 및 문의는 플랫 고객센터를 통해서 가능합니다.",
      item5:
        "무료로 제공된 노트는 환불 대상에서 제외되며, 유효기간은 지급 방식에 따라 다를 수 있습니다.",
      item6: "노트는 유효기간이 임박한 순서대로 자동으로 사용됩니다.",
      item7:
        "그 외 도움이 필요하신 점이 있다면 플랫 고객센터로 문의해 주세요.",
    },
    badges: {
      popular: "인기",
      firstCharge: "첫충전",
    },
  },
  myChatting: {
    title: "내 채팅",
  },
  fieldsExtra: {
    bioLabel: "소개글",
    bioPlaceholder: "소개글을 작성해주세요",
    accountLabel: "계정",
    genderLabel: "성별",
    male: "남자",
    female: "여자",
  },
  chattingStart: {
    title: "대화 시작하기",
    personaLabel: "내 페르소나",
    personaDescription:
      "대화 속에서 당신은 어떤 인물인가요? 당신의 이름, 직업, 특징을 설정해 보세요.",
    change: "변경",
    personaValue: "윤아",
    scenarioLabel: "시나리오",
    scenarioDescription:
      "어떤 테마로 대화를 시작할까요? 준비된 시나리오 중 하나를 골라보세요.",
    submit: "시작하기",
  },
  chatUI: {
    modelSelect: "AI 모델 선택",
    modelIcon: "{name} 아이콘",
    coin: "코인",
    perChat: "채팅",
    messageForm: "메시지 입력 양식",
    messagePlaceholder: "메시지 보내기",
    situation: "상황",
    suggestedReply: "추천답변",
  },
  characterDetail: {
    noScenario: "등록된 시나리오가 없습니다.",
    chat: "대화하기",
    followers: "팔로워 {count}",
    follow: "팔로우",
    infoTitle: "캐릭터 정보",
    collapse: "접기",
    expand: "펼치기",
    comments: "댓글 {count}개",
    myProfileAlt: "내 프로필",
    commentPlaceholder: "댓글을 입력하세요...",
    reply: "답글",
    submit: "등록",
    creatorImageAlt: "캐릭터 제작자 이미지",
    mainImageAlt: "메인 캐릭터 이미지",
    scenarioTitle: "시나리오",
  },
  loading: {
    text: "로딩중...",
  },
};

const ja: RuntimeMessages = {
  ...en,
  sidebar: {
    home: "ホーム",
    myChatting: "マイチャット",
    studio: "スタジオ",
    navigation: "サイドバーメニュー",
    recentChats: "最近の会話",
  },
  footer: {
    menu: "フッターメニュー",
    about: "会社紹介",
    support: "サポート",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    youth: "青少年保護方針",
    companyName: "Orbitlab Co., Ltd.",
    representative: "代表 キム・スンウ",
    registrationNumberLabel: "事業者登録番号",
    address:
      "仁川広域市 延寿区 ハーモニーロ178番キル 22, 7階 707号 707-A19号",
    copyright: "© 2025 Wrtn. All rights reserved.",
  },
  searchBar: {
    placeholder: "検索語を入力してください",
    recentTitle: "最近の検索語",
    clearAll: "すべて削除",
    popularTitle: "人気検索語",
  },
  mainTabs: {
    navigation: "キャラクターカテゴリ",
    home: "ホーム",
    ranking: "ランキング",
    new: "新作",
    official: "公式",
    categories: "カテゴリ",
  },
  ranking: {
    live: "リアルタイム",
    daily: "日間",
    weekly: "週間",
    monthly: "月間",
    dailySortTime: "毎日12時に集計",
    weeklySortTime: "毎週月曜日に集計",
    monthlySortTime: "毎月1日に集計",
    liveSuffix: "時点",
  },
  withdrawalPage: {
    title: "退会",
    defaultMember: "会員",
    heading: "{nickname}さんとの別れがとても寂しいです",
    description:
      "お別れするのが本当に残念です。PLATを退会する前に、以下の内容を必ず確認してください。",
    notices: {
      dataDeleted:
        "すべてのデータと個人情報は削除され、復元できません。",
      recordsRetained:
        "注文と取引履歴は一定期間安全に保管されます。",
      creditsRemoved:
        "未使用のクレジットは返金されず、一緒に削除されます。",
      rejoinRestricted:
        "同じメールアドレスでは7日間再登録できません。",
      creationsDeleted:
        "直接作成したキャラクターと世界観は退会後すべて削除されます。",
      chatsReadOnly:
        "既存のチャットルームは維持されますが、新しいメッセージは送信できません。",
    },
    legalNotice:
      "決済・返金・クレジット取引記録は、関連法令に基づく保管義務（5年）があるため、すぐには削除されません。",
    agreement: "上に記載された内容をすべて確認しました",
    back: "もう少し考えます",
    submit: "退会します",
    submitPending: "退会処理中",
  },
  profile: {
    defaultName: "名前",
    moreMenu: "プロフィールのその他メニューを開く",
    editProfile: "プロフィール編集",
    follow: "フォロー",
    following: "フォロー中",
    followers: "フォロワー",
    followingTab: "フォロー中",
    chatCount: "会話数",
    characterTab: "キャラクター",
    worksList: "作品一覧",
    sort: {
      latest: "最新順",
      chats: "チャット順",
    },
  },
  notification: {
    title: "お知らせ",
    filters: {
      all: "全体",
      notice: "お知らせ",
      update: "アップデート",
      event: "イベント",
    },
  },
  tokenCharge: {
    title: "トークンチャージ",
    myNote: "マイノート",
    purchase: "商品購入",
    noteUnit: "ノート",
    bonusNoteUnit: "ノート",
    priceUnit: "ウォン",
    policiesTitle: "返金ポリシーおよびノート利用案内",
    policies: {
      item1:
        "使用履歴のあるノートは返金できません。（未使用商品は決済後7日以内であれば返金可能）",
      item2:
        "購入した有料ノートの有効期間は獲得時点から1年です。",
      item3:
        "AIの回答結果に対する主観的な不満や単純な気変わりによる返金はできません。",
      item4:
        "返金のご要望やお問い合わせはPLATカスタマーセンターから可能です。",
      item5:
        "無料で提供されたノートは返金対象外であり、有効期間は付与方法によって異なる場合があります。",
      item6:
        "ノートは有効期限が近い順に自動で使用されます。",
      item7:
        "その他お困りのことがあれば、PLATカスタマーセンターまでお問い合わせください。",
    },
    badges: {
      popular: "人気",
      firstCharge: "初回チャージ",
    },
  },
  myChatting: {
    title: "マイチャット",
  },
  fieldsExtra: {
    bioLabel: "紹介文",
    bioPlaceholder: "紹介文を入力してください",
    accountLabel: "アカウント",
    genderLabel: "性別",
    male: "男性",
    female: "女性",
  },
  chattingStart: {
    title: "会話を始める",
    personaLabel: "マイペルソナ",
    personaDescription:
      "会話の中であなたはどんな人物ですか？名前、職業、特徴を設定してみましょう。",
    change: "変更",
    personaValue: "ユナ",
    scenarioLabel: "シナリオ",
    scenarioDescription:
      "どんなテーマで会話を始めますか？用意されたシナリオの中から一つ選んでください。",
    submit: "始める",
  },
  chatUI: {
    modelSelect: "AIモデル選択",
    modelIcon: "{name} アイコン",
    coin: "コイン",
    perChat: "チャット",
    messageForm: "メッセージ入力フォーム",
    messagePlaceholder: "メッセージを送信",
    situation: "状況",
    suggestedReply: "おすすめ返信",
  },
  characterDetail: {
    noScenario: "登録されたシナリオがありません。",
    chat: "会話する",
    followers: "フォロワー {count}",
    follow: "フォロー",
    infoTitle: "キャラクター情報",
    collapse: "閉じる",
    expand: "もっと見る",
    comments: "コメント {count}件",
    myProfileAlt: "自分のプロフィール",
    commentPlaceholder: "コメントを入力してください...",
    reply: "返信",
    submit: "登録",
    creatorImageAlt: "キャラクター制作者の画像",
    mainImageAlt: "メインキャラクター画像",
    scenarioTitle: "シナリオ",
  },
  loading: {
    text: "読み込み中...",
  },
};

const zh: RuntimeMessages = {
  ...en,
  sidebar: {
    home: "首页",
    myChatting: "我的聊天",
    studio: "工作室",
    navigation: "侧边栏菜单",
    recentChats: "最近对话",
  },
  footer: {
    menu: "页脚菜单",
    about: "公司介绍",
    support: "客服中心",
    terms: "使用条款",
    privacy: "隐私政策",
    youth: "青少年保护政策",
    companyName: "Orbitlab Co., Ltd.",
    representative: "代表 金承佑",
    registrationNumberLabel: "营业执照号码",
    address: "仁川广域市 延寿区 Harmony-ro178番街22号 7层707号 707-A19号",
    copyright: "© 2025 Wrtn. All rights reserved.",
  },
  searchBar: {
    placeholder: "请输入搜索词",
    recentTitle: "最近搜索词",
    clearAll: "全部删除",
    popularTitle: "热门搜索词",
  },
  mainTabs: {
    navigation: "角色分类",
    home: "首页",
    ranking: "排行",
    new: "新作",
    official: "官方",
    categories: "分类",
  },
  ranking: {
    live: "实时",
    daily: "日榜",
    weekly: "周榜",
    monthly: "月榜",
    dailySortTime: "每天12点统计",
    weeklySortTime: "每周一统计",
    monthlySortTime: "每月1日统计",
    liveSuffix: " 기준",
  },
  withdrawalPage: {
    title: "注销账号",
    defaultMember: "会员",
    heading: "真的很舍不得和 {nickname} 说再见",
    description:
      "真的很遗憾要分别了。在你离开 PLAT 前，请务必确认以下内容。",
    notices: {
      dataDeleted:
        "所有数据和个人信息都会被删除，无法再次找回。",
      recordsRetained:
        "订单和交易记录会在一定期间内安全保存。",
      creditsRemoved:
        "未使用的积分不会退款，并会一同删除。",
      rejoinRestricted:
        "同一邮箱地址在 7 天内无法再次注册。",
      creationsDeleted:
        "你亲自创建的角色和世界观在注销后都会被删除。",
      chatsReadOnly:
        "已有聊天室会保留，但无法再发送新消息。",
    },
    legalNotice:
      "支付、退款和积分交易记录因相关法规规定的保管义务（5年）而不会立即删除。",
    agreement: "我已确认以上全部内容",
    back: "我再想想",
    submit: "我要注销",
    submitPending: "正在处理注销",
  },
  profile: {
    defaultName: "姓名",
    moreMenu: "打开个人资料更多菜单",
    editProfile: "编辑资料",
    follow: "关注",
    following: "已关注",
    followers: "粉丝",
    followingTab: "关注中",
    chatCount: "对话量",
    characterTab: "角色",
    worksList: "作品列表",
    sort: {
      latest: "最新顺",
      chats: "聊天顺",
    },
  },
  notification: {
    title: "公告事项",
    filters: {
      all: "全部",
      notice: "公告",
      update: "更新",
      event: "活动",
    },
  },
  tokenCharge: {
    title: "代币充值",
    myNote: "我的笔记",
    purchase: "购买商品",
    noteUnit: "笔记",
    bonusNoteUnit: "笔记",
    priceUnit: "韩元",
    policiesTitle: "退款政策与笔记使用说明",
    policies: {
      item1:
        "已使用过的笔记无法退款。（未使用商品可在支付后7天内退款）",
      item2:
        "购买的付费笔记有效期为自获得之日起1年。",
      item3:
        "因对 AI 回答结果的主观不满或单纯变心而提出的退款无法受理。",
      item4:
        "退款申请及咨询可通过 PLAT 客服中心进行。",
      item5:
        "免费提供的笔记不在退款范围内，有效期可能因发放方式而异。",
      item6: "笔记会按照有效期临近的顺序自动使用。",
      item7: "如果还需要其他帮助，请联系 PLAT 客服中心。",
    },
    badges: {
      popular: "热门",
      firstCharge: "首充",
    },
  },
  myChatting: {
    title: "我的聊天",
  },
  fieldsExtra: {
    bioLabel: "简介",
    bioPlaceholder: "请填写简介",
    accountLabel: "账号",
    genderLabel: "性别",
    male: "男",
    female: "女",
  },
  chattingStart: {
    title: "开始对话",
    personaLabel: "我的人格",
    personaDescription:
      "在这段对话中你是什么样的人物？请设置你的名字、职业和特点。",
    change: "更改",
    personaValue: "允儿",
    scenarioLabel: "场景",
    scenarioDescription:
      "你想以什么主题开始对话？请从准备好的场景中选择一个。",
    submit: "开始",
  },
  chatUI: {
    modelSelect: "选择 AI 模型",
    modelIcon: "{name} 图标",
    coin: "金币",
    perChat: "聊天",
    messageForm: "消息输入表单",
    messagePlaceholder: "发送消息",
    situation: "情境",
    suggestedReply: "推荐回复",
  },
  characterDetail: {
    noScenario: "没有已注册的场景。",
    chat: "开始聊天",
    followers: "粉丝 {count}",
    follow: "关注",
    infoTitle: "角色信息",
    collapse: "收起",
    expand: "展开",
    comments: "评论 {count}条",
    myProfileAlt: "我的资料",
    commentPlaceholder: "请输入评论...",
    reply: "回复",
    submit: "提交",
    creatorImageAlt: "角色创作者图片",
    mainImageAlt: "主角色图片",
    scenarioTitle: "场景",
  },
  loading: {
    text: "加载中...",
  },
};

const th: RuntimeMessages = {
  ...en,
  sidebar: {
    home: "หน้าแรก",
    myChatting: "แชตของฉัน",
    studio: "สตูดิโอ",
    navigation: "เมนูแถบด้านข้าง",
    recentChats: "บทสนทนาล่าสุด",
  },
  footer: {
    menu: "เมนูท้ายหน้า",
    about: "เกี่ยวกับบริษัท",
    support: "ศูนย์ช่วยเหลือ",
    terms: "ข้อกำหนดการใช้งาน",
    privacy: "นโยบายความเป็นส่วนตัว",
    youth: "นโยบายคุ้มครองเยาวชน",
    companyName: "Orbitlab Co., Ltd.",
    representative: "ตัวแทน Kim Seungwoo",
    registrationNumberLabel: "เลขทะเบียนธุรกิจ",
    address:
      "707-A19, 707 ชั้น 7, 22 Harmony-ro 178beon-gil, Yeonsu-gu, Incheon",
    copyright: "© 2025 Wrtn. All rights reserved.",
  },
  searchBar: {
    placeholder: "กรอกคำค้นหา",
    recentTitle: "คำค้นหาล่าสุด",
    clearAll: "ลบทั้งหมด",
    popularTitle: "คำค้นหายอดนิยม",
  },
  mainTabs: {
    navigation: "หมวดหมู่ตัวละคร",
    home: "หน้าแรก",
    ranking: "อันดับ",
    new: "ใหม่",
    official: "ทางการ",
    categories: "หมวดหมู่",
  },
  ranking: {
    live: "เรียลไทม์",
    daily: "รายวัน",
    weekly: "รายสัปดาห์",
    monthly: "รายเดือน",
    dailySortTime: "อัปเดตทุกวันเวลา 12:00",
    weeklySortTime: "อัปเดตทุกวันจันทร์",
    monthlySortTime: "อัปเดตทุกวันที่ 1 ของเดือน",
    liveSuffix: "ณ เวลา",
  },
  withdrawalPage: {
    title: "ลบบัญชี",
    defaultMember: "สมาชิก",
    heading: "เราคงคิดถึง {nickname} มากแน่ ๆ",
    description:
      "น่าเสียดายมากที่ต้องจากกัน ก่อนออกจาก PLAT กรุณาตรวจสอบข้อมูลด้านล่างให้ครบถ้วน",
    notices: {
      dataDeleted:
        "ข้อมูลทั้งหมดและข้อมูลส่วนบุคคลจะถูกลบและไม่สามารถกู้คืนได้",
      recordsRetained:
        "ประวัติคำสั่งซื้อและธุรกรรมจะถูกเก็บรักษาอย่างปลอดภัยตามระยะเวลาที่กำหนด",
      creditsRemoved:
        "เครดิตที่ยังไม่ได้ใช้จะไม่สามารถขอคืนเงินและจะถูกลบไปพร้อมกัน",
      rejoinRestricted:
        "ไม่สามารถสมัครใหม่ด้วยอีเมลเดิมได้ภายใน 7 วัน",
      creationsDeleted:
        "ตัวละครและโลกที่คุณสร้างเองจะถูกลบทั้งหมดหลังจากลบบัญชี",
      chatsReadOnly:
        "ห้องแชตเดิมจะยังคงอยู่ แต่จะไม่สามารถส่งข้อความใหม่ได้",
    },
    legalNotice:
      "บันทึกการชำระเงิน การคืนเงิน และธุรกรรมเครดิตจะไม่ถูกลบทันที เนื่องจากมีภาระหน้าที่ในการเก็บรักษาตามกฎหมายที่เกี่ยวข้อง (5 ปี)",
    agreement: "ฉันได้ตรวจสอบเนื้อหาทั้งหมดด้านบนแล้ว",
    back: "ขอคิดดูก่อน",
    submit: "ฉันจะลบบัญชี",
    submitPending: "กำลังดำเนินการลบบัญชี",
  },
  profile: {
    defaultName: "ชื่อ",
    moreMenu: "เปิดเมนูเพิ่มเติมของโปรไฟล์",
    editProfile: "แก้ไขโปรไฟล์",
    follow: "ติดตาม",
    following: "กำลังติดตาม",
    followers: "ผู้ติดตาม",
    followingTab: "กำลังติดตาม",
    chatCount: "จำนวนบทสนทนา",
    characterTab: "ตัวละคร",
    worksList: "รายการผลงาน",
    sort: {
      latest: "ล่าสุด",
      chats: "ตามจำนวนแชต",
    },
  },
  notification: {
    title: "ประกาศ",
    filters: {
      all: "ทั้งหมด",
      notice: "ประกาศ",
      update: "อัปเดต",
      event: "อีเวนต์",
    },
  },
  tokenCharge: {
    title: "เติมโทเค็น",
    myNote: "โน้ตของฉัน",
    purchase: "ซื้อสินค้า",
    noteUnit: "โน้ต",
    bonusNoteUnit: "โน้ต",
    priceUnit: "วอน",
    policiesTitle: "นโยบายการคืนเงินและคู่มือการใช้งานโน้ต",
    policies: {
      item1:
        "ไม่สามารถขอคืนเงินสำหรับโน้ตที่มีประวัติการใช้งานแล้วได้ (สินค้าที่ไม่ได้ใช้สามารถขอคืนเงินได้ภายใน 7 วันหลังการชำระเงิน)",
      item2:
        "โน้ตแบบชำระเงินที่ซื้อมีอายุการใช้งาน 1 ปีนับจากวันที่ได้รับ",
      item3:
        "ไม่สามารถขอคืนเงินเนื่องจากความไม่พอใจเชิงอัตวิสัยต่อผลลัพธ์ของ AI หรือการเปลี่ยนใจทั่วไปได้",
      item4:
        "สามารถขอคืนเงินและสอบถามได้ผ่านศูนย์ลูกค้าของ PLAT",
      item5:
        "โน้ตที่แจกฟรีไม่อยู่ในรายการคืนเงิน และอายุการใช้งานอาจแตกต่างกันตามวิธีการแจก",
      item6:
        "โน้ตจะถูกใช้โดยอัตโนมัติตามลำดับที่ใกล้หมดอายุก่อน",
      item7:
        "หากต้องการความช่วยเหลือเพิ่มเติม โปรดติดต่อศูนย์ลูกค้าของ PLAT",
    },
    badges: {
      popular: "ยอดนิยม",
      firstCharge: "เติมครั้งแรก",
    },
  },
  myChatting: {
    title: "แชตของฉัน",
  },
  fieldsExtra: {
    bioLabel: "แนะนำตัว",
    bioPlaceholder: "กรุณาเขียนคำแนะนำตัว",
    accountLabel: "บัญชี",
    genderLabel: "เพศ",
    male: "ชาย",
    female: "หญิง",
  },
  chattingStart: {
    title: "เริ่มบทสนทนา",
    personaLabel: "เพอร์โซนาของฉัน",
    personaDescription:
      "ในบทสนทนานี้คุณเป็นคนแบบไหน? ลองตั้งชื่อ อาชีพ และลักษณะเด่นของคุณดู",
    change: "เปลี่ยน",
    personaValue: "ยุนอา",
    scenarioLabel: "สถานการณ์",
    scenarioDescription:
      "อยากเริ่มบทสนทนาด้วยธีมแบบไหน? เลือกหนึ่งในสถานการณ์ที่เตรียมไว้ได้เลย",
    submit: "เริ่ม",
  },
  chatUI: {
    modelSelect: "เลือกโมเดล AI",
    modelIcon: "ไอคอน {name}",
    coin: "เหรียญ",
    perChat: "แชต",
    messageForm: "แบบฟอร์มป้อนข้อความ",
    messagePlaceholder: "ส่งข้อความ",
    situation: "สถานการณ์",
    suggestedReply: "คำตอบแนะนำ",
  },
  characterDetail: {
    noScenario: "ยังไม่มีสถานการณ์ที่ลงทะเบียนไว้",
    chat: "เริ่มแชต",
    followers: "ผู้ติดตาม {count}",
    follow: "ติดตาม",
    infoTitle: "ข้อมูลตัวละคร",
    collapse: "ย่อ",
    expand: "ขยาย",
    comments: "ความคิดเห็น {count} รายการ",
    myProfileAlt: "โปรไฟล์ของฉัน",
    commentPlaceholder: "กรอกความคิดเห็น...",
    reply: "ตอบกลับ",
    submit: "ลงทะเบียน",
    creatorImageAlt: "รูปผู้สร้างตัวละคร",
    mainImageAlt: "รูปตัวละครหลัก",
    scenarioTitle: "สถานการณ์",
  },
  loading: {
    text: "กำลังโหลด...",
  },
};

const vi: RuntimeMessages = {
  ...en,
  sidebar: {
    home: "Trang chủ",
    myChatting: "Chat của tôi",
    studio: "Studio",
    navigation: "Menu thanh bên",
    recentChats: "Cuộc trò chuyện gần đây",
  },
  footer: {
    menu: "Menu chân trang",
    about: "Giới thiệu công ty",
    support: "Trung tâm hỗ trợ",
    terms: "Điều khoản sử dụng",
    privacy: "Chính sách quyền riêng tư",
    youth: "Chính sách bảo vệ thanh thiếu niên",
    companyName: "Orbitlab Co., Ltd.",
    representative: "Đại diện Kim Seungwoo",
    registrationNumberLabel: "Mã số doanh nghiệp",
    address:
      "707-A19, 707, tầng 7, 22 Harmony-ro 178beon-gil, Yeonsu-gu, Incheon",
    copyright: "© 2025 Wrtn. All rights reserved.",
  },
  searchBar: {
    placeholder: "Nhập từ khóa tìm kiếm",
    recentTitle: "Từ khóa tìm kiếm gần đây",
    clearAll: "Xóa tất cả",
    popularTitle: "Từ khóa phổ biến",
  },
  mainTabs: {
    navigation: "Danh mục nhân vật",
    home: "Trang chủ",
    ranking: "Xếp hạng",
    new: "Mới",
    official: "Chính thức",
    categories: "Danh mục",
  },
  ranking: {
    live: "Thời gian thực",
    daily: "Hằng ngày",
    weekly: "Hằng tuần",
    monthly: "Hằng tháng",
    dailySortTime: "Tổng hợp mỗi ngày lúc 12:00",
    weeklySortTime: "Tổng hợp mỗi thứ Hai",
    monthlySortTime: "Tổng hợp vào ngày 1 hằng tháng",
    liveSuffix: "theo thời điểm",
  },
  withdrawalPage: {
    title: "Xóa tài khoản",
    defaultMember: "Thành viên",
    heading: "Thật tiếc khi phải chia tay với {nickname}",
    description:
      "Chúng tôi thật sự rất tiếc khi phải chia tay. Trước khi rời PLAT, vui lòng kiểm tra kỹ nội dung bên dưới.",
    notices: {
      dataDeleted:
        "Tất cả dữ liệu và thông tin cá nhân sẽ bị xóa và không thể khôi phục.",
      recordsRetained:
        "Lịch sử đơn hàng và giao dịch sẽ được lưu trữ an toàn trong một thời gian nhất định.",
      creditsRemoved:
        "Credit chưa sử dụng sẽ không được hoàn tiền và sẽ bị xóa cùng lúc.",
      rejoinRestricted:
        "Bạn không thể đăng ký lại bằng cùng địa chỉ email trong 7 ngày.",
      creationsDeleted:
        "Nhân vật và thế giới bạn tự tạo sẽ bị xóa hoàn toàn sau khi rời đi.",
      chatsReadOnly:
        "Các phòng chat hiện có vẫn được giữ lại, nhưng bạn sẽ không thể gửi tin nhắn mới.",
    },
    legalNotice:
      "Lịch sử thanh toán, hoàn tiền và giao dịch credit sẽ không bị xóa ngay vì có nghĩa vụ lưu trữ theo quy định pháp luật liên quan (5 năm).",
    agreement: "Tôi đã kiểm tra toàn bộ nội dung ở trên",
    back: "Tôi muốn suy nghĩ thêm",
    submit: "Tôi sẽ xóa tài khoản",
    submitPending: "Đang xử lý xóa tài khoản",
  },
  profile: {
    defaultName: "Tên",
    moreMenu: "Mở thêm menu hồ sơ",
    editProfile: "Chỉnh sửa hồ sơ",
    follow: "Theo dõi",
    following: "Đang theo dõi",
    followers: "Người theo dõi",
    followingTab: "Đang theo dõi",
    chatCount: "Lượng trò chuyện",
    characterTab: "Nhân vật",
    worksList: "Danh sách tác phẩm",
    sort: {
      latest: "Mới nhất",
      chats: "Theo lượt chat",
    },
  },
  notification: {
    title: "Thông báo",
    filters: {
      all: "Tất cả",
      notice: "Thông báo",
      update: "Cập nhật",
      event: "Sự kiện",
    },
  },
  tokenCharge: {
    title: "Nạp token",
    myNote: "Note của tôi",
    purchase: "Mua sản phẩm",
    noteUnit: "Note",
    bonusNoteUnit: "Note",
    priceUnit: "won",
    policiesTitle: "Chính sách hoàn tiền và hướng dẫn sử dụng note",
    policies: {
      item1:
        "Không thể hoàn tiền cho note đã có lịch sử sử dụng. (Sản phẩm chưa sử dụng có thể được hoàn tiền trong vòng 7 ngày sau khi thanh toán)",
      item2:
        "Thời hạn sử dụng của note trả phí đã mua là 1 năm kể từ thời điểm nhận được.",
      item3:
        "Không thể hoàn tiền do không hài lòng mang tính chủ quan với kết quả trả lời của AI hoặc chỉ vì đổi ý.",
      item4:
        "Có thể yêu cầu hoàn tiền và gửi thắc mắc thông qua trung tâm khách hàng PLAT.",
      item5:
        "Note được cung cấp miễn phí không thuộc đối tượng hoàn tiền và thời hạn sử dụng có thể khác nhau tùy theo cách cấp phát.",
      item6:
        "Note sẽ được sử dụng tự động theo thứ tự sắp hết hạn trước.",
      item7:
        "Nếu bạn cần thêm hỗ trợ, vui lòng liên hệ trung tâm khách hàng PLAT.",
    },
    badges: {
      popular: "Phổ biến",
      firstCharge: "Nạp đầu",
    },
  },
  myChatting: {
    title: "Chat của tôi",
  },
  fieldsExtra: {
    bioLabel: "Giới thiệu",
    bioPlaceholder: "Hãy viết phần giới thiệu",
    accountLabel: "Tài khoản",
    genderLabel: "Giới tính",
    male: "Nam",
    female: "Nữ",
  },
  chattingStart: {
    title: "Bắt đầu trò chuyện",
    personaLabel: "Persona của tôi",
    personaDescription:
      "Trong cuộc trò chuyện này, bạn là người như thế nào? Hãy thiết lập tên, nghề nghiệp và đặc điểm của bạn.",
    change: "Thay đổi",
    personaValue: "Yuna",
    scenarioLabel: "Kịch bản",
    scenarioDescription:
      "Bạn muốn bắt đầu cuộc trò chuyện với chủ đề nào? Hãy chọn một trong các kịch bản đã chuẩn bị.",
    submit: "Bắt đầu",
  },
  chatUI: {
    modelSelect: "Chọn mô hình AI",
    modelIcon: "Biểu tượng {name}",
    coin: "coin",
    perChat: "chat",
    messageForm: "Biểu mẫu nhập tin nhắn",
    messagePlaceholder: "Gửi tin nhắn",
    situation: "Tình huống",
    suggestedReply: "Trả lời gợi ý",
  },
  characterDetail: {
    noScenario: "Không có kịch bản nào được đăng ký.",
    chat: "Trò chuyện",
    followers: "Người theo dõi {count}",
    follow: "Theo dõi",
    infoTitle: "Thông tin nhân vật",
    collapse: "Thu gọn",
    expand: "Mở rộng",
    comments: "{count} bình luận",
    myProfileAlt: "Hồ sơ của tôi",
    commentPlaceholder: "Nhập bình luận...",
    reply: "Trả lời",
    submit: "Đăng",
    creatorImageAlt: "Ảnh người tạo nhân vật",
    mainImageAlt: "Ảnh nhân vật chính",
    scenarioTitle: "Kịch bản",
  },
  loading: {
    text: "Đang tải...",
  },
};

export const RUNTIME_MESSAGES_BY_LOCALE: Record<AppLocale, RuntimeMessages> = {
  ko,
  en,
  ja,
  zh,
  th,
  vi,
};
