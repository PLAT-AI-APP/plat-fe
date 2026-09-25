"use client";

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { BUSINESS_INFO, LEGAL_LINKS } from "@/constants/legal";

const Footer = () => {
  const t = useTranslations();
  // 연결할 문서가 없는 메뉴(회사 소개·청소년 보호정책)는 링크가 생길 때까지 노출하지 않는다
  const menuArray = [
    { text: t("footer.support"), link: "/customer-service", external: false },
    { text: t("footer.terms"), link: LEGAL_LINKS.terms, external: true },
    { text: t("footer.privacy"), link: LEGAL_LINKS.privacy, external: true },
  ];

  const businessItems = [
    { id: "footer-company-name", text: t("footer.companyName") },
    { id: "footer-representative", text: t("footer.representative") },
    { id: "footer-phone-number", text: BUSINESS_INFO.phone },
    {
      id: "footer-registration-number",
      text: `${t("footer.registrationNumberLabel")}: ${BUSINESS_INFO.registrationNumber}`,
    },
    {
      id: "footer-mail-order-number",
      text: BUSINESS_INFO.mailOrderNumber
        ? `${t("footer.mailOrderNumberLabel")}: ${BUSINESS_INFO.mailOrderNumber}`
        : "",
    },
    { id: "footer-office-address", text: t("footer.address") },
  ].filter((item) => item.text);

  return (
    <footer id="main-footer" className="flex flex-col gap-4 p-5 pb-12">
      <nav id="footer-navigation" aria-label={t("footer.menu")}>
        <ul id="footer-menu-list" className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0">
          {menuArray.map((menu) => (
            <li key={menu.text} id={`footer-menu-item-${menu.text}`}>
              <Link
                id={`footer-link-${menu.text}`}
                href={menu.link}
                target={menu.external ? "_blank" : undefined}
                rel={menu.external ? "noopener noreferrer" : undefined}
                className="body-5 text-font-1 hover:underline"
              >
                {menu.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <address
        id="footer-business-info"
        className="body-5 flex flex-wrap gap-3 text-font-disabled not-italic"
      >
        {businessItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && "|"}
            <span id={item.id}>{item.text}</span>
          </React.Fragment>
        ))}
      </address>

      <p id="footer-copyright" className="body-5 text-font-disabled">
        {t("footer.copyright")}
      </p>
    </footer>
  );
};

export default Footer;
