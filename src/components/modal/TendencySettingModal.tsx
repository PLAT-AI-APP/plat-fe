import React, { useState } from "react";
import { ModalLayout } from "../ModalLayout";
import { Close, Setting } from "@/icons";
import { cn } from "@/lib/utils";
import Check from "@/icons/Check";

const tendencyArray = [
  { name: "전체", color: "#AA8BD8" },
  { name: "남성향", color: "#60A5FA" },
  { name: "여성향", color: "#F472B6" },
];

interface TendencySettingModalProps {
  onClose: () => void;
}
const TendencySettingModal = ({ onClose }: TendencySettingModalProps) => {
  const [cureentTendency, setCurrentTendency] =
    useState<(typeof tendencyArray)[number]["name"]>("전체");

  const handleCurrentTendency = (name: string) => {
    setCurrentTendency(name);
  };
  return (
    <ModalLayout onClose={onClose} className="rounded-3xl p-5 w-70 cursor-auto">
      <div onClick={(e) => e.stopPropagation()}>
        <header className="pb-6 flex items-center justify-between text-font-1">
          <div className="flex gap-3 items-center">
            <Setting className="w-6 h-6 " />
            <span className="text-[20px] font-medium">콘텐츠 설정</span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg hover:bg-btn-hover"
          >
            <Close className="w-3.5 h-3.5 cursor-pointer" />
          </button>
        </header>

        <ul className="flex flex-col gap-2">
          {tendencyArray.map(({ color, name }) => (
            <li
              key={name}
              onClick={() => handleCurrentTendency(name)}
              className={cn(
                "cursor-pointer flex justify-between p-3 rounded-2xl border border-border-main bg-card",
                cureentTendency === name
                  ? "border-brand bg-brand-opacity"
                  : "hover:bg-card-hover",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full`}
                  style={{ backgroundColor: color }}
                />
                {name}
              </div>

              {cureentTendency === name && (
                <Check className="w-4.5 h-4.5 text-brand" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </ModalLayout>
  );
};

export default TendencySettingModal;
