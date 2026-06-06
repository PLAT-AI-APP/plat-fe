"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import GoogleProvider from "@/icons/provider/GoogleProvider";
import KakaoProvider from "@/icons/provider/KakaoProvider";
import PlatProvider from "@/icons/provider/PlatProvider";
import SmartInput from "../smart-input";

const PROVIDER_LOGOS: Record<string, React.ReactNode> = {
  GOOGLE: <GoogleProvider />,
  KAKAO: <KakaoProvider />,
  EMAIL: <PlatProvider />,
};

const AccountField = () => {
  const { register, control } = useFormContext();
  const email = useWatch({ control, name: "email" });
  const provider = useWatch({ control, name: "provider" });

  return (
    <SmartInput
      {...register("email")}
      label="계정"
      disabled
      value={email}
      leftElement={PROVIDER_LOGOS[provider]}
      labelFontSize="title-5"
    />
  );
};

export default AccountField;
