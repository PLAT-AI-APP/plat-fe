import type {
  DocsBreadcrumb,
  DocsGroupChild,
  DocsGroupResponse,
  DocsHomeResponse,
  DocsLocale,
  DocsPageResponse,
  DocsSearchResponse,
  DocsTreeNode,
  DocsTreeResponse,
} from "./types";
import { DOCS_LOCALES, DOCS_SEARCH_MAX_LENGTH } from "./types";

/*
 * 가이드 문서 목업 원본.
 *
 * 관리자 모델(그룹·페이지 + 언어별 번역 + 상태) 그대로 들고 있다가, 공개 API 계약의 노출 규칙을 적용해
 * 응답을 만든다. 브라우저의 MSW 핸들러(src/mocks/handlers/docs.ts)와, MSW 가 잡지 못하는 서버 컴포넌트의
 * 목업 모드 데이터 레이어(src/api/docs/server.ts)가 같은 함수를 쓴다.
 */

interface MockGroup {
  id: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
  status: "VISIBLE" | "HIDDEN";
  coverImageUrl: string | null;
  translations: Partial<Record<DocsLocale, { name: string; description: string | null }>>;
}

interface MockPage {
  id: string;
  groupId: string;
  slug: string;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN";
  updatedAt: string;
  translations: Partial<
    Record<DocsLocale, { title: string; summary: string | null; content: string }>
  >;
}

const image = (seed: string, width = 960, height = 540) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

const GROUPS: MockGroup[] = [
  {
    id: "1",
    parentId: null,
    slug: "user-guide",
    sortOrder: 1,
    status: "VISIBLE",
    coverImageUrl: image("plat-docs-user", 1200, 520),
    translations: {
      ko: { name: "유저 가이드", description: "캐릭터와 대화하는 유저를 위한 안내" },
      en: { name: "User Guide", description: "For users who chat with characters" },
    },
  },
  {
    id: "2",
    parentId: "1",
    slug: "getting-started",
    sortOrder: 1,
    status: "VISIBLE",
    coverImageUrl: null,
    translations: {
      ko: { name: "PLAT 시작하기", description: "가입부터 첫 대화까지" },
      en: { name: "Getting Started", description: "From sign-up to your first chat" },
    },
  },
  {
    id: "3",
    parentId: "2",
    slug: "account",
    sortOrder: 2,
    status: "VISIBLE",
    coverImageUrl: null,
    translations: {
      ko: { name: "계정 관리", description: "로그인·프로필·탈퇴" },
      en: { name: "Account", description: "Sign-in, profile and withdrawal" },
    },
  },
  {
    id: "4",
    parentId: "1",
    slug: "payment",
    sortOrder: 2,
    status: "VISIBLE",
    coverImageUrl: image("plat-docs-payment", 1200, 520),
    translations: {
      ko: { name: "노트 충전과 환불", description: "결제 수단·충전·환불 안내" },
    },
  },
  {
    id: "5",
    parentId: null,
    slug: "creator-guide",
    sortOrder: 2,
    status: "VISIBLE",
    coverImageUrl: null,
    translations: {
      ko: { name: "제작자 가이드", description: "캐릭터를 만드는 제작자를 위한 안내" },
      en: { name: "Creator Guide", description: "For creators who build characters" },
    },
  },
  {
    id: "6",
    parentId: null,
    slug: "policy",
    sortOrder: 3,
    status: "VISIBLE",
    coverImageUrl: null,
    translations: {
      ko: {
        name: "정책 및 약관",
        description: "서비스 이용약관 · 개인정보처리방침 · 청소년 보호정책 · 커뮤니티 가이드라인",
      },
    },
  },
  {
    id: "7",
    parentId: null,
    slug: "internal",
    sortOrder: 4,
    status: "HIDDEN",
    coverImageUrl: null,
    translations: { ko: { name: "숨긴 그룹", description: null } },
  },
];

const FIRST_CHAT_KO = `PLAT 에서는 마음에 드는 캐릭터를 골라 바로 대화를 시작할 수 있어요.

![캐릭터 둘러보기 화면](${image("plat-docs-explore")})

## 캐릭터 고르기

홈 화면의 **추천**, **랭킹** 탭에서 캐릭터를 둘러보세요. 해시태그로 원하는 장르만 골라 볼 수도 있습니다.

- 캐릭터 카드를 누르면 상세 화면으로 이동해요.
- 상세 화면에서 소개·시나리오·댓글을 확인할 수 있어요.

### 시나리오 선택

캐릭터에 따라 여러 시나리오가 준비되어 있어요. 시나리오마다 첫 장면과 분위기가 달라요.

## 대화 시작하기

**대화하기** 버튼을 누르면 채팅방이 열립니다.

> 대화에는 노트가 사용돼요. 남은 노트는 상단 헤더에서 확인할 수 있어요.

### 대화가 마음에 들지 않을 때

답변 아래 **다시 생성** 버튼으로 다른 답변을 받아 볼 수 있어요.

| 기능 | 설명 |
| --- | --- |
| 다시 생성 | 같은 질문에 새 답변을 받습니다 |
| 수정 | 내가 보낸 메시지를 고칩니다 |

## 다음 단계

[노트 충전하기](#)도 함께 읽어 보세요.
`;

const FIRST_CHAT_EN = `On PLAT you can pick a character you like and start chatting right away.

![Browsing characters](${image("plat-docs-explore")})

## Choosing a character

Browse characters in the **For you** and **Ranking** tabs on the home screen.

- Tap a character card to open its details.
- The detail screen shows the intro, scenarios and comments.

### Picking a scenario

Each scenario has its own opening scene and mood.

## Starting a chat

Tap **Chat** to open a chat room.

> Chatting uses notes. You can see your balance in the header.
`;

const PAGES: MockPage[] = [
  {
    id: "10",
    groupId: "2",
    slug: "first-chat",
    sortOrder: 1,
    status: "PUBLISHED",
    updatedAt: "2026-10-10T03:00:00Z",
    translations: {
      ko: { title: "첫 대화하기", summary: "캐릭터를 골라 첫 대화를 시작하는 방법", content: FIRST_CHAT_KO },
      en: { title: "Your first chat", summary: "How to pick a character and start chatting", content: FIRST_CHAT_EN },
    },
  },
  {
    id: "11",
    groupId: "3",
    slug: "sign-in",
    sortOrder: 1,
    status: "PUBLISHED",
    updatedAt: "2026-10-09T03:00:00Z",
    translations: {
      ko: {
        title: "로그인 방법",
        summary: "카카오·구글 계정으로 로그인하는 방법",
        content: `## 소셜 로그인\n\n카카오 또는 구글 계정으로 로그인할 수 있어요.\n\n![로그인 화면](${image("plat-docs-login", 720, 480)})\n\n## 로그인이 안 될 때\n\n1. 브라우저의 쿠키 차단 설정을 확인해 주세요.\n2. 다른 계정으로 로그인되어 있지 않은지 확인해 주세요.\n`,
      },
      en: {
        title: "Signing in",
        summary: "Sign in with Kakao or Google",
        content: "## Social sign-in\n\nYou can sign in with Kakao or Google.\n\n## Trouble signing in\n\n1. Check that cookies are allowed.\n2. Make sure you are not signed in with another account.\n",
      },
    },
  },
  {
    id: "12",
    groupId: "3",
    slug: "withdrawal",
    sortOrder: 2,
    status: "PUBLISHED",
    updatedAt: "2026-10-08T03:00:00Z",
    translations: {
      ko: {
        title: "회원 탈퇴",
        summary: "탈퇴 절차와 탈퇴 후 남는 정보",
        content: "## 탈퇴 절차\n\n설정 > 계정 > **회원 탈퇴**에서 진행할 수 있어요.\n\n## 남는 정보\n\n결제·환불 기록은 관련 법령에 따라 보관됩니다.\n",
      },
    },
  },
  {
    id: "13",
    groupId: "2",
    slug: "profile",
    sortOrder: 3,
    status: "PUBLISHED",
    updatedAt: "2026-10-07T03:00:00Z",
    translations: {
      ko: { title: "프로필 꾸미기", summary: "닉네임·프로필 사진·페르소나 설정", content: "## 닉네임 바꾸기\n\n프로필 화면에서 연필 아이콘을 누르세요.\n\n## 페르소나\n\n대화할 때 캐릭터가 나를 어떻게 부를지 정할 수 있어요.\n" },
      en: { title: "Your profile", summary: "Nickname, photo and persona", content: "## Changing your nickname\n\nTap the pencil icon on your profile.\n\n## Persona\n\nChoose how characters address you.\n" },
    },
  },
  {
    id: "14",
    groupId: "2",
    slug: "draft-page",
    sortOrder: 4,
    status: "DRAFT",
    updatedAt: "2026-10-07T03:00:00Z",
    translations: { ko: { title: "작성 중인 글", summary: null, content: "비공개" } },
  },
  {
    id: "20",
    groupId: "4",
    slug: "charge-notes",
    sortOrder: 1,
    status: "PUBLISHED",
    updatedAt: "2026-10-06T03:00:00Z",
    translations: {
      ko: { title: "노트 충전하기", summary: "결제 수단과 충전 방법을 알려드립니다.", content: "## 결제 수단\n\n카드, 간편결제(카카오페이·토스페이)를 쓸 수 있어요.\n\n## 충전 방법\n\n헤더의 노트 잔액을 누르면 충전 화면으로 이동해요.\n" },
    },
  },
  {
    id: "21",
    groupId: "4",
    slug: "refund",
    sortOrder: 2,
    status: "PUBLISHED",
    updatedAt: "2026-10-05T03:00:00Z",
    translations: {
      ko: { title: "결제 취소 및 환불", summary: "환불 신청 방법과 환불 기준", content: "## 환불 기준\n\n사용하지 않은 노트는 결제 후 7일 안에 환불을 신청할 수 있어요.\n\n## 신청 방법\n\n고객센터 > 1:1 문의에서 신청해 주세요.\n" },
    },
  },
  {
    id: "30",
    groupId: "5",
    slug: "create-character",
    sortOrder: 1,
    status: "PUBLISHED",
    updatedAt: "2026-10-04T03:00:00Z",
    translations: {
      ko: { title: "캐릭터 만들기", summary: "나만의 캐릭터를 만드는 순서", content: "## 기본 정보\n\n이름·소개·이미지를 입력하세요.\n\n## 시나리오\n\n첫 장면과 상황을 적어 주세요.\n\n### 좋은 첫 장면 쓰기\n\n짧고 구체적일수록 좋아요.\n" },
      en: { title: "Creating a character", summary: "Steps to build your own character", content: "## Basics\n\nEnter a name, intro and image.\n\n## Scenario\n\nDescribe the opening scene.\n" },
    },
  },
  {
    id: "31",
    groupId: "5",
    slug: "earnings",
    sortOrder: 2,
    status: "PUBLISHED",
    updatedAt: "2026-10-03T03:00:00Z",
    translations: {
      ko: { title: "수익 정산", summary: "제작자 수익이 쌓이고 정산되는 방식", content: "## 수익 계산\n\n내 캐릭터와 나눈 대화에서 수익이 쌓여요.\n\n## 정산 신청\n\n수익 화면에서 정산을 신청할 수 있어요.\n" },
    },
  },
  {
    id: "40",
    groupId: "6",
    slug: "community-guideline",
    sortOrder: 1,
    status: "PUBLISHED",
    updatedAt: "2026-10-02T03:00:00Z",
    translations: {
      ko: { title: "커뮤니티 가이드라인", summary: "모두가 즐겁게 이용하기 위한 약속", content: "## 금지 행위\n\n- 타인을 비방하는 콘텐츠\n- 불법 콘텐츠\n\n## 신고\n\n문제가 있는 콘텐츠는 신고해 주세요.\n" },
    },
  },
  {
    id: "41",
    groupId: "7",
    slug: "hidden",
    sortOrder: 1,
    status: "PUBLISHED",
    updatedAt: "2026-10-02T03:00:00Z",
    translations: { ko: { title: "숨긴 그룹의 글", summary: null, content: "보이면 안 됨" } },
  },
];

const groupById = new Map(GROUPS.map((group) => [group.id, group]));

const ancestorsOf = (groupId: string): MockGroup[] => {
  const chain: MockGroup[] = [];
  let current = groupById.get(groupId);
  while (current) {
    chain.unshift(current);
    current = current.parentId ? groupById.get(current.parentId) : undefined;
  }
  return chain;
};

/** 그룹 자신과 조상이 모두 VISIBLE 이고 그 언어 번역이 있는지. */
const isGroupChainOpen = (groupId: string, locale: DocsLocale) =>
  ancestorsOf(groupId).every(
    (group) => group.status === "VISIBLE" && Boolean(group.translations[locale]),
  );

const isPagePublic = (page: MockPage, locale: DocsLocale) =>
  page.status === "PUBLISHED" &&
  Boolean(page.translations[locale]) &&
  isGroupChainOpen(page.groupId, locale);

/** 그룹 아래(손자 포함) 공개 페이지 수. */
const publicPageCount = (groupId: string, locale: DocsLocale): number =>
  PAGES.filter((page) => page.groupId === groupId && isPagePublic(page, locale)).length +
  GROUPS.filter((group) => group.parentId === groupId).reduce(
    (sum, group) => sum + publicPageCount(group.id, locale),
    0,
  );

const isGroupPublic = (group: MockGroup, locale: DocsLocale) =>
  isGroupChainOpen(group.id, locale) && publicPageCount(group.id, locale) > 0;

const sortedChildren = (groupId: string | null) =>
  [
    ...GROUPS.filter((group) => group.parentId === groupId).map((group) => ({
      kind: "GROUP" as const,
      group,
      sortOrder: group.sortOrder,
    })),
    ...(groupId === null
      ? []
      : PAGES.filter((page) => page.groupId === groupId).map((page) => ({
          kind: "PAGE" as const,
          page,
          sortOrder: page.sortOrder,
        }))),
  ].sort((a, b) => a.sortOrder - b.sortOrder);

const breadcrumbsOf = (groupId: string, locale: DocsLocale): DocsBreadcrumb[] =>
  ancestorsOf(groupId).map((group) => ({
    id: group.id,
    slug: group.slug,
    name: group.translations[locale]?.name ?? "",
  }));

const buildTreeNodes = (groupId: string | null, locale: DocsLocale): DocsTreeNode[] =>
  sortedChildren(groupId).flatMap((entry): DocsTreeNode[] => {
    if (entry.kind === "GROUP") {
      if (!isGroupPublic(entry.group, locale)) return [];
      return [
        {
          type: "GROUP",
          id: entry.group.id,
          slug: entry.group.slug,
          name: entry.group.translations[locale]?.name ?? "",
          children: buildTreeNodes(entry.group.id, locale),
        },
      ];
    }
    if (!isPagePublic(entry.page, locale)) return [];
    return [
      {
        type: "PAGE",
        id: entry.page.id,
        slug: entry.page.slug,
        title: entry.page.translations[locale]?.title ?? "",
        children: [],
      },
    ];
  });

export const mockDocsTree = (locale: DocsLocale): DocsTreeResponse => ({
  items: buildTreeNodes(null, locale),
});

export const mockDocsHome = (locale: DocsLocale): DocsHomeResponse => ({
  groups: sortedChildren(null).flatMap((entry) => {
    if (entry.kind !== "GROUP" || !isGroupPublic(entry.group, locale)) return [];
    const translation = entry.group.translations[locale];
    return [
      {
        id: entry.group.id,
        slug: entry.group.slug,
        name: translation?.name ?? "",
        description: translation?.description ?? null,
        iconUrl: null,
        coverImageUrl: entry.group.coverImageUrl,
        pageCount: publicPageCount(entry.group.id, locale),
      },
    ];
  }),
});

/** 공개되지 않은 그룹이면 null(= 404). */
export const mockDocsGroup = (
  locale: DocsLocale,
  groupId: string,
): DocsGroupResponse | null => {
  const group = groupById.get(groupId);
  if (!group || !isGroupPublic(group, locale)) return null;
  const translation = group.translations[locale];

  const children = sortedChildren(group.id).flatMap((entry): DocsGroupChild[] => {
    if (entry.kind === "GROUP") {
      if (!isGroupPublic(entry.group, locale)) return [];
      const child = entry.group.translations[locale];
      return [
        {
          type: "GROUP",
          id: entry.group.id,
          slug: entry.group.slug,
          name: child?.name ?? "",
          description: child?.description ?? null,
          coverImageUrl: entry.group.coverImageUrl,
          pageCount: publicPageCount(entry.group.id, locale),
        },
      ];
    }
    if (!isPagePublic(entry.page, locale)) return [];
    const page = entry.page.translations[locale];
    return [
      {
        type: "PAGE",
        id: entry.page.id,
        slug: entry.page.slug,
        title: page?.title ?? "",
        summary: page?.summary ?? null,
      },
    ];
  });

  return {
    id: group.id,
    slug: group.slug,
    name: translation?.name ?? "",
    description: translation?.description ?? null,
    iconUrl: null,
    coverImageUrl: group.coverImageUrl,
    breadcrumbs: breadcrumbsOf(group.id, locale).slice(0, -1),
    children,
    availableLocales: DOCS_LOCALES.filter((candidate) => isGroupPublic(group, candidate)),
  };
};

/** 공개되지 않은 페이지면 null(= 404). */
export const mockDocsPage = (
  locale: DocsLocale,
  pageId: string,
): DocsPageResponse | null => {
  const page = PAGES.find((candidate) => candidate.id === pageId);
  if (!page || !isPagePublic(page, locale)) return null;
  const translation = page.translations[locale]!;

  return {
    id: page.id,
    slug: page.slug,
    title: translation.title,
    summary: translation.summary,
    content: translation.content,
    updatedAt: page.updatedAt,
    groupId: page.groupId,
    breadcrumbs: breadcrumbsOf(page.groupId, locale),
    availableLocales: DOCS_LOCALES.filter((candidate) => isPagePublic(page, candidate)),
  };
};

/** 계약: q 공백 제거 후 1~50자, 최대 20건, 제목 일치 우선. 범위를 벗어나면 빈 결과로 둔다. */
export const mockDocsSearch = (locale: DocsLocale, rawQuery: string): DocsSearchResponse => {
  const query = rawQuery.trim().toLowerCase();
  if (!query || query.length > DOCS_SEARCH_MAX_LENGTH) return { items: [] };

  const matches = PAGES.filter((page) => isPagePublic(page, locale)).flatMap((page) => {
    const translation = page.translations[locale]!;
    const inTitle = translation.title.toLowerCase().includes(query);
    const inBody =
      (translation.summary ?? "").toLowerCase().includes(query) ||
      translation.content.toLowerCase().includes(query);
    if (!inTitle && !inBody) return [];
    return [
      {
        rank: inTitle ? 0 : 1,
        item: {
          id: page.id,
          slug: page.slug,
          title: translation.title,
          summary: translation.summary,
          groupName: groupById.get(page.groupId)?.translations[locale]?.name ?? "",
        },
      },
    ];
  });

  return {
    items: matches
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 20)
      .map(({ item }) => item),
  };
};
