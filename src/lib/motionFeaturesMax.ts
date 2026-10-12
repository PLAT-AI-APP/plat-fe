import { domMax } from "framer-motion";

/**
 * 순서가 바뀌는 목록(고정하면 맨 위로 올라가는 대화방·댓글)에만 쓰는 기능 묶음.
 * 레이아웃 애니메이션이 들어 있어 domAnimation 보다 크다. 앱 전체에 싣지 않고
 * 그 목록이 처음 그려질 때 따로 받는다(ListMotion).
 */
export default domMax;
