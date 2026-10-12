import type { BadgeTierCode } from "@/constants/creatorTier";

export interface CardCreator {
  creatorId: string;
  /** adopted 면 "" 다. 화면에는 제작자 대신 "운영 PLAT" 을 적는다. */
  nickname: string;
  /** 제작자가 탈퇴하며 남겨 공식 계정이 운영하는 캐릭터. 회사를 제작자로 적으면 안 된다. */
  adopted: boolean;
  /** 제작자 등급 뱃지. 등급이 없거나 인수한 캐릭터면 null. */
  tier?: BadgeTierCode | null;
}

/** 백엔드 BaseCard 응답 공통 모양. 홈·랭킹·검색·찜 목록 카드가 이 모양을 공유합니다. */
export interface BaseCard {
  universeId: string;
  images: string[];
  title: string;
  description: string;
  creator: CardCreator;
  chatCount: number;
  isNew: boolean;
  isOfficial: boolean;
  /** 성인 세계관. 19 토글을 켠 성인인증 유저에게만 목록에 섞여 온다. */
  adult?: boolean;
}

/** 검수에서 고칠 곳. 원문 대신 필드와 고칠 방향만 온다. */
export interface ReviewFinding {
  language: string;
  field: "NAME" | "DESCRIPTION" | "DETAIL_SETTING";
  guide: string;
}

/** 내 작품이 승인되지 않은 이유. 모두 승인되면 카드에 없다. */
export interface OwnCardReview {
  status: "PENDING" | "REJECTED";
  /** 자동 검수를 마치지 못해 운영자 판정을 기다리는 중 */
  awaitingAdmin: boolean;
  reason: string | null;
  findings: ReviewFinding[];
}

/** 로그인 상태일 때만 의미 있는 찜 여부가 함께 내려오는 카드. */
export interface LikableCard extends BaseCard {
  liked: boolean;
}

/** 내 프로필 작품 카드. 공개 여부와 검수 결과는 본인에게만 온다. */
export interface OwnCard extends LikableCard {
  visibility: "PUBLIC" | "UNLISTED" | "PRIVATE";
  review: OwnCardReview | null;
}
