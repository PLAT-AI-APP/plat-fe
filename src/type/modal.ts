import { CharacterScenario } from "./character";
import { Persona } from "./persona";
import type { ReportTargetType } from "./report";

export interface GlobalModalProps {
  onClose: () => void;
  stackIndex?: number;
}

export type AddLanguageModalProps = GlobalModalProps;

export interface ChattingStartModalProps extends GlobalModalProps {
  universeId: string;
  scenarioList: CharacterScenario[];
  currentScenario: CharacterScenario | undefined;
}

export interface FollowModalProps extends GlobalModalProps {
  userId: string;
  nickname?: string;
  isOwnProfile?: boolean;
  activeTab: "followers" | "following";
}

export type FindPasswordModalProps = GlobalModalProps;

export interface LoginModalProps extends GlobalModalProps {
  triggerRef: React.RefObject<HTMLElement | null> | undefined;
}

export interface PersonaAddModalProps extends GlobalModalProps {
  isEditMode?: boolean;
  personaId?: string;
  name?: string;
  description?: string;
}

export type ProfileEditModalProps = GlobalModalProps;

export type TagAddModalProps = GlobalModalProps;

export type TagSuggestionsModalProps = GlobalModalProps;

export interface ReportModalProps extends GlobalModalProps {
  targetType: ReportTargetType;
  targetId: string;
  /** 제목에 보일 대상 이름. 댓글이면 작성자 닉네임, 캐릭터면 캐릭터 이름이다. */
  targetName: string;
}

export interface PersonaModalProps extends GlobalModalProps {
  /** 있으면 "관리" 대신 "선택" 모드로 동작합니다 — 항목 클릭 시 이 콜백을 부르고 모달을 닫습니다. */
  onSelectPersona?: (persona: Persona) => void;
  /** 선택 모드에서 현재 골라져 있는 페르소나. 목록에서 체크 표시로 보여줍니다. */
  currentPersonaId?: string;
}

/**
 * 본인인증을 여는 목적. 인증 자체(성인이면 성인인증까지 기록)는 같고 화면·문구·결과 안내만 다르다.
 * - adult: 성인인증이 필요한 자리(19 토글·성인 콘텐츠 게이트·성인 캐릭터 설정 등)
 * - identity: 본인인증만 하려는 자리(프로필의 본인인증 버튼 등). 성인·19 를 말하지 않는다
 */
export type IdentityVerificationPurpose = "identity" | "adult";

/** 본인인증(성인이면 성인인증까지) 진행 모달. */
export interface IdentityVerificationModalProps extends GlobalModalProps {
  /** 기본은 adult. */
  purpose?: IdentityVerificationPurpose;
}
