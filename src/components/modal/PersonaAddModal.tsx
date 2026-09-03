"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalLayout } from "../ModalLayout";
import { Close, Persona } from "@/icons";
import SmartInput from "@/components/smart-input";
import { useAddPersonaMutation } from "@/api/persona/addPersona";
import { useEditPersonaMutation } from "@/api/persona/editPersona";
import { useDetailPersonaQuery } from "@/api/persona/detailPersons";
import { PersonaAddModalProps } from "@/type/modal";
import { personaFormSchema, PersonaFormValues } from "@/schema/modal.schema";
import { showFirstFieldErrorToast } from "@/lib/formError";
import { useTranslateText } from "@/hooks/useTranslateText";

const PersonaAddModal = ({
  onClose,
  isEditMode = false,
  personaId,
  name: initialName,
  description: initialDescription,
}: PersonaAddModalProps) => {
  const t = useTranslations("modalUi.personaAdd");
  const commonT = useTranslations("modalUi.common");
  const translateText = useTranslateText();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors, isValid },
  } = useForm<PersonaFormValues>({
    mode: "onChange",
    resolver: zodResolver(personaFormSchema),
    defaultValues: {
      name: "",
      info: "",
    },
  });

  // 목록에서 받은 수정 초기값 존재 여부
  const hasInitialPersona = Boolean(initialName || initialDescription);
  const { data: personaDetail } = useDetailPersonaQuery(personaId as string, {
    enabled: isEditMode && !!personaId && !hasInitialPersona,
  });

  useEffect(() => {
    if (isEditMode && (initialName || initialDescription)) {
      reset({
        name: initialName ?? "",
        info: initialDescription ?? "",
      });
      return;
    }

    if (isEditMode && personaDetail) {
      reset({
        name: personaDetail.name,
        info: personaDetail.description,
      });
    }
  }, [initialDescription, initialName, isEditMode, personaDetail, reset]);

  const { mutate: addPersona } = useAddPersonaMutation();
  const { mutate: editPersona } = useEditPersonaMutation();
  const name = useWatch({ control, name: "name" }) ?? "";
  const info = useWatch({ control, name: "info" }) ?? "";

  const onSubmit = () => {
    if (isEditMode && personaId) {
      editPersona({ personaId, description: info, name });
    } else {
      addPersona({ description: info, name });
    }
    onClose();
  };

  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="top-1/2 left-1/2 h-fit w-screen max-w-125 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-main bg-dark p-5"
    >
      <header className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Persona className="h-6 w-6" />
            <h2 className="title-1 text-font-1">
              {isEditMode ? t("titleEdit") : t("titleAdd")}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label={commonT("close")}
            className="h-5.5 w-5.5 rounded-lg p-1 transition-colors hover:bg-btn-hover"
          >
            <Close className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="body-4 whitespace-normal pt-2 text-font-2">
          {t("description")}
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit, (formErrors) =>
          showFirstFieldErrorToast(formErrors, setFocus, translateText),
        )}
      >
        <div className="flex flex-col gap-6">
          <SmartInput
            label={t("nameLabel")}
            required
            maxLength={20}
            placeholder={t("namePlaceholder")}
            value={name}
            error={errors.name ? "" : undefined}
            {...register("name")}
          />

          <SmartInput
            label={t("infoLabel")}
            maxLength={200}
            minLine={4}
            maxLine={4}
            type="textarea"
            isBorder
            inputClassName="max-h-30.25"
            placeholder={t("infoPlaceholder")}
            value={info}
            error={errors.info ? "" : undefined}
            {...register("info")}
            showOptionalLabel
          />
        </div>

        <footer className="pt-9">
          <button
            type="submit"
            disabled={!isValid}
            className={`mt-3 w-full rounded-xl py-3 title-3 transition-colors ${
              isValid
                ? "bg-brand/10 text-brand-dark"
                : "cursor-not-allowed bg-card text-font-disabled"
            }`}
          >
            {isEditMode ? t("submitEdit") : t("submitAdd")}
          </button>
        </footer>
      </form>
    </ModalLayout>
  );
};

export default React.memo(PersonaAddModal);
