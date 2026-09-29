"use client";

import type { AgreementResultDialogProps } from "@/type/dialog";
import AgreementResultSummary from "./AgreementResultSummary";
import Dialog from "./Dialog";

/** 동의·철회 처리 결과 안내(소셜 가입 마무리·약관 재동의·마케팅 수신 설정). */
const AgreementResultDialog = ({
  onClose,
  processedAt,
  items,
}: AgreementResultDialogProps) => (
  <Dialog
    onClose={onClose}
    label="dialog.agreementResult.title"
    description={
      <AgreementResultSummary processedAt={processedAt} items={items} />
    }
    confirmText="dialog.agreementResult.confirm"
    confirmFn={onClose}
  />
);

export default AgreementResultDialog;
