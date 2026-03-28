import React from "react";

const ReplyLine = () => {
  return (
    <>
      {/* 수직 라인: flex-1을 주어 Image와 하단 SVG 사이의 남는 공간을 모두 차지하게 함 */}
      <svg
        width="36"
        height="123"
        viewBox="0 0 36 123"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-1 w-px bg-[#5C6180]"
      >
        <path
          d="M17.5 0.5C17.5 0.223857 17.7239 0 18 0C18.2761 0 18.5 0.223858 18.5 0.5V123H17.5V0.5Z"
          fill="#5C6180"
        />
      </svg>

      {/* 하단 꺾쇠 SVG: 높이가 고정되어야 하므로 flex-shrink-0 추가 */}
      <svg
        width="36"
        height="32"
        viewBox="0 0 36 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <mask id="path-1-inside-1_213_3450" fill="white">
          <path d="M17.5 0H36V22H35.5C25.5589 22 17.5 13.9411 17.5 4V0Z" />
        </mask>
        <path
          d="M17.5 0H36H17.5M36 23H35.5C25.0066 23 16.5 14.4934 16.5 4H18.5C18.5 13.3888 26.1112 21 35.5 21H36V23ZM35.5 23C25.0066 23 16.5 14.4934 16.5 4V0H18.5V4C18.5 13.3888 26.1112 21 35.5 21V23ZM35.5 21M36 0V22V0"
          fill="#5C6180"
          mask="url(#path-1-inside-1_213_3450)"
        />
      </svg>
    </>
  );
};

export default ReplyLine;
