"use client";
import { AuthFormValues } from "@/type/auth";
import { FormProvider, useForm } from "react-hook-form";
import SignupForm from "./_components/SignupForm";

const SignupPage = () => {
  const methods = useForm<AuthFormValues>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      nickname: "",
      email: "",
      otp: "",
      password: "",
      passwordConfirm: "",

      emailVerifyToken: "",
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
