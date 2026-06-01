"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import SignupForm from "./_components/SignupForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { authFormSchema, AuthFormValues } from "@/schema/auth.schema";

const SignupPage = () => {
  const methods = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      nickname: "",
      email: "",
      code: "",
      password: "",
      passwordCheck: "",
      isPrivacyAgreed: false,
      isTermsAgreed: false,
      isAgeAgreed: false,
    },
  });

  return (
    <FormProvider {...methods}>
      <SignupForm />
    </FormProvider>
  );
};

export default SignupPage;
