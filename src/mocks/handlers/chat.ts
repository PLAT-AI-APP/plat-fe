import { http, HttpResponse, delay } from "msw";
import { endpoint, pathValue } from "../utils";
import type {
  ChatAssetGalleryItem,
  ChatAssetGalleryResponse,
  ChatCatalog,
  ChatStartRequest,
} from "@/type/chat";
import { rooms, nextMessageId } from "./room";
import type { MessageSender, RoomMessage } from "@/type/room";

/** 채팅방 에셋 갤러리 목 이미지 목록 */
const chatAssetGalleryItems: ChatAssetGalleryItem[] = [
  {
    id: "asset-1",
    imageUrl: "/images/sample.png",
    isLocked: false,
  },
  {
    id: "asset-2",
    imageUrl: "/images/sample.png",
    isLocked: false,
  },
  {
    id: "asset-3",
    imageUrl: "/images/sample.png",
    isLocked: false,
  },
  {
    id: "asset-4",
    imageUrl: "/images/sample.png",
    isLocked: false,
  },
  {
    id: "asset-5",
    imageUrl: "/images/sample.png",
    isLocked: true,
  },
  {
    id: "asset-6",
    imageUrl: "/images/sample.png",
    isLocked: true,
  },
  {
    id: "asset-7",
    imageUrl: "/images/sample.png",
    isLocked: true,
  },
  {
    id: "asset-8",
    imageUrl: "/images/sample.png",
    isLocked: true,
  },
  {
    id: "asset-9",
    imageUrl: "/images/sample.png",
    isLocked: true,
  },
  {
    id: "asset-10",
    imageUrl: "/images/sample.png",
    isLocked: true,
  },
  {
    id: "asset-11",
    imageUrl: "/images/sample.png",
    isLocked: true,
  },
  {
    id: "asset-12",
    imageUrl: "/images/sample.png",
    isLocked: true,
  },
];

/** 에셋 갤러리 목 카운트와 목록 응답 */
const chatAssetGallery: ChatAssetGalleryResponse = {
  items: chatAssetGalleryItems,
  totalCount: 50,
  visibleCount: 4,
};

/** 백엔드 ChatModel enum 중 화면 테스트에 필요한 일부만 추립니다. */
const CHAT_CATALOG: ChatCatalog = {
  models: [
    {
      name: "CLAUDE_SONNET_4_6",
      value: "claude-sonnet-4-6",
      provider: "ANTHROPIC",
      displayName: "Claude Sonnet 4.6",
      description: "자연스럽고 세심한 대화와 균형 잡힌 창작 응답에 적합한 모델.",
      creditCost: 10,
    },
    {
      name: "CLAUDE_HAIKU_4_5",
      value: "claude-haiku-4-5-20251001",
      provider: "ANTHROPIC",
      displayName: "Claude Haiku 4.5",
      description: "빠른 응답이 필요한 가벼운 일상 대화에 적합한 모델.",
      creditCost: 0,
    },
    {
      name: "GEMINI_2_5_FLASH",
      value: "gemini-2.5-flash",
      provider: "GOOGLE",
      displayName: "Gemini 2.5 Flash",
      description: "일상적인 역할극과 자연스러운 대화를 빠르게 이어가는 데 적합한 모델.",
      creditCost: 5,
    },
    {
      name: "GPT_5_5",
      value: "gpt-5.5",
      provider: "OPENAI",
      displayName: "GPT-5.5",
      description: "복잡한 요청을 이해하고 안정적으로 대화를 이어가는 데 적합한 모델.",
      creditCost: 15,
    },
  ],
  multipliers: [
    { name: "X1_0", value: 1 },
    { name: "X1_5", value: 1.5 },
    { name: "X2_0", value: 2 },
    { name: "X2_5", value: 2.5 },
    { name: "X3_0", value: 3 },
    { name: "X3_5", value: 3.5 },
    { name: "X4_0", value: 4 },
    { name: "X4_5", value: 4.5 },
    { name: "X5_0", value: 5 },
  ],
};

const SUPPORTED_CHAT_MODELS = new Set(CHAT_CATALOG.models.map((model) => model.name));
/** 안전 정책 위반을 재현해 볼 수 있는 트리거 문구. 실제 판단 로직은 흉내 내지 않습니다. */
const SAFETY_BLOCKED_KEYWORD = "금지어테스트";

interface MockChatTurn {
  roomId: string;
  /** SSE로 흘려보낼 토큰 조각들. 인덱스가 곧 이벤트 id(Last-Event-ID)입니다. */
  tokens: string[];
}

/** room.ts 의 MockRoom.messages 뒤에 이어 붙일 다음 메시지를 만듭니다. */
const buildMessage = (type: MessageSender, content: string): RoomMessage => ({
  messageId: nextMessageId(),
  type,
  content,
});

/** chatTurnId(클라이언트가 만든 멱등키) → 턴. 서버도 같은 값을 그대로 turnId로 쓴다. */
const chatTurns = new Map<string, MockChatTurn>();

/** 유저 메시지를 그대로 되비추는 짧은 캐릭터 답변을 만들어 토큰 단위로 쪼갭니다. */
const buildReplyTokens = (userMessage: string): string[] => {
  const reply = `"${userMessage.slice(0, 30)}"... 라고 말했구나. 흥미로운걸.`;
  return reply.match(/.{1,3}/g) ?? [reply];
};

const chatStartError = (code: string, message: string, status: number) =>
  HttpResponse.json({ code, message }, { status });

export const chatHandlers = [
  http.get(/\/chat-rooms\/([^/]+)\/assets(?:\?.*)?$/, () => {
    return HttpResponse.json(chatAssetGallery);
  }),

  // 채팅 모델·프롬프트 배수 카탈로그
  http.get(endpoint("/chat/models"), () => {
    return HttpResponse.json(CHAT_CATALOG);
  }),

  /**
   * 턴 시작. 실제 서버 순서(필수값 → 방/캐릭터/페르소나 컨텍스트 → 안전 정책 → 멱등키 중복)를 그대로 흉내 냅니다.
   */
  http.post(endpoint("/chat"), async ({ request }) => {
    const body = (await request.json()) as Partial<ChatStartRequest>;

    if (!body.chatTurnId) {
      return chatStartError("CHAT_TURN_ID_REQUIRED", "chatTurnId가 없습니다.", 400);
    }
    if (!body.context?.roomId) {
      return chatStartError("CHAT_ROOM_ID_REQUIRED", "채팅방 정보가 없습니다.", 400);
    }
    if (!body.context?.universeCharacterId) {
      return chatStartError(
        "CHAT_UNIVERSE_CHARACTER_ID_REQUIRED",
        "세계관 캐릭터 정보가 없습니다.",
        400,
      );
    }
    if (!body.context?.personaId) {
      return chatStartError("CHAT_PERSONA_ID_REQUIRED", "페르소나 정보가 없습니다.", 400);
    }
    if (!body.generation?.message) {
      return chatStartError("CHAT_MESSAGE_REQUIRED", "메시지를 입력해주세요.", 400);
    }
    if (body.generation.message.length > 4000) {
      return chatStartError(
        "CHAT_MESSAGE_TOO_LONG",
        "메시지가 너무 깁니다. 최대 4000자까지 입력할 수 있습니다.",
        400,
      );
    }
    if (!body.generation?.model) {
      return chatStartError("CHAT_MODEL_REQUIRED", "사용할 AI 모델을 선택해주세요.", 400);
    }
    if (!SUPPORTED_CHAT_MODELS.has(body.generation.model)) {
      return chatStartError("CHAT_MODEL_UNSUPPORTED", "지원하지 않는 모델입니다.", 400);
    }

    // 컨텍스트 검증: 방이 없으면 채팅방 목록에서 쓰는 코드와 같은 CHAT_ROOM_NOT_FOUND.
    const room = rooms.get(body.context!.roomId!);
    if (!room) {
      return chatStartError("CHAT_ROOM_NOT_FOUND", "채팅방을 찾을 수 없습니다.", 404);
    }

    if (body.generation.message.includes(SAFETY_BLOCKED_KEYWORD)) {
      return chatStartError(
        "CHAT_SAFETY_BLOCKED",
        "요청하신 내용은 안전 정책상 처리할 수 없습니다.",
        400,
      );
    }

    // 멱등 게이트: 같은 chatTurnId 재요청은 스트리밍 특성상 재생이 아니라 거부(409)로 처리한다.
    if (chatTurns.has(body.chatTurnId)) {
      return chatStartError("CHAT_TURN_DUPLICATED", "이미 처리 중이거나 종료된 채팅 턴입니다.", 409);
    }

    chatTurns.set(body.chatTurnId, {
      roomId: room.roomId,
      tokens: buildReplyTokens(body.generation.message),
    });
    // 최근 대화 미리보기에 유저 메시지를 바로 반영합니다(AI 응답은 스트림이 끝나야 확정됩니다).
    room.messages.push(buildMessage("USER", body.generation.message));
    room.lastUsedAt = new Date().toISOString();

    return HttpResponse.json({ turnId: body.chatTurnId });
  }),

  /**
   * 턴 출력 스트림(SSE). msw는 별도 SSE 헬퍼도 제공하지만, 실제 fetch+ReadableStream 클라이언트
   * (chatStream.ts)의 파싱 로직을 그대로 검증할 수 있도록 원시 ReadableStream으로 text/event-stream을
   * 직접 흉내 냅니다. Last-Event-ID를 보내면 그 다음 토큰부터 이어 보냅니다.
   */
  http.get(/\/chat\/([^/]+)\/stream(?:\?.*)?$/, ({ request }) => {
    const turnId = pathValue(request.url, /\/chat\/([^/]+)\/stream$/);
    const turn = turnId ? chatTurns.get(turnId) : undefined;
    if (!turn) {
      return chatStartError("CHAT_TURN_NOT_FOUND", "존재하지 않는 채팅 턴입니다.", 404);
    }

    const lastEventId = request.headers.get("Last-Event-ID");
    const startIndex = lastEventId ? Number(lastEventId) + 1 : 0;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for (let index = startIndex; index < turn.tokens.length; index++) {
          controller.enqueue(encoder.encode(`id: ${index}\ndata: ${turn.tokens[index]}\n\n`));
          await delay(30);
        }
        controller.enqueue(
          encoder.encode(`id: ${turn.tokens.length}\nevent: done\ndata: \n\n`),
        );
        // 스트림이 끝났으니 완성된 답변을 방 메시지 목록에 반영하고 턴을 정리합니다.
        const room = rooms.get(turn.roomId);
        if (room) room.messages.push(buildMessage("AI", turn.tokens.join("")));
        if (turnId) chatTurns.delete(turnId);
        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }),
];
