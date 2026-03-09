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
    <footer className="px-5 py-2.5 flex flex-col gap-4 pt-9">
      <div className="flex gap-3">
        {menuArray.map((menu) => (
          <Link
            key={menu.text}
            href={menu.link}
            className="text-sm font-medium text-font-1"
          >
            {menu.text}
          </Link>
        ))}
      </div>
      <div className="flex gap-3 text-sm text-font-disabled">
        <span>(주)플랫</span>|<span>대표 김승우</span>|<span>02-123-4567</span>|
        <span>사업자등록번호: 123-45-67890</span>|
        <span>서울 OO구 OOO로123길 45, 10F</span>
      </div>
      <p className="text-sm text-font-disabled">
        © 2025 Wrtn. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
