import { composeMessages } from "../composeMessages";
import base from "./base/vi";
import runtime from "./runtime/vi";
import ui from "./ui/vi";
import studio from "./studio/vi";
import characterCreate from "./characterCreate/vi";
import chatRoom from "./chatRoom/vi";
import modal from "./modal/vi";

export default composeMessages({
  base,
  runtime,
  ui,
  studio,
  characterCreate,
  chatRoom,
  modal,
});
