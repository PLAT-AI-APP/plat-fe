import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";
import type {
  ChatAssetGalleryItem,
  ChatAssetGalleryResponse,
} from "@/type/chat";
import type { ThumbnailRoom } from "@/type/room";

/** 내 채팅방 목 목록. 실서버처럼 고정된 방을 먼저 보여주는지 확인할 수 있게 하나는 고정해 둡니다. */
const mockRooms: ThumbnailRoom[] = [
  {
    roomId: "1",
    title: "미스터리 탐정 셜록",
    thumbnailUrl: "/images/sample.png",
    lastMessage: "흥미로운 사건이군. 함께 진실을 찾아볼까?",
    isPinned: true,
  },
  {
    roomId: "2",
    title: "옆자리 불량학생",
    thumbnailUrl: "/images/sample.png",
    lastMessage: "오늘 학교 끝나고 뭐 해?",
    isPinned: false,
  },
  {
    roomId: "3",
    title: "밤하늘의 마법사",
    thumbnailUrl: "/images/sample.png",
    lastMessage: "별자리를 읽는 법을 알려줄게.",
    isPinned: false,
  },
];

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

export const chatHandlers = [
  http.get(/\/chat-rooms\/([^/]+)\/assets(?:\?.*)?$/, () => {
    return HttpResponse.json(chatAssetGallery);
  }),

  // 내 채팅방 목록 — 고정(isPinned) 우선 정렬 후 페이지네이션.
  http.get(endpoint("/rooms"), ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "10", 10);

    const sorted = [...mockRooms].sort((a, b) =>
      a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1,
    );
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

  http.put(/\/rooms\/([^/]+)\/pin(?:\?.*)?$/, ({ request }) => {
    const roomId = pathValue(request.url, /\/rooms\/([^/]+)\/pin$/);
    const room = mockRooms.find((item) => item.roomId === roomId);
    if (room) room.isPinned = true;

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(/\/rooms\/([^/]+)\/pin(?:\?.*)?$/, ({ request }) => {
    const roomId = pathValue(request.url, /\/rooms\/([^/]+)\/pin$/);
    const room = mockRooms.find((item) => item.roomId === roomId);
    if (room) room.isPinned = false;

    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(/\/rooms\/([^/]+)(?:\?.*)?$/, ({ request }) => {
    const roomId = pathValue(request.url, /\/rooms\/([^/]+)$/);
    const index = mockRooms.findIndex((item) => item.roomId === roomId);
    if (index !== -1) mockRooms.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),

  // 방마다 문자열 하나만 통째로 덮어쓰는 API라 목업도 저장 없이 204만 돌려줍니다.
  http.patch(/\/rooms\/([^/]+)\/memory$/, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.patch(/\/rooms\/([^/]+)\/note$/, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
