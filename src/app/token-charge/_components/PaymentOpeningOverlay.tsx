"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import PaymentPending from "@/app/payments/[provider]/[result]/_components/PaymentPending";
import { TRANSITION } from "@/constants/motion";

/**
 * 주문을 만들고 결제창으로 넘어가는 동안 충전 페이지를 덮는 대기 화면.
 * 결제창에서 뒤로 돌아오면 이 화면이 그대로 복원되므로 빠져나갈 버튼을 둔다.
 */
const PaymentOpeningOverlay = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations("tokenCharge.payment");

  // 떠 있는 동안 뒤 페이지가 스크롤되지 않게 한다.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return createPortal(
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label={t("openingTitle")}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-dark/90 px-5 py-10 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITION}
    >
      <div className="w-full max-w-120 text-center">
        <PaymentPending
          phase="opening"
          actions={
            <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
              {t("stopPayment")}
            </Button>
          }
        />
      </div>
    </m.div>,
    document.body,
  );
};

export default PaymentOpeningOverlay;
