import { composeMessages } from "../composeMessages";
import base from "./base/ko";
import runtime from "./runtime/ko";
import ui from "./ui/ko";
import studio from "./studio/ko";
import characterCreate from "./characterCreate/ko";
import chatRoom from "./chatRoom/ko";
import modal from "./modal/ko";

export default composeMessages({
  base,
  runtime,
  ui,
  studio,
  characterCreate,
  chatRoom,
  modal,
});
