"use client";

import React from "react";
import { useFormContext, useWatch, FieldValues, Path } from "react-hook-form";
import SmartInput from "@/components/smart-input";
import { PhoneFill } from "@/icons";
import { LANGUAGE_LIST } from "@/constants/language";

interface PhoneFieldProps<T extends FieldValues> {
  onOpenModal: () => void;
  phoneName?: Path<T>;
  countryCodeName?: Path<T>;
}

const PhoneField = <T extends FieldValues>({
  onOpenModal,
  phoneName = "phoneNumber" as Path<T>,
  countryCodeName = "countryCode" as Path<T>,
}: PhoneFieldProps<T>) => {
  const { register, control } = useFormContext<T>();
  const phoneNumberValue = useWatch({ control, name: phoneName });
  const countryCodeValue = useWatch({ control, name: countryCodeName });

  return (
    <div onClick={onOpenModal}>
      <SmartInput
        {...register(phoneName)}
        type="modal"
        label="휴대폰"
        value={phoneNumberValue as string}
        placeholder="휴대폰 번호를 등록해보세요."
        leftElement={(() => {
          const target = LANGUAGE_LIST.find(
            (v) => v.countryCode === countryCodeValue,
          );
          if (!target) return <PhoneFill className="w-5 h-5 text-font-2" />;
          const IconComponent = target.Icon;
          return <IconComponent className="w-7.5 h-5 rounded-sm" />;
        })()}
      />
    </div>
  );
};

export default PhoneField;
