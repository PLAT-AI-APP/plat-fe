"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import SmartInput from "../SmartInput";
import GoogleProvider from "@/icons/provider/GoogleProvider";
import KakaoProvider from "@/icons/provider/KakaoProvider";
import PlatProvider from "@/icons/provider/PlatProvider";

const PROVIDER_LOGOS: Record<string, React.ReactNode> = {
  google: <GoogleProvider />,
  kakao: <KakaoProvider />,
  plat: <PlatProvider />,
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
    />
  );
};

export default AccountField;
