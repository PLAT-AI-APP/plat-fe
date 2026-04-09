import React from "react";
// 1. 방향 및 화살표
export { default as ArrowDown } from "./ArrowDown";
export { default as ArrowLeft } from "./ArrowLeft";
export { default as ArrowRight } from "./ArrowRight";
export { default as ArrowUp } from "./ArrowUp";
export { default as Fold } from "./Fold";

// 2. 알림 및 상태
export { default as BellOff } from "./Belloff";
export { default as BellOn } from "./BellOn";
export { default as Flag } from "./Flag";
export { default as Megaphone } from "./Megaphone";
export { default as Info } from "./Info";
export { default as Star } from "./Star";

// 3. 미디어 및 입력
export { default as Camera } from "./Camera";
export { default as CameraFill } from "./CameraFill";
export { default as Edit } from "./Edit";
export { default as Pen } from "./Pen";
export { default as PenSparkle } from "./PenSparkle";
export { default as Reload } from "./Reload";
export { default as ImageIcon } from "./ImageIcon";

// 4. 채팅 및 메시지
export { default as Chat } from "./Chat";
export { default as ChatFill } from "./ChatFill";
export { default as Message } from "./Message";
export { default as Email } from "./Email";
export { default as SendFill } from "./SendFill";

// 5. 유저 및 시스템
export { default as User } from "./User";
export { default as Persona } from "./Persona";
export { default as Home } from "./Home";
export { default as Gear } from "./Gear";
export { default as Global } from "./Global";
export { default as Logout } from "./Logout";
export { default as Google } from "./Google";
export { default as Kakao } from "./Kakao";

// 6. 도구 및 데이터
export { default as Search } from "./Search";
export { default as Date } from "./Date";
export { default as Clock } from "./Clock";
export { default as Sort } from "./Sort";
export { default as Trash } from "./Trash";
export { default as Dots } from "./Dots";
export { default as Close } from "./Close";
export { default as Asterisk } from "./Asterisk";

// 7. 기타 UI 요소
export { default as Eye } from "./Eye";
export { default as EyeOff } from "./EyeOff";
export { default as Heart } from "./Heart";
export { default as HeartFill } from "./HeartFill";
export { default as Moon } from "./Moon";
export { default as Sun } from "./Sun";
export { default as Pin } from "./Pin";
export { default as Storage } from "./Storage";
export { default as StorageFill } from "./StorageFill";
export { default as Headphone } from "./Headphone";
export { default as Finfill } from "./Finfill";
export { default as Plus } from "./Plus";
export { default as Phone } from "./Phone";
export { default as PhoneFill } from "./PhoneFill";

// 모든 아이콘이 공유할 타입
export interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

// 아이콘의 틀만 담당하는 컴포넌트
export const IconWrapper = ({
  size = 24,
  className = "",
  children,
  ...props
}: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
    fill="currentColor"
    stroke="none"
    {...props}
  >
    {children}
  </svg>
);
