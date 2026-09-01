"use client";

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations();
  const menuArray = [
    { text: t("footer.about"), link: "#" },
    { text: t("footer.support"), link: "#" },
    { text: t("footer.terms"), link: "#" },
    { text: t("footer.privacy"), link: "#" },
    { text: t("footer.youth"), link: "#" },
  ];

  return (
    <footer id="main-footer" className="flex flex-col gap-4 p-5 pb-12">
      <nav id="footer-navigation" aria-label={t("footer.menu")}>
        <ul id="footer-menu-list" className="m-0 flex list-none gap-3 p-0">
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

      <address
        id="footer-business-info"
        className="body-4 flex flex-wrap gap-3 text-font-disabled not-italic"
      >
        <span id="footer-company-name">{t("footer.companyName")}</span>|
        <span id="footer-representative">{t("footer.representative")}</span>|
        <span id="footer-phone-number">02-123-4567</span>|
        <span id="footer-registration-number">
          {t("footer.registrationNumberLabel")}: 227-40-01411
        </span>
        |<span id="footer-office-address">{t("footer.address")}</span>
      </address>

      <p id="footer-copyright" className="body-4 text-font-disabled">
        {t("footer.copyright")}
      </p>
    </footer>
  );
};

export default Footer;
