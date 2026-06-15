"use client";

import React from "react";
import { useTranslations } from "next-intl";

const PolicyGuide = () => {
  const t = useTranslations();
  const policies = [
    t("tokenCharge.policies.item1"),
    t("tokenCharge.policies.item2"),
    t("tokenCharge.policies.item3"),
    t("tokenCharge.policies.item4"),
    t("tokenCharge.policies.item5"),
    t("tokenCharge.policies.item6"),
    t("tokenCharge.policies.item7"),
  ];

  return (
    <section className="title-6 flex flex-col gap-1 pt-12 text-font-disabled">
      <h3>{t("tokenCharge.policiesTitle")}</h3>
      <ul className="flex flex-col gap-1.5">
        {policies.map((policy, index) => (
          <li key={index} className="flex items-center gap-2 leading-relaxed">
            <span className="ml-2 h-0.5 w-0.5 rounded-full bg-font-disabled" />
            <span>{policy}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PolicyGuide;
