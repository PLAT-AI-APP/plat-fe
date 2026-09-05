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
const MODAL_COMPONENTS = {
  ADD_LANGUAGE: dynamic(() => import("./AddLanguageModal")),
  CHATTING_START: dynamic(() => import("./ChattingStartModal")),
  FIND_PASSWORD: dynamic(() => import("./find-password")),
  FOLLOW: dynamic(() => import("./follow")),
  LOGIN: dynamic(() => import("./LoginModal")),
  PERSONA_ADD: dynamic(() => import("./PersonaAddModal")),
  PROFILE_EDIT: dynamic(() => import("./ProfileEditModal")),
  TAG_ADD: dynamic(() => import("./TagAddModal")),
  TAG_SUGGESTIONS: dynamic(() => import("./TagSuggestionsModal")),
  USER_NOTE: dynamic(() => import("./UserNoteModal")),
  PERSONA: dynamic(() => import("./persona")),
} as {
  [K in keyof ModalTypeMap]: ComponentType<ModalTypeMap[K]>;
};

export { MODAL_COMPONENTS };
