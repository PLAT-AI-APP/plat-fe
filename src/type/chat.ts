export interface AIModelType {
  id: string;
  name: string;
  description: string;
  price: number; // 현재 가격 (할인가 포함)
  originalPrice?: number; // 원래 가격 (할인이 있을 때만)
  discountRate?: number; // 할인율 (단위: %)
  unit: string; // 단위 (예: "채팅")
  icon: string; // 아이콘 경로 또는 이름
}

/** 캐릭터 응답 타입 */
interface AssistantMessageType {
  id: string;
  role: "assistant";
  characterName: string;
  profileImage: string;
  content: string; // "대사" {img:...} 지문 형태
}

/** 유저 응답 타입 */
interface UserMessageType {
  id: string;
  role: "user";
  content: string; // 일반 텍스트
}

/** 최종 메시지 유니온 타입 */
export type ChatMessageType = AssistantMessageType | UserMessageType;

/** 채팅방 장기기억 항목 */
export interface ChatMemoryEntry {
  content: string;
  createdAt: string;
  id: string;
  turn: number;
}

/** 채팅방 에셋 갤러리 이미지 항목 */
export interface ChatAssetGalleryItem {
  id: string;
  imageUrl: string;
  isLocked: boolean;
}

/** 채팅방 에셋 갤러리 목록 요약 */
export interface ChatAssetGalleryResponse {
  items: ChatAssetGalleryItem[];
  totalCount: number;
  visibleCount: number;
}
