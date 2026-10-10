"use client";

import { createContext } from "react";

/**
 * 채팅방이 받은 에셋 이미지 주소(파일 ID → URL). 성인 세계관만 채워져 있다.
 * 메시지 블록이 {{img:파일 ID}} 를 그릴 때 이 주소를 먼저 쓴다 — 성인 에셋은 보호 경로라 파일 ID 로 만든 주소로는 열리지 않는다.
 */
export const AssetImageUrlContext = createContext<Record<string, string> | undefined>(undefined);
