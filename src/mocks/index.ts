import { authHandlers } from "./handlers/auth";
import { personaHandlers } from "./handlers/persona";
import { userHandlers } from "./handlers/user";
import { followHandlers } from "./handlers/follow";
import { hashtagHandlers } from "./handlers/hashtag";
import { characterHandlers } from "./handlers/character";
import { chatHandlers } from "./handlers/chat";
import { fileHandlers } from "./handlers/file";
import { noticeHandlers } from "./handlers/notice";
import { noteHandler } from "./handlers/note";
import { walletHandlers } from "./handlers/wallet";
import { productHandlers } from "./handlers/product";
import { homeHandlers } from "./handlers/home";

/**
 * 모든 핸들러를 하나의 배열로 통합합니다.
 * 이 배열이 browser.ts와 server.ts에서 사용됩니다.
 */
export const handlers = [
  ...followHandlers,
  ...authHandlers,
  ...personaHandlers,
  ...userHandlers,
  ...hashtagHandlers,
  ...characterHandlers,
  ...chatHandlers,
  ...fileHandlers,
  ...noticeHandlers,
  ...noteHandler,
  ...walletHandlers,
  ...productHandlers,
  ...homeHandlers,
];
