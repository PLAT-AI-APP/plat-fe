import { setupWorker } from "msw/browser";
import { handlers } from "./index"; // index.ts(통합 핸들러)에서 가져옴

/**
 * 서비스 워커 생성
 * 브라우저 환경에서 네트워크 요청을 가로채는 주체입니다.
 */
export const worker = setupWorker(...handlers);
