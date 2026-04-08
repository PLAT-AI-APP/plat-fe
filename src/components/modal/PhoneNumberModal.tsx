"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { ModalLayout } from "../ModalLayout";
import { ArrowDown, ArrowUp, Close } from "@/icons";
import OtpInput from "../auth/OtpInput";
import { useFormContext } from "react-hook-form";
import { ProfileEditFormType } from "@/type/user";
import { LANGUAGE_LIST } from "@/constants/language";
import ActiveButton from "../ActiveButton";
import { cn } from "@/lib/utils";

interface PhoneNumberModalProps {
  onClose: () => void;
}

const PhoneNumberModal = ({ onClose }: PhoneNumberModalProps) => {
  const { watch, setValue } = useFormContext<ProfileEditFormType>();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [phoneNum, setPhoneNum] = useState("");
  const [isCountryModal, setIsCountryModal] = useState(false);

  const currentCountryCode = watch("countryCode");
  const triggerRef = useRef(null);

  // --- 데이터 가공 및 파생 변수 ---
  const isPhoneValid = useMemo(() => {
    const config = LANGUAGE_LIST.find(
      (v) => v.countryCode === currentCountryCode,
    );
    const pureNumbers = phoneNum?.replace(/\D/g, "");
    return config ? pureNumbers?.length === config.length : false;
  }, [phoneNum, currentCountryCode]);

  // --- 로직 및 이벤트 핸들러 ---
  useEffect(() => {
    if (!isOtpSent || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isOtpSent, timeLeft]);

  const handlePhoneNum = (text: string) => {
    const pureNumbers = text.replace(/[^0-9]/g, "");
    const config = LANGUAGE_LIST.find(
      (v) => v.countryCode === currentCountryCode,
    );

    if (!config) {
      setPhoneNum(pureNumbers);
      return;
    }

    const truncatedNumbers = pureNumbers.slice(0, config.length);
    let formattedNumber = "";
    let numberIndex = 0;
    const format = config.format;

    for (
      let i = 0;
      i < format.length && numberIndex < truncatedNumbers.length;
      i++
    ) {
      if (format[i] === "#") {
        formattedNumber += truncatedNumbers[numberIndex];
        numberIndex++;
      } else {
        formattedNumber += format[i];
      }
    }
    setPhoneNum(formattedNumber);
  };

  const handleOtpComplete = (code: string) => {
    const CORRECT_CODE = "123456";
    if (code === CORRECT_CODE) {
      onClose();
    } else {
      setOtpError("인증번호가 일치하지 않습니다.");
    }
  };

  const toggleIsCountryModal = () => {
    setIsCountryModal((prev) => !prev);
  };

  const handleCountryCode = (code: string) => {
    setValue("countryCode", code);
  };

  const renderFlagIcon = () => {
    const target = LANGUAGE_LIST.find(
      (v) => v.countryCode === currentCountryCode,
    );
    const FlagIcon = target?.Icon;
    return FlagIcon ? (
      <FlagIcon className="w-7 h-4.5 rounded-sm object-cover" />
    ) : null;
  };

  return (
    <ModalLayout onClose={onClose} hasBackground className="p-5 w-86">
      <section id="phone-auth-container" className="flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <h2 className="text-[20px] font-medium">휴대폰 인증</h2>
          <Close onClick={onClose} className="w-5 h-5 cursor-pointer" />
        </header>

        <div className="flex flex-col gap-4">
          <article
            id="phone-input-section"
            className={"flex flex-col flex-1 gap-2 w-full"}
          >
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1 font-medium text-sm">
                <span>전화번호</span>
              </label>
            </div>
            <div className="flex gap-2">
              <div
                ref={triggerRef}
                onClick={toggleIsCountryModal}
                className={cn(
                  "cursor-pointer relative flex gap-1 items-center px-1.75 py-3 bg-bg-darkest border border-border-main rounded-xl outline-none",
                )}
              >
                {renderFlagIcon()}

                {isCountryModal ? (
                  <ArrowUp className="w-3 h-3 text-font-2" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-font-2" />
                )}

                {isCountryModal && (
                  <ModalLayout
                    onClose={toggleIsCountryModal}
                    triggerRef={triggerRef}
                    className="w-80.75 left-0"
                  >
                    <nav>
                      <ul>
                        {LANGUAGE_LIST.map(
                          ({ Icon, code, eng, countryCode }) => (
                            <li
                              key={code}
                              onClick={() => handleCountryCode(countryCode)}
                              className="text-sm flex justify-between px-2.5 py-2 rounded-lg hover:bg-btn-hover cursor-pointer"
                            >
                              <div className="flex gap-2">
                                <Icon />
                                <span>{eng}</span>
                              </div>
                              <span className="text-white">{countryCode}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </nav>
                  </ModalLayout>
                )}
              </div>
              <input
                value={phoneNum}
                readOnly={isOtpSent}
                onChange={(e) => handlePhoneNum(e.target.value)}
                placeholder="전화번호 입력"
                className={cn(
                  "flex-1 px-4 py-3 bg-bg-darkest border border-border-main rounded-xl outline-none placeholder:text-font-disabled",
                )}
              />
            </div>
          </article>

          {isOtpSent && (
            <div className="[&_input]:border-border-main">
              <OtpInput
                timeLeft={timeLeft}
                error={otpError}
                onComplete={handleOtpComplete}
                onResend={() => setTimeLeft(300)}
              />
            </div>
          )}

          {!isOtpSent ? (
            <ActiveButton
              text="인증번호 전송"
              isActive={isPhoneValid}
              disabled={!isPhoneValid}
              onClick={() => setIsOtpSent(true)}
              className="rounded-xl"
            />
          ) : (
            <ActiveButton
              text="확인"
              isActive
              onClick={onClose}
              className="rounded-xl"
            />
          )}
        </div>
      </section>
    </ModalLayout>
  );
};

export default PhoneNumberModal;
