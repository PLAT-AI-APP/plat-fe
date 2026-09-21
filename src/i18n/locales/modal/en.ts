import type ko from "./ko";

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
      infoPlaceholder: "Feel free to enter age, personality, and more.\n...",
      submitAdd: "Add",
      submitEdit: "Save",
    },
    profileEdit: {
      title: "Edit profile",
      changePassword: "Change password",
      submit: "Save",
      invalidType: "Only jpg, png, and webp image files are supported.",
      invalidSize: "File size must be 5MB or less.",
    },
    userNote: {
      title: "User note",
      description:
        "The conversation is summarized automatically so the character can remember it longer.",
      placeholder:
        "Important things not to forget, settings you want to add, etc.\n...",
      submit: "Save",
      successToast: "Your user note has been saved",
    },
    commentReport: {
      title: "What's wrong with {nickname}'s comment?",
      placeholder: "Please describe the reason in detail and we'll review it and take action.",
      submit: "Report",
      successToast: "Your report has been submitted",
    },
    passwordReset: {
      title: "Reset password",
      description: "You can reset your password through email verification.",
      next: "Next",
      submit: "Change password",
      successToast: "Your password has been changed.",
    },
    imageCrop: {
      title: "Edit image",
      description:
        "Adjust the square area that will be shown as the cover image.",
      dragGuide: "You can drag the image to adjust its position only.",
      zoom: "Zoom",
      cancel: "Cancel",
      apply: "Crop",
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
      emptyTitle: "No personas yet",
      emptyDescription: "Add a persona and set its role.",
      menuAria: "Open {name} persona menu",
    },
    follow: {
      followers: "Followers",
      following: "Following",
      fallbackNickname: "User",
      ownFollowersLine1: "To receive more follows,",
      ownFollowersHighlight: "create an attractive character",
      ownFollowersSuffix: ".",
      ownFollowersAction: "Create a character",
      ownFollowingLine1: "Find creators or characters you like,",
      ownFollowingHighlight: "and follow",
      ownFollowingSuffix: " them.",
      ownFollowingAction: "Explore characters",
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

export default en;
