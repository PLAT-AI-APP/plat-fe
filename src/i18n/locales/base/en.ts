import type ko from "./ko";

const en: typeof ko = {
  common: {
    confirm: "Confirm",
    cancel: "Cancel",
    optional: "(Optional)",
  },
  languages: {
    ko: "Korean",
    en: "English",
    ja: "Japanese",
    zh: "Chinese",
    th: "Thai",
    vi: "Vietnamese",
  },
  settings: {
    title: "Settings",
    sections: {
      environment: "Preferences",
      notifications: "Notifications & Content",
    },
    rows: {
      theme: "Theme",
      language: "Preferred language",
      blockedUsers: "Blocked users",
    },
    actions: {
      goToBlockedUsers: "Go to blocked users",
      withdrawal: "Delete account",
    },
  },
  auth: {
    login: {
      title: "Log in now\nand explore every service.",
      emailLabel: "Email",
      emailPlaceholder: "example@gmail.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot your password?",
      submit: "Log in",
      signupPrompt: "Not a member yet?",
      signupAction: "Sign up",
      socialKakao: "Continue with KakaoTalk",
      socialGoogle: "Continue with Google",
    },
    callback: {
      invalidAccess: "This is not a valid request.",
      processing: "Processing your sign-in...",
    },
    signup: {
      agreeAll: "Agree to all terms",
      termsOfService: "Agree to Terms of Service (required)",
      privacyPolicy: "Privacy Policy (required)",
      ageOver14: "I am 14 years old or older. (required)",
      title: "Sign up",
      subtitle: "A lineup of charming characters is waiting for you",
      submit: "Next",
    },
    emailVerification: {
      request: "Send code",
      resend: "Resend",
      change: "Change",
      requesting: "Sending",
      codeLabel: "Verification code",
      confirm: "Verify",
    },
    fields: {
      nicknameLabel: "Nickname",
      nicknamePlaceholder: "1-20 characters, no special symbols",
      passwordCheckLabel: "Confirm password",
      passwordCheckPlaceholder: "Enter your password again",
      birthLabel: "Birth date",
    },
  },
  dialog: {
    chatRestart: {
      title: "Start a new conversation?",
      description:
        "A new chat room with this character will be created,\nand you'll move to the new chat room.",
      cancel: "Cancel",
      confirm: "Restart",
    },
    chatLeave: {
      title: "Leave this chat room?",
      description:
        "The conversation you had with this character cannot be restored.",
      cancel: "Cancel",
      confirm: "Leave",
    },
    chatDelete: {
      title: "Delete this chat room?",
      description:
        "The conversation you had with this character cannot be restored.",
      cancel: "Cancel",
      confirm: "Delete",
    },
    loginRequired: {
      title: "Login is required",
      description: "This feature is available after logging in.",
      confirm: "Log in",
    },
    sessionExpired: {
      title: "Your session has expired",
      description: "Please log in again to continue.",
    },
    signupComplete: {
      greeting: "Hello {nickname},",
      title: "Your signup is complete",
      descriptionLine1: "For your privacy and safe access to the service,",
      descriptionLine2: "please log in with the account you just created.",
      confirm: "Log in",
      skip: "Maybe later",
    },
    welcomeCredit: {
      title: "Your welcome credit has arrived",
      descriptionBefore: "To support your first journey, ",
      descriptionHighlight: "we gifted you welcome note credits",
      descriptionAfter: "Are you ready to enjoy vivid conversations?",
      confirm: "OK",
    },
    commentDelete: {
      title: "Delete your comment?",
      description: "Deleting a comment also deletes its replies.",
      replyTitle: "Delete your reply?",
      replyDescription: "A deleted reply cannot be restored.",
    },
    personaDelete: {
      title: "Delete this persona?",
      description: " cannot be restored after deletion.",
      inUse: "A persona in use by a chat room cannot be deleted.",
      cancel: "Cancel",
      confirm: "Confirm",
    },
    userBlock: {
      title: "Block {nickname}?",
      description:
        "If you block this user, you won't be able to see their characters or join chats.",
      cancel: "Cancel",
      confirm: "Block",
    },
    draftOverwrite: {
      titleBefore: "Load the saved ",
      titleHighlight: "draft",
      titleAfter: "?",
      description: "Any unsaved data will be lost.",
    },
    draftSaveOverwrite: {
      titleBefore: "You already have a ",
      titleHighlight: "saved draft",
      titleAfter: "",
      description: "Saving now will overwrite its content.",
    },
    unsavedChanges: {
      title: "You have unsaved changes.",
      description: "If you leave now, your edits will not be saved.",
      confirm: "Leave",
    },
    withdrawalComplete: {
      title: "Thank you for being with us",
      descriptionLine1: "Thank you for spending time with PLAT.",
      descriptionLine2: "We hope to meet you again someday.",
      confirm: "OK",
    },
    withdrawalConfirm: {
      title: "Are you sure you want to leave?",
      descriptionLine1:
        "Once your withdrawal is complete, you won't be able to view your account information again.",
      descriptionLine2: "Would you still like to continue?",
      cancel: "Go back",
      confirm: "Delete account",
      confirmPending: "Deleting",
    },
  },
  field: {
    helper: {
      nickname: "Special characters are not allowed",
      nicknameWithDuplication:
        "It can't be duplicated and can't include special characters",
      emailDomain: "Use an email address ending in .com",
      password: "Include a special character and at least 8 characters",
      passwordCheck: "Enter the same password as above",
      bio: "Write a short introduction",
      birth: "Enter your birth date",
    },
    feedback: {
      nicknameAvailable: "Nice nickname",
      nicknameUnavailable: "This nickname is already taken",
      emailVerificationSent: "Check your inbox for the verification code",
      emailVerificationComplete: "Email verification is complete",
      emailVerificationExpired: "The time has expired",
      emailVerificationMismatch: "The verification code does not match",
      birthValid: "What a meaningful date. I'll remember it well",
      passwordCheckValid: "Confirmed",
    },
    error: {
      emailRequired: "Please enter your email.",
      emailInvalid: "This email format is invalid.",
      passwordRequired: "Please enter your password.",
      passwordCheckRequired: "Please confirm your password.",
      passwordInvalid:
        "Include a special character and enter at least 8 characters",
      passwordSpecialCharRequired:
        "Please use one of these special characters: !, @, #, $.",
      passwordMinLength: "It must be at least 8 characters long",
      passwordMismatch: "Please check your password one more time",
      nicknameRequired: "Please enter your nickname.",
      nicknameMaxLength: "Use a nickname within 20 characters",
      nicknameInvalid: "Special characters are not allowed",
      verificationCodeRequired: "Please enter the verification code.",
      verificationCodeLength: "The verification code must be 6 digits.",
      privacyRequired: "Please agree to the privacy policy.",
      termsRequired: "Please agree to the terms of service.",
      ageRequired: "Please agree to the age policy.",
      bioMaxLength: "Your bio can be up to 100 characters long",
      birthInvalid: "__BIRTH_INVALID_DATE__",
      birthFuture:
        "That date hasn't happened yet. Would you like to check it again?",
      userNoteRequired: "Please enter a user note.",
      userNoteMaxLength: "User notes can be up to 500 characters long",
      tagNameRequired: "Please enter a tag.",
      tagNameMaxLength: "Tags can be up to 10 characters long",
      opinionRequired: "Please enter your opinion.",
      opinionMaxLength: "Opinions can be up to 200 characters long",
      reportReasonRequired: "Please choose a reason.",
      reportDetailRequired: "Please describe the issue when choosing Other.",
      reportDetailMaxLength: "Details can be up to 500 characters long",
      personaNameRequired: "Please enter a name.",
      personaNameMaxLength: "Names can be up to 20 characters long",
      personaInfoMaxLength: "Info can be up to 200 characters long",
      representativeImageRequired: "Please upload a representative image.",
      characterProfileImageRequired: "Please upload a character profile image.",
      characterTitleRequired: "Please enter a title.",
      characterTitleMaxLength: "Titles can be up to 20 characters long",
      characterNameRequired: "Please enter the character name.",
      characterNameMaxLength: "Character names can be up to 20 characters long",
      characterIntroduceRequired: "Please enter a character introduction.",
      characterIntroduceMaxLength:
        "One-line intro can be up to 20 characters long",
      characterDetailSettingRequired:
        "Please enter the character detail settings.",
      characterDetailSettingMaxLength:
        "Detail settings can be up to 2000 characters long",
      assetNameRequired: "Please enter the asset name.",
      assetNameMaxLength: "Asset names can be up to 15 characters long",
      assetSituationRequired: "Please enter the asset situation.",
      assetSituationMaxLength:
        "Situation descriptions can be up to 50 characters long",
      assetMaxCount: "You can register up to 50 assets.",
      scenarioNameRequired: "Please enter the scenario name.",
      scenarioDescriptionMaxLength:
        "Scenario descriptions can be up to 100 characters long",
      scenarioContentRequired: "Please enter the content.",
      scenarioContentMaxLength: "Content can be up to 5000 characters long",
      scenarioContentTotalMaxLength:
        "The scenario's content can be up to 5000 characters combined",
      scenarioMaxCount: "You can create up to 5 scenarios.",
      characterDescriptionRequired: "Please enter a character description.",
      characterDescriptionMaxLength:
        "Character descriptions can be up to 1000 characters long",
      profileSituationRequired: "Please enter a situation description.",
      profileSituationMaxLength:
        "Prologue intro can be up to 2000 characters long.",
      tendencyRequired: "Please select a preference.",
      categoryRequired: "Please select a category.",
      tagRequired: "Please select at least one tag.",
      tagMaxCount: "You can register up to 5 tags.",
    },
  },
};

export default en;
