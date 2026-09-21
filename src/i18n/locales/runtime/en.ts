const en = {
  /*
   * 화면에 보이지 않는 페이지 제목(h1).
   * 해당 화면에 시각적 제목이 따로 없는 페이지에서, 문서 구조상 최상위
   * 제목을 만들어 주기 위한 문구다.
   */
  pageTitles: {
    siteDefault: "PLAT | Your own AI persona platform",
    characterCreate: "Create a character",
    characterDetail: "Character info",
    chattingRoom: "Chatting",
    profile: "Profile",
    studio: "Studio",
    authCallback: "Verifying...",
    home: "Explore characters",
    search: "Search",
    usageHistory: "Usage history",
  },
  errorPage: {
    notFound: "We couldn't find the page you requested.",
    backHome: "Back to home",
    title: "Something went wrong",
    description: "Please try again in a moment. If it keeps happening, refresh the page.",
    retry: "Try again",
  },
  toast: {
    imageTypeInvalid: "Only JPG, PNG, or WEBP images are allowed.",
    imageSizeExceeded: "Files can be up to 5MB.",
    characterDeleted: "The character was deleted.",
    characterDeleteFailed: "Could not delete the character. Please try again.",
    characterUpdated: "The character was updated.",
    transactionIdCopied: "Transaction ID copied.",
  },
  headerAccount: {
    label: "Account",
  },
  state: {
    retry: "Try again",
    loadFailed: "Could not load this section.",
    loadMoreFailed: "Could not load more.",
    empty: "Nothing to show yet.",
  },
  sidebar: {
    home: "Home",
    myChatting: "My chats",
    characterCreate: "Create character",
    noteCharge: "Charge notes",
    navigation: "Sidebar menu",
    toggle: "Fold or expand sidebar",
    close: "Close sidebar",
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
    address: "707-A19, 707, 7F, 22 Harmony-ro 178beon-gil, Yeonsu-gu, Incheon",
    copyright: "© 2025 Wrtn. All rights reserved.",
  },
  searchBar: {
    placeholder: "Search by keyword",
    recentTitle: "Recent searches",
    clearAll: "Clear all",
    popularTitle: "Popular searches",
  },
  searchLanding: {
    liveSearchTitle: "Live popular searches",
    popularCharactersTitle: "Characters people have searched recently",
    viewAllRanking: "View full ranking",
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
    updatedAt: "As of {datetime}:00",
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
    unfollow: "Unfollow",
    followers: "Followers",
    followingTab: "Following",
    chatCount: "Chats",
    characterTab: "Characters",
    wishTab: "Wishlist",
    worksList: "Works",
    sort: {
      latest: "Latest",
      chats: "Most chatted",
    },
    wishEmpty: {
      caption: "No characters you like yet?",
      title: "Explore to find the perfect character for you",
      searchTag: "Search by tag",
    },
  },
  notification: {
    title: "Notice",
    filters: {
      all: "All",
      service: "Notice",
      update: "Update",
      event: "Event",
      maintenance: "Maintenance",
      policy: "Policy",
    },
    empty: "No notices have been posted yet.",
    emptyFiltered: "No notices in this category.",
    backToList: "Back to list",
    viewCount: "{count} views",
  },
  tokenCharge: {
    title: "Token charge",
    payment: {
      redirecting: "Redirecting to the payment page…",
      confirming: "Confirming your payment…",
      success: "{credits} notes have been added.",
      granting: "Payment complete. Your notes will arrive shortly.",
      cancelled: "The payment was cancelled.",
      failed: "The payment failed. Please try again.",
      backToCharge: "Back to token charge",
      delayed: "Payment confirmation is taking longer than usual. If the payment went through, your notes will be added automatically.",
      successTitle: "Charge complete!",
      balanceLabel: "Current balance",
      goExplore: "Meet characters",
    },
    myNote: "My notes",
    viewUsageHistory: "History",
    purchase: "Purchase products",
    loadFailed: "Failed to load products. Please try again.",
    empty: "No products available for purchase.",
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
    searchPlaceholder: "Search by chat, character, or persona name",
    clearSearch: "Clear search",
    title: "My chats",
    empty: "No chats yet.",
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
    personaPlaceholder: "Choose a persona",
    personaChange: "Change",
    scenarioLabel: "Scenario",
    scenarioDescription:
      "What kind of theme would you like to start with? Pick one of the prepared scenarios.",
    submit: "Start",
    submitting: "Starting...",
  },
  chatUI: {
    sampleReply1Quote: "Yeah, I'll close it right away. It's okay, no one can see.",
    sampleReply1Narration: "I quickly shut the door and locked it again.",
    sampleReply2Quote: "Wait, it's safer to stay here for now.",
    sampleReply2Narration: "I took a small breath, then carefully caught their wrist.",
    sampleReply3Quote: "I'm sorry. I never thought we'd run into each other like this.",
    sampleReply3Narration: "Avoiding their gaze, I went on in a low voice.",
    modelSelect: "Select AI model",
    modelIcon: "{name} icon",
    coin: "coins",
    free: "Free",
    modelPrice: "{price} coins",
    perChat: "chat",
    messageForm: "Message input form",
    messagePlaceholder: "Send a message",
    situation: "Situation",
    suggestedReply: "Suggested reply",
    deleteResponse: "Delete response",
    retryResponse: "Regenerate response",
    selectedSuggestedReply: "Selected suggested reply",
    characterTyping: "{name} is typing",
    characterProfileAlt: "{name} profile image",
    chatAssetAlt: "Chat scene image",
    gemini31Description:
      "The latest AI model with improved performance and expression.",
    gemini30Description:
      "The latest AI model for more immersive conversations.",
    gemini25Description:
      "A high-performance AI model suited for long conversations.",
    claudeOpus46Description:
      "A premium model offering top-tier intelligence and creative dialogue.",
    claudeSonnet46Description:
      "An advanced model for natural and creative conversations.",
    gemini3FlashDescription:
      "A model with fast replies and a wide knowledge base.",
    gpt51Description:
      "A model strong in emotional nuance and delicate expression.",
    freeDescription:
      "A safe conversation model with balanced speed and understanding.",
  },
  characterDetail: {
    editCharacter: "Edit",
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
    commentAuthorProfileAlt: "{name}'s profile image",
    viewMore: "View more",
  },
  apiError: {
    default: "We couldn't process your request.",
    network: "Please check your network connection.",
    timeout: "The server took too long to respond, so the request was cancelled.",
    nicknameCheckInvalid: "We couldn't read the nickname availability response.",
    loginTokenMissing: "The login response did not include a token.",
    chatNoResponse: "We didn't receive a chat response.",
    personaDetailInvalid: "We couldn't read the persona details response.",
  },
  loading: {
    text: "Loading...",
  },
};

export default en;
