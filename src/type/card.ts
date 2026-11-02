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

/**
 * 검수에서 고칠 곳. 원문 대신 필드와 고칠 방향만 온다.
 * field 는 입력 칸(NAME·DESCRIPTION·DETAIL_SETTING)이거나, 칸을 특정하지 못할 때 문제가 감지된 영역이다.
 * 영역 값은 정확한 문장 위치가 아니라 대략의 범위이고, MULTIPLE 은 여러 영역에 걸친다는 뜻이다.
 */
export interface ReviewFinding {
  language: string;
  field:
    | "NAME"
    | "DESCRIPTION"
    | "DETAIL_SETTING"
    | "UNIVERSE"
    | "CHARACTER"
    | "SCENARIO"
    | "ASSET"
    | "MULTIPLE";
  guide: string;
}

/** 공개를 막고 있는 이미지 한 장. 승인된 이미지는 오지 않는다. */
export interface ReviewImage {
  fileId: string;
  usage: "UNIVERSE_PROFILE" | "CHARACTER_PROFILE" | "UNIVERSE_ASSET";
  /** 캐릭터 프로필은 세계관 캐릭터 ID, 에셋은 에셋 ID, 대표 이미지는 null */
  refId: string | null;
  /** 본인만 볼 수 있는 서명 URL */
  imageUrl: string | null;
  status: "PENDING" | "REJECTED" | "ADULT_SETTING_REQUIRED";
  /** IMAGE_<분류> · MANUAL_REJECTION · USER_APPEAL 등. 화면이 번역한다. */
  reasonCode: string | null;
  appealable: boolean;
  appealed: boolean;
}

/** 내 작품이 승인되지 않은 이유. 모두 승인되면 카드에 없다. */
export interface OwnCardReview {
  status: "PENDING" | "REJECTED";
  /** 자동 검수를 마치지 못해 운영자 판정을 기다리는 중 */
  awaitingAdmin: boolean;
  /** 본문 검수 사유. 이미지 사유는 images 에 있다. */
  reason: string | null;
  findings: ReviewFinding[];
  images: ReviewImage[];
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
