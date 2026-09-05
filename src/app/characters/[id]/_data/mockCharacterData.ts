import type { CharacterDetail, CharacterScenario } from "@/type/character";

export const mockCharacterScenarios: CharacterScenario[] = [
  {
    scenarioId: "scenario-1",
    name: "First Encounter",
    description: "A quiet first meeting after class.",
    situation: "The hallway is empty, and the character speaks first.",
    firstDialogue: "You are still here? I thought everyone had left.",
    lang: "EN",
    contents: [
      {
        id: "scenario-1-action-1",
        type: "action",
        value:
          "The classroom lights flicker softly while footsteps fade beyond the door.",
      },
      {
        id: "scenario-1-chat-1",
        type: "chat",
        value: "You are still here? I thought everyone had left.",
      },
      {
        id: "scenario-1-asset-1",
        type: "asset",
        value: "/images/sample.png",
      },
    ],
  },
  {
    scenarioId: "scenario-2",
    name: "Rainy Shortcut",
    description: "A shared walk through a narrow street in the rain.",
    situation: "The character offers an umbrella before the rain gets heavier.",
    firstDialogue: "Come closer. You will get soaked walking like that.",
    lang: "EN",
    contents: [
      {
        id: "scenario-2-action-1",
        type: "action",
        value:
          "Rain gathers along the curb, reflecting small signs and passing headlights.",
      },
      {
        id: "scenario-2-chat-1",
        type: "chat",
        value: "Come closer. You will get soaked walking like that.",
      },
    ],
  },
];

const mockCharacterDetail: CharacterDetail = {
  characterId: "1",
  title: "Archive Room Friend",
  introduce: "A calm character who always notices what others miss.",
  prologue:
    "An ordinary school archive room becomes the start of a strange but gentle story. The character speaks lightly, but remembers details that everyone else forgets.",
  characterDescription:
    "This character is direct, observant, and quietly warm. They tend to hide concern behind dry remarks, then show up exactly when the user needs them.",
  chatCount: 235,
  likeCount: 0,
  liked: false,
  tags: ["daily", "mystery", "school", "friend"],
  isOfficial: true,
  images: [
    {
      id: "preview-1",
      url: "https://picsum.photos/seed/plat-character-preview-1/640/640",
    },
    {
      id: "preview-2",
      url: "https://picsum.photos/seed/plat-character-preview-2/640/640",
    },
    {
      id: "preview-3",
      url: "https://picsum.photos/seed/plat-character-preview-3/640/640",
    },
  ],
  mainImage: "https://picsum.photos/seed/plat-character-preview-1/640/640",
  profileImage: "/p1.png",
  createdAt: "26.06.15",
  updatedAt: "26.06.19",
  creator: {
    id: "creator-1",
    nickname: "@plat_creator",
    profileImage: "/p1.png",
    followingCount: 24,
    isFollowing: true,
  },
  scenarios: mockCharacterScenarios,
  comments: [
    {
      id: "comment-1",
      authorName: "Creator",
      authorImage: "/p1.png",
      content:
        "The first scenario and character settings have been adjusted for local preview.",
      createdAt: "2 days ago",
      isCreator: true,
    },
    {
      id: "comment-2",
      authorName: "@reader",
      authorImage: "/p1.png",
      content: "The setup is easy to read and the scenario flow feels natural.",
      createdAt: "17 hours ago",
    },
  ],
};

export const getMockCharacterScenarios = (characterId: string) => {
  void characterId;

  return mockCharacterScenarios;
};

export const getMockCharacterDetail = (
  characterId: string,
): CharacterDetail => ({
  ...mockCharacterDetail,
  characterId,
});
