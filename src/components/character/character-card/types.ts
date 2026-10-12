import type { BadgeTierCode } from "@/constants/creatorTier";

export type CardSize = "S" | "M" | "L" | "XL";

export interface CharacterCardProps {
  title: string;
  description: string;
  creatorName: string;
  /** 제작자 등급. 있으면 닉네임 앞 '@' 자리에 뱃지를 단다. */
  creatorTier?: BadgeTierCode | null;
  /** 탈퇴한 제작자가 남겨 PLAT 이 운영하는 캐릭터. 제작자 이름을 적지 않는다. */
  isAdopted?: boolean;
  chatCount?: number;
  images: string[] | string;
  size?: CardSize;
  tagList?: string[];
  /** 강조 표시할 태그. 없으면 강조 없이 태그 목록만 보여준다. */
  currentTag?: string;
  isNew?: boolean;
  isOfficial?: boolean;
  selectedTags?: string | string[];
  rank?: number;
  /**
   * true면 카드가 부모(그리드 셀)의 폭을 그대로 채운다. 카드 자체의 고정폭에
   * 기대는 캐러셀·한 줄 나열 등 다른 화면에 영향이 없도록 기본값은 false다.
   */
  fluid?: boolean;
  /**
   * 카드 클릭 시 이동할 상세페이지 경로(예: `/characters/{id}`).
   * 카드 내부의 인디케이터·오버레이 버튼과 형제로 깔리는 stretched link라,
   * <a> 안에 <button>이 중첩되는 유효하지 않은 마크업을 피하면서도
   * prefetch·새 탭 열기 같은 Link의 이점을 그대로 가져갑니다.
   * 아직 갈 곳이 없는 자리(더미 데이터 등)는 생략해 카드를 비활성 상태로 둡니다.
   */
  href?: string;
  /**
   * 넘기면 카드 우상단에 수정 배지가 뜨고, 눌렀을 때 이 경로로 이동한다
   * (예: `/character-creat?universeId={id}`). 카드 클릭(href)과 겹치지 않도록
   * 별도 배지로 띄운다 — 없으면 배지 자체가 안 뜬다.
   */
  editHref?: string;
  /** 성인 세계관. 제목 옆에 19 배지를 단다. */
  adult?: boolean;
  /**
   * 내 작품 목록에서만 쓰는 상태. 반려·검수 대기(danger·pending)는 이미지 전체를 어둡게 덮고 가운데에 크게 띄운다 — 다른 유저에게
   * 보이지 않는다는 중요한 사실이라 한눈에 보여야 한다. 비공개 같은 가벼운 상태(muted)는 좌상단 칩으로만 단다.
   */
  statusChip?: CardStatusChip;
  /** 넘기면 카드를 눌렀을 때 이동 대신 이 동작을 한다(열리지 않는 상세 대신 사유를 띄울 때). */
  onCardClick?: () => void;
}

export interface CardStatusChip {
  label: string;
  tone: "danger" | "pending" | "muted";
  /** 오버레이 아래 작은 안내(예: "눌러서 사유 보기"). muted 칩에는 쓰지 않는다. */
  hint?: string;
}

export interface SizeConfig {
  wrapper: string;
  imageArea: string;
  infoArea: string;
  title: string;
  desc: string;
  isIntegrated: boolean;
  creatorName: string;
  chatCount: string;
  chatCountIcon?: string;
}
