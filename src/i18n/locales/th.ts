import { composeMessages } from "../composeMessages";
import base from "./base/th";
import runtime from "./runtime/th";
import ui from "./ui/th";
import studio from "./studio/th";
import characterCreate from "./characterCreate/th";
import chatRoom from "./chatRoom/th";
import modal from "./modal/th";

export default composeMessages({
  base,
  runtime,
  ui,
  studio,
  characterCreate,
  chatRoom,
  modal,
});
