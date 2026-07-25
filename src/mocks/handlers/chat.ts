import { http, HttpResponse } from "msw";
import type {
  ChatAssetGalleryItem,
  ChatAssetGalleryResponse,
  ChatMemoryEntry,
} from "@/type/chat";

/** Mock long-term memory list for the chat room sidebar */
const chatMemoryList: ChatMemoryEntry[] = [
  {
    id: "memory-1",
    turn: 12,
    createdAt: "26.7.18 오후 3:33",
    content:
      "사용자는 짧고 자연스러운 답변을 선호한다. 감정 표현은 과하지 않게, 상황에 맞춰 담백하게 이어가는 편이 좋다.",
  },
  {
    id: "memory-2",
    turn: 10,
    createdAt: "26.7.18 오후 3:21",
    content:
      "사용자는 판타지 세계관과 일상적인 대화를 섞는 설정을 좋아한다. 갑작스러운 전개보다 관계가 천천히 가까워지는 흐름을 선호한다.",
  },
  {
    id: "memory-3",
    turn: 8,
    createdAt: "26.7.18 오후 3:08",
    content:
      "캐릭터는 사용자가 피곤하다고 말하면 먼저 상태를 묻고, 바로 조언하기보다 잠깐 쉬어도 괜찮다는 식으로 반응한다.",
  },
  {
    id: "memory-4",
    turn: 5,
    createdAt: "26.7.18 오후 2:54",
    content:
      "사용자는 대화 중 이름을 자주 부르는 것보다 중요한 순간에만 불러주는 방식을 더 자연스럽게 느낀다.",
  },
  {
    id: "memory-5",
    turn: 2,
    createdAt: "26.7.18 오후 2:40",
    content:
      "캐릭터는 처음에는 무심한 말투지만, 사용자가 먼저 다가오면 짧게 웃거나 솔직한 감정을 조금씩 드러낸다.",
  },
];

/** Mock image list for the chat room asset gallery */
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

/** Mock asset gallery counter and item payload */
const chatAssetGallery: ChatAssetGalleryResponse = {
  items: chatAssetGalleryItems,
  totalCount: 50,
  visibleCount: 4,
};

export const chatHandlers = [
  http.get(/\/chat-rooms\/([^/]+)\/memories(?:\?.*)?$/, () => {
    return HttpResponse.json({
      result: "OK",
      code: null,
      data: chatMemoryList,
      message: null,
    });
  }),

  http.get(/\/chat-rooms\/([^/]+)\/assets(?:\?.*)?$/, () => {
    return HttpResponse.json({
      result: "OK",
      code: null,
      data: chatAssetGallery,
      message: null,
    });
  }),
];
