import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";
import type {
  CreateRoomRequest,
  PromptMultiplier,
  Room,
  RoomLanguage,
  RoomMessage,
  ThumbnailRoom,
} from "@/type/room";
import { PROMPT_MULTIPLIERS } from "@/type/room";

export interface MockRoom {
  roomId: string;
  universeId: string;
  personaId: string;
  title: string;
  thumbnailUrl: string | null;
  personaName: string;
  isPinned: boolean;
  multiplier: PromptMultiplier;
  language: RoomLanguage;
  memory: string;
  userNote: string;
  lastUsedAt: string;
  messages: RoomMessage[];
}

let messageSequence = 1;
/** chat.ts 의 턴 완료 처리에서도 같은 채번을 이어 써서 메시지 id가 겹치지 않게 합니다. */
export const nextMessageId = () => String(1000 + messageSequence++);

const createMessages = (
  turns: { user: string; ai: string }[],
): RoomMessage[] =>
  turns.flatMap(({ user, ai }) => [
    { messageId: nextMessageId(), type: "USER" as const, content: user },
    { messageId: nextMessageId(), type: "AI" as const, content: ai },
  ]);

/**
 * roomId → 방 상태. 목록·상세·메시지·컨텍스트 수정이 전부 이 맵 하나를 공유합니다.
 * chat.ts 의 채팅 턴 시작/스트림 완료 핸들러도 이 맵을 그대로 가져다 메시지를 쌓습니다.
 */
export const rooms = new Map<string, MockRoom>([
  [
    "room-1",
    {
      roomId: "room-1",
      universeId: "1",
      personaId: "2",
      title: "미스터리 탐정 셜록",
      thumbnailUrl: "/images/sample.png",
      personaName: "왓슨",
      isPinned: true,
      multiplier: 1,
      language: "KO",
      memory: "",
      userNote: "",
      lastUsedAt: new Date().toISOString(),
      messages: createMessages([
        { user: "오늘 사건 좀 봐줄 수 있어?", ai: "흥미로운 사건이군. 함께 진실을 찾아볼까?" },
        { user: "단서가 하나도 없어서 막막해.", ai: "단서는 항상 있어. 우리가 못 본 것뿐이지." },
      ]),
    },
  ],
  [
    "room-2",
    {
      roomId: "room-2",
      universeId: "2",
      personaId: "1",
      title: "옆자리 불량학생",
      thumbnailUrl: "/images/sample.png",
      personaName: "학생회장",
      isPinned: false,
      multiplier: 1.5,
      language: "KO",
      memory: "",
      userNote: "",
      lastUsedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      messages: createMessages([
        { user: "오늘 학교 끝나고 시간 있어?", ai: "오늘 학교 끝나고 뭐 해?" },
      ]),
    },
  ],
  [
    "room-3",
    {
      roomId: "room-3",
      universeId: "3",
      personaId: "1",
      title: "밤하늘의 마법사",
      thumbnailUrl: "/images/sample.png",
      personaName: "견습 마법사",
      isPinned: false,
      multiplier: 1,
      language: "KO",
      memory: "",
      userNote: "",
      lastUsedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      // 커서 페이지네이션 동작을 눈으로 확인할 수 있게 넉넉히 쌓아 둡니다.
      messages: createMessages(
        Array.from({ length: 15 }, (_, index) => ({
          user: `${index + 1}번째 질문이야.`,
          ai: `${index + 1}번째 대답이란다. 별자리를 읽는 법을 알려줄게.`,
        })),
      ),
    },
  ],
]);

const roomNotFound = () =>
  HttpResponse.json(
    { code: "CHAT_ROOM_NOT_FOUND", message: "채팅방을 찾을 수 없습니다." },
    { status: 404 },
  );

const invalidInput = (fields: Record<string, string>) =>
  HttpResponse.json(
    { code: "INVALID_INPUT", message: "요청 값이 올바르지 않습니다.", fields },
    { status: 400 },
  );

const toThumbnail = (room: MockRoom): ThumbnailRoom => ({
  roomId: room.roomId,
  title: room.title,
  thumbnailUrl: room.thumbnailUrl,
  personaName: room.personaName,
  lastMessage: room.messages.at(-1)?.content ?? "",
  lastUsedAt: room.lastUsedAt,
  isPinned: room.isPinned,
});

/** 허용 집합 밖의 배수는 서버가 조용히 기본값(1.0)으로 되돌립니다. */
const resolveMultiplier = (value: unknown): PromptMultiplier =>
  PROMPT_MULTIPLIERS.includes(value as PromptMultiplier)
    ? (value as PromptMultiplier)
    : 1;

const ALLOWED_LANGUAGES: RoomLanguage[] = ["KO", "EN", "JA", "ZH", "TH", "VI"];

const findRoom = (request: Request, pattern: RegExp) => {
  const roomId = pathValue(request.url, pattern);
  return roomId ? rooms.get(roomId) : undefined;
};

export const roomHandlers = [
  // 내 채팅방 목록 — 고정(isPinned) 우선 정렬 후 페이지네이션.
  http.get(endpoint("/rooms"), ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "10", 10);

    const sorted = [...rooms.values()]
      .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
      .map(toThumbnail);
    const totalElements = sorted.length;
    const totalPages = Math.max(Math.ceil(totalElements / size), 1);
    const content = sorted.slice(page * size, page * size + size);

    return HttpResponse.json({
      page: {
        number: page,
        size,
        numberOfElements: content.length,
        hasNext: page < totalPages - 1,
        totalElements,
        totalPages,
      },
      content,
    });
  }),

  // 채팅방 생성. universeId·personaId·scenarioId 조합으로 방을 하나 만든다.
  http.post(endpoint("/rooms"), async ({ request }) => {
    const body = (await request.json()) as Partial<CreateRoomRequest>;
    const missing: Record<string, string> = {};
    if (!body.universeId) missing.universeId = "세계관 정보가 없습니다.";
    if (!body.personaId) missing.personaId = "페르소나 정보가 없습니다.";
    if (!body.scenarioId) missing.scenarioId = "시나리오 정보가 없습니다.";
    if (Object.keys(missing).length > 0) return invalidInput(missing);

    // 다른 목업(persona.ts 등)과 같은 관례로, id가 999면 존재하지 않는 자원으로 취급합니다.
    if (body.personaId === "999") {
      return HttpResponse.json(
        { code: "PERSONA_NOT_FOUND", message: "페르소나를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const roomId = `room-${crypto.randomUUID()}`;
    rooms.set(roomId, {
      roomId,
      universeId: body.universeId!,
      personaId: body.personaId!,
      // 실제 제목은 세계관·시나리오 접근 권한 검사 후 서버가 정하지만, 목업은 알 길이 없어 고정 문구로 대체합니다.
      title: "새로 시작한 이야기",
      thumbnailUrl: "/images/sample.png",
      personaName: "페르소나",
      isPinned: false,
      multiplier: 1,
      language: "KO",
      memory: "",
      userNote: "",
      lastUsedAt: new Date().toISOString(),
      messages: [],
    });

    return HttpResponse.json({ roomId }, { status: 201 });
  }),

  // 채팅방 단건 조회
  http.get(/\/rooms\/([^/]+)(?:\?.*)?$/, ({ request }) => {
    const room = findRoom(request, /\/rooms\/([^/]+)$/);
    if (!room) return roomNotFound();

    const response: Room = {
      roomId: room.roomId,
      universeId: room.universeId,
      personaId: room.personaId,
      multiplier: room.multiplier,
    };
    return HttpResponse.json(response);
  }),

  // 채팅방 삭제
  http.delete(/\/rooms\/([^/]+)(?:\?.*)?$/, ({ request }) => {
    const roomId = pathValue(request.url, /\/rooms\/([^/]+)$/);
    if (!roomId || !rooms.delete(roomId)) return roomNotFound();

    return new HttpResponse(null, { status: 204 });
  }),

  // 채팅방 고정. 고정된 방은 목록에서 서버가 알아서 맨 앞으로 정렬해 줍니다.
  http.put(/\/rooms\/([^/]+)\/pin(?:\?.*)?$/, ({ request }) => {
    const room = findRoom(request, /\/rooms\/([^/]+)\/pin$/);
    if (!room) return roomNotFound();

    room.isPinned = true;
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(/\/rooms\/([^/]+)\/pin(?:\?.*)?$/, ({ request }) => {
    const room = findRoom(request, /\/rooms\/([^/]+)\/pin$/);
    if (!room) return roomNotFound();

    room.isPinned = false;
    return new HttpResponse(null, { status: 204 });
  }),

  // 채팅방 메시지 커서 기반 무한스크롤. beforeMessageId 이전(과거) 메시지를 size개 반환한다.
  http.get(/\/rooms\/([^/]+)\/messages(?:\?.*)?$/, ({ request }) => {
    const room = findRoom(request, /\/rooms\/([^/]+)\/messages$/);
    if (!room) return roomNotFound();

    const url = new URL(request.url);
    const beforeMessageId = url.searchParams.get("beforeMessageId") ?? undefined;
    const size = parseInt(url.searchParams.get("size") || "20", 10);

    // 최신순(내림차순)으로 정렬한 뒤 커서 이후(=더 과거)부터 자릅니다.
    const descending = [...room.messages].sort(
      (a, b) => Number(b.messageId) - Number(a.messageId),
    );
    const startIndex = beforeMessageId
      ? descending.findIndex((message) => message.messageId === beforeMessageId) + 1
      : 0;
    const remaining = startIndex === 0 && beforeMessageId ? [] : descending.slice(startIndex);
    const content = remaining.slice(0, size);

    return HttpResponse.json({
      page: {
        number: 0,
        size,
        numberOfElements: content.length,
        hasNext: remaining.length > size,
      },
      content,
    });
  }),

  // 채팅방 장기기억 수정
  http.patch(/\/rooms\/([^/]+)\/memory(?:\?.*)?$/, async ({ request }) => {
    const room = findRoom(request, /\/rooms\/([^/]+)\/memory$/);
    if (!room) return roomNotFound();

    const { memory } = (await request.json()) as { memory?: string };
    if (memory == null) {
      return invalidInput({ memory: "장기 기억 내용은 null일 수 없습니다." });
    }
    if (memory.length > 4000) {
      return invalidInput({ memory: "장기 기억은 4,000자 이하여야 합니다." });
    }

    room.memory = memory;
    return new HttpResponse(null, { status: 204 });
  }),

  // 채팅방 유저 노트 수정
  http.patch(/\/rooms\/([^/]+)\/note(?:\?.*)?$/, async ({ request }) => {
    const room = findRoom(request, /\/rooms\/([^/]+)\/note$/);
    if (!room) return roomNotFound();

    const { userNote } = (await request.json()) as { userNote?: string };
    if (userNote == null) {
      return invalidInput({ userNote: "유저 노트 내용은 null일 수 없습니다." });
    }
    if (userNote.length > 4000) {
      return invalidInput({ userNote: "유저 노트는 4,000자 이하여야 합니다." });
    }

    room.userNote = userNote;
    return new HttpResponse(null, { status: 204 });
  }),

  // 채팅방 페르소나 변경
  http.patch(/\/rooms\/([^/]+)\/persona(?:\?.*)?$/, async ({ request }) => {
    const room = findRoom(request, /\/rooms\/([^/]+)\/persona$/);
    if (!room) return roomNotFound();

    const { personaId } = (await request.json()) as { personaId?: string };
    if (!personaId) {
      return invalidInput({ personaId: "페르소나 정보가 없습니다." });
    }

    room.personaId = personaId;
    return new HttpResponse(null, { status: 204 });
  }),

  // 채팅방 프롬프트 배수 수정. 허용 집합 밖 값은 조용히 1.0으로 되돌립니다(서버와 동일).
  http.patch(/\/rooms\/([^/]+)\/multiplier(?:\?.*)?$/, async ({ request }) => {
    const room = findRoom(request, /\/rooms\/([^/]+)\/multiplier$/);
    if (!room) return roomNotFound();

    const { multiplier } = (await request.json()) as { multiplier?: number };
    room.multiplier = resolveMultiplier(multiplier);
    return new HttpResponse(null, { status: 204 });
  }),

  // 채팅방 응답 언어 수정
  http.patch(/\/rooms\/([^/]+)\/language(?:\?.*)?$/, async ({ request }) => {
    const room = findRoom(request, /\/rooms\/([^/]+)\/language$/);
    if (!room) return roomNotFound();

    const { language } = (await request.json()) as { language?: RoomLanguage };
    if (!language || !ALLOWED_LANGUAGES.includes(language)) {
      return invalidInput({ language: "채팅 언어는 필수입니다." });
    }

    room.language = language;
    return new HttpResponse(null, { status: 204 });
  }),
];
