import Link from "next/link";
import React from "react";

const Footer = () => {
  const menuArray = [
    {
      text: "회사 소개",
      link: "#",
    },
    {
      text: "고객센터",
      link: "#",
    },
    {
      text: "이용약관",
      link: "#",
    },
    {
      text: "개인정보처리방침",
      link: "#",
    },
    {
      text: "청소년 보호정책",
      link: "#",
    },
  ];
  return (
    <footer id="main-footer" className="px-5 py-2.5 flex flex-col gap-4 pt-9">
      {/* 푸터 내비게이션 영역 */}
      <nav id="footer-navigation" aria-label="푸터 메뉴">
        <ul id="footer-menu-list" className="flex gap-3 p-0 m-0 list-none">
          {menuArray.map((menu) => (
            <li key={menu.text} id={`footer-menu-item-${menu.text}`}>
              <Link
                id={`footer-link-${menu.text}`}
                href={menu.link}
                className="body-4 text-font-1 hover:underline"
              >
                {menu.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 사업자 정보 영역: 주소 및 연락처 정보 */}
      <address
        id="footer-business-info"
        className="not-italic flex flex-wrap gap-3 body-4 text-font-disabled"
      >
        <span id="footer-company-name">(주)오비트랩</span>|
        <span id="footer-representative">대표 김승우</span>|
        <span id="footer-phone-number">02-123-4567</span>|
        <span id="footer-registration-number">
          사업자등록번호: 123-45-67890
        </span>
        |<span id="footer-office-address">서울 OO구 OOO로123길 45, 10F</span>
      </address>

      {/* 저작권 표시 영역 */}
      <p id="footer-copyright" className="body-4 text-font-disabled">
        © 2025 Wrtn. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
