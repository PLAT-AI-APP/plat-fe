"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import SignupForm from "./_components/SignupForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { authFormSchema } from "@/schema/auth.schema";
import z from "zod";

const SignupPage = () => {
  const methods = useForm<z.input<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      nickname: "",
      email: "",
      code: "",
      password: "",
      passwordCheck: "",
      signupToken: "",
      isPrivacyAgreed: false,
      isTermsAgreed: false,
    },
  });

  return (
    <FormProvider {...methods}>
      <SignupForm />
    </FormProvider>
  );
};

export default SignupPage;
