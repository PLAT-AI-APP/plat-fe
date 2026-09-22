"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { ModalTypeMap } from "@/store/useModalStore";

/*
 * 모달은 열기 전에는 필요 없다.
 *
 * 예전에는 열한 개를 전부 정적으로 가져왔고, 이 목록은 ModalManager 를 통해
 * ClientLayout(앱 껍데기)에 들어간다. 즉 **모든 페이지**가 열어 보지도 않을
 * 모달 열한 개의 코드를 함께 내려받았다. 태그 추가 모달 하나가 300줄짜리
 * 태그 목록을, 프로필 수정 모달이 이미지 크롭 도구를 끌고 오는 식이다.
 *
 * ssr:false 는 쓰지 않는다. 모달은 어차피 사용자가 열어야 나타나므로 서버
 * 렌더 결과에 영향이 없고, 굳이 끄면 하이드레이션 경로만 갈라진다.
 */
const MODAL_LOADERS = {
  ADD_LANGUAGE: () => import("./AddLanguageModal"),
  CHATTING_START: () => import("./ChattingStartModal"),
  FIND_PASSWORD: () => import("./find-password"),
  FOLLOW: () => import("./follow"),
  LOGIN: () => import("./LoginModal"),
  PERSONA_ADD: () => import("./PersonaAddModal"),
  PROFILE_EDIT: () => import("./ProfileEditModal"),
  REPORT: () => import("./ReportModal"),
  TAG_ADD: () => import("./TagAddModal"),
  TAG_SUGGESTIONS: () => import("./TagSuggestionsModal"),
  PERSONA: () => import("./persona"),
} satisfies Record<keyof ModalTypeMap, () => Promise<unknown>>;

const MODAL_COMPONENTS = {
  ADD_LANGUAGE: dynamic(MODAL_LOADERS.ADD_LANGUAGE),
  CHATTING_START: dynamic(MODAL_LOADERS.CHATTING_START),
  FIND_PASSWORD: dynamic(MODAL_LOADERS.FIND_PASSWORD),
  FOLLOW: dynamic(MODAL_LOADERS.FOLLOW),
  LOGIN: dynamic(MODAL_LOADERS.LOGIN),
  PERSONA_ADD: dynamic(MODAL_LOADERS.PERSONA_ADD),
  PROFILE_EDIT: dynamic(MODAL_LOADERS.PROFILE_EDIT),
  REPORT: dynamic(MODAL_LOADERS.REPORT),
  TAG_ADD: dynamic(MODAL_LOADERS.TAG_ADD),
  TAG_SUGGESTIONS: dynamic(MODAL_LOADERS.TAG_SUGGESTIONS),
  PERSONA: dynamic(MODAL_LOADERS.PERSONA),
} as {
  [K in keyof ModalTypeMap]: ComponentType<ModalTypeMap[K]>;
};

/**
 * 모달 코드를 미리 받아 둔다. 여는 버튼에 포인터를 올리거나 포커스했을 때 부르면, 누르는
 * 순간에는 이미 받아 둔 상태라 바로 뜬다(처음 열 때 청크를 받느라 멈칫하던 것을 없앤다).
 * 같은 모듈은 한 번만 받으므로 여러 번 불러도 된다.
 */
export const preloadModal = (type: keyof ModalTypeMap) => {
  void MODAL_LOADERS[type]().catch(() => undefined);
};

export { MODAL_COMPONENTS };
