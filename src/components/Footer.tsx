"use client";

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { docsEntryPath } from "@/components/docs/docsPath";
import { useLocaleStore } from "@/store/useLocaleStore";
import { useSiteSettingsQuery } from "@/api/system/getSiteSettings";
import { BUSINESS_INFO, LEGAL_LINKS } from "@/constants/legal";

/** 서버 값이 비어 있으면(못 받았거나 아직 입력 전) 대체값을 쓴다. 둘 다 비면 빈 문자열 — 그 항목은 숨긴다. */
const pick = (serverValue: string | undefined, fallback = "") =>
  serverValue?.trim() || fallback;

/** "라벨: 값". 값이 없으면 빈 문자열을 돌려 항목째 숨긴다. */
const labeled = (label: string, value: string, separator = ": ") =>
  value ? `${label}${separator}${value}` : "";

const Footer = () => {
  const t = useTranslations();
  const appLocale = useLocaleStore((state) => state.locale);
  // 연결할 문서가 없는 메뉴(회사 소개)는 링크가 생길 때까지 노출하지 않는다
  const menuArray = [
    { text: t("footer.docs"), link: docsEntryPath(appLocale), external: false },
    { text: t("footer.support"), link: "/customer-service", external: false },
    { text: t("footer.terms"), link: LEGAL_LINKS.terms, external: false },
    { text: t("footer.privacy"), link: LEGAL_LINKS.privacy, external: false },
    { text: t("footer.youth"), link: LEGAL_LINKS.youth, external: false },
    { text: t("footer.refund"), link: LEGAL_LINKS.refund, external: false },
  ];

  /*
   * 사업자 정보는 관리자 콘솔 > 사이트 설정 값을 먼저 쓴다. 통신판매업 표시 의무 항목이라
   * 응답 전·API 장애 때도 비지 않도록, 번역 문구·상수에 둔 값으로 대신 그린다.
   */
  const { data: settings } = useSiteSettingsQuery();
  const privacyOfficer = pick(settings?.privacyOfficer);
  const privacyOfficerContact = pick(settings?.privacyOfficerContact);

  const businessItems = [
    {
      id: "footer-company-name",
      text: pick(settings?.companyName, t("footer.companyName")),
    },
    {
      id: "footer-representative",
      text: labeled(
        t("footer.representativeLabel"),
        pick(settings?.representative, t("footer.representative")),
        " ",
      ),
    },
    {
      id: "footer-registration-number",
      text: labeled(
        t("footer.registrationNumberLabel"),
        pick(settings?.businessNumber, BUSINESS_INFO.registrationNumber),
      ),
    },
    {
      id: "footer-mail-order-number",
      text: labeled(
        t("footer.mailOrderNumberLabel"),
        pick(settings?.mailOrderNumber, BUSINESS_INFO.mailOrderNumber),
      ),
    },
    {
      id: "footer-office-address",
      text: labeled(
        t("footer.addressLabel"),
        pick(settings?.address, t("footer.address")),
      ),
    },
    {
      id: "footer-phone-number",
      text: labeled(
        t("footer.phoneLabel"),
        pick(settings?.phone, BUSINESS_INFO.phone),
      ),
    },
    {
      id: "footer-email",
      text: labeled(t("footer.emailLabel"), pick(settings?.email)),
    },
    {
      id: "footer-support-hours",
      text: labeled(
        t("footer.supportHoursLabel"),
        pick(settings?.supportHours),
      ),
    },
    {
      id: "footer-privacy-officer",
      text: labeled(
        t("footer.privacyOfficerLabel"),
        privacyOfficer && privacyOfficerContact
          ? `${privacyOfficer} (${privacyOfficerContact})`
          : privacyOfficer || privacyOfficerContact,
      ),
    },
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
