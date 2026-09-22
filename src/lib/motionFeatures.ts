import { domAnimation } from "framer-motion";

/**
 * LazyMotion 이 나중에 불러오는 애니메이션 기능 묶음.
 *
 * 따로 파일로 두어야 동적 import 로 별도 청크가 된다. 레이아웃 애니메이션·드래그(domMax)는
 * 쓰지 않으므로 등장·퇴장·variants 만 담긴 domAnimation 으로 충분하다.
 */
export default domAnimation;
