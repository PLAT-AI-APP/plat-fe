import { authHandlers } from "./handlers/auth";
import { personaHandlers } from "./handlers/persona";

/**
 * 모든 핸들러를 하나의 배열로 통합합니다.
 * 이 배열이 browser.ts와 server.ts에서 사용됩니다.
 */
export const handlers = [...authHandlers, ...personaHandlers];
