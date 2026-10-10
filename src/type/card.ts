export interface CardCreator {
  creatorId: string;
  nickname: string;
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

/** 로그인 상태일 때만 의미 있는 찜 여부가 함께 내려오는 카드. */
export interface LikableCard extends BaseCard {
  liked: boolean;
}
