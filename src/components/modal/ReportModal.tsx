"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ActiveButton from "../ActiveButton";
import SmartInput from "@/components/smart-input";
import ChoiceChipField from "@/components/field/ChoiceChipField";
import { ModalLayout } from "../ModalLayout";
import { Close, Flag } from "@/icons";
import IconButton from "@/components/ui/IconButton";
import { notifyApiError } from "@/api";
import { useReportMutation } from "@/api/report/postReport";
import {
  REPORT_DETAIL_MAX_LENGTH,
  reportFormSchema,
  ReportFormValues,
} from "@/schema/modal.schema";
import { REPORT_REASONS, type ReportReason } from "@/type/report";
import type { AppError } from "@/type/api";
import { ReportModalProps } from "@/type/modal";
import { focusFirstFieldError } from "@/lib/formError";
import { useTranslateText } from "@/hooks/i18n/useTranslateText";
import { showAppToast } from "@/lib/toast";

const MY_REPORTS_PATH = "/my-reports";

/**
 * 다시 눌러도 결과가 같은 거절. 모달을 닫고 사정에 맞는 문구로 알린다.
 * 서버 문구 대신 앱 문구를 쓰는 이유는 "이미 신고했다"는 사실 뒤에 "결과는 신고 내역에서"
 * 라는 다음 행동까지 붙여 주기 위해서다.
 */
const REJECTION_MESSAGE_KEYS = {
  REPORT_ALREADY_SUBMITTED: "alreadySubmitted",
  REPORT_SELF_TARGET: "selfTarget",
  REPORT_TARGET_NOT_FOUND: "targetNotFound",
} as const;

type RejectionCode = keyof typeof REJECTION_MESSAGE_KEYS;

const isRejectionCode = (code: string): code is RejectionCode =>
  code in REJECTION_MESSAGE_KEYS;

/** 댓글·세계관 공용 신고. 사유 하나는 필수, 상세는 기타(ETC)일 때만 필수다. */
const ReportModal = ({ onClose, targetType, targetId }: ReportModalProps) => {
  const t = useTranslations("modalUi.report");
  const commonT = useTranslations("modalUi.common");
  const reasonT = useTranslations("report.reasons");
  const router = useRouter();
  const translateText = useTranslateText();
  const {
    control,
    register,
    handleSubmit,
    setError,
    setFocus,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reason: "",
      detail: "",
    },
  });
  const reason = useWatch({ control, name: "reason" });
  const detail = useWatch({ control, name: "detail" });
  const isDetailRequired = reason === "ETC";
  const { mutate: submitReport, isPending } = useReportMutation();

  const reasonOptions = REPORT_REASONS.map((value) => ({
    value,
    label: reasonT(value),
  }));

  const goToMyReports = () => router.push(MY_REPORTS_PATH);

  const handleReasonChange = (value: ReportReason) => {
    setValue("reason", value, { shouldValidate: Boolean(errors.reason) });
    // 기타에서 다른 사유로 바꾸면 "상세를 입력하라"는 에러가 더는 맞지 않는다.
    if (errors.detail) void trigger("detail");
  };

  const handleReportError = (error: AppError) => {
    if (isRejectionCode(error.code)) {
      showAppToast(
        error.code === "REPORT_ALREADY_SUBMITTED" ? "info" : "warning",
        t(REJECTION_MESSAGE_KEYS[error.code]),
        error.code === "REPORT_ALREADY_SUBMITTED"
          ? { action: { label: t("viewHistory"), onClick: goToMyReports } }
          : undefined,
      );
      onClose();
      return;
    }

    // 필드 사유가 온 검증 실패는 그 입력칸 밑에 말한다. 전역 정책(ReactQueryProvider)과 같은 판단이다.
    const detailError = error.fields?.detail;
    if (detailError) {
      setError("detail", { message: detailError }, { shouldFocus: true });
      return;
    }

    notifyApiError(error);
  };

  const onSubmit = (data: ReportFormValues) => {
    if (isPending || !data.reason) return;

    const trimmedDetail = data.detail.trim();

    submitReport(
      {
        targetType,
        targetId,
        reason: data.reason,
        ...(trimmedDetail ? { detail: trimmedDetail } : {}),
      },
      {
        onSuccess: () => {
          showAppToast("success", t("successToast"), {
            description: t("successDescription"),
            action: { label: t("viewHistory"), onClick: goToMyReports },
          });
          onClose();
        },
        onError: handleReportError,
      },
    );
  };

  const canSubmit =
    Boolean(reason) &&
    (!isDetailRequired || Boolean(detail.trim())) &&
    !isPending;

  return (
    <ModalLayout
      onClose={onClose}
      hasBackground
      className="w-[450px] max-w-[calc(100vw-40px)] rounded-3xl bg-dark p-5"
    >
      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) =>
          focusFirstFieldError(formErrors, setFocus, translateText),
        )}
        className="flex flex-col"
      >
        <header className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <Flag className="size-6 text-font-1" aria-hidden="true" />
            <h2 className="title-1">
              {targetType === "COMMENT" ? t("titleComment") : t("titleUniverse")}
            </h2>
          </div>
          <IconButton size="xs" onClick={onClose} aria-label={commonT("close")}>
            <Close className="size-3.5" />
          </IconButton>
        </header>
        <p className="body-6 pb-6 text-font-2">{t("description")}</p>

        <div className="flex flex-col gap-7">
          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <ChoiceChipField
                label={t("reasonLabel")}
                options={reasonOptions}
                value={field.value}
                onChange={handleReasonChange}
                required
                error={errors.reason}
                firstOptionRef={field.ref}
              />
            )}
          />
          <SmartInput
            {...register("detail")}
            type="textarea"
            value={detail}
            label={t("detailLabel")}
            required={isDetailRequired}
            showOptionalLabel={!isDetailRequired}
            maxLength={REPORT_DETAIL_MAX_LENGTH}
            minLine={5}
            maxLine={8}
            placeholder={
              isDetailRequired
                ? t("detailPlaceholderRequired")
                : t("detailPlaceholder")
            }
            error={errors.detail}
            className="flex-none"
          />
        </div>

        <ActiveButton
          type="submit"
          isActive={canSubmit}
          text={t("submit")}
          className="mt-7 h-[42px] rounded-xl"
        />
      </form>
    </ModalLayout>
  );
};

export default ReportModal;
