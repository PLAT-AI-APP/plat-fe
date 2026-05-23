import { cn } from "@/lib/utils";
import React from "react";

export const CharacterAvatar = () => (
  <div
    data-property-1="P6"
    className="size-10 relative bg-linear-225 from-orange-500 to-red-500 rounded-[100px] overflow-hidden shrink-0"
  >
    <div className="w-8 h-9 left-[33.51px] top-[16.50px] absolute origin-top-left rotate-[142.81deg] bg-orange-300 rounded-full" />
    <div className="size-[1.53px] left-[18.29px] top-[21.02px] absolute bg-font-2 rounded-full" />
    <div className="size-[1.53px] left-[20.43px] top-[13.07px] absolute bg-font-2 rounded-full" />
    <div className="w-[3.16px] h-0.5 left-[15.70px] top-[16.49px] absolute origin-top-left rotate-[135.34deg] bg-font-2" />
  </div>
);

export const ChatBubble = ({
  name,
  message,
}: {
  name: string;
  message: string;
}) => (
  <div className="w-full inline-flex justify-start items-start gap-2">
    <CharacterAvatar />
    <div className="inline-flex flex-col justify-start items-start gap-1.5 overflow-hidden">
      <span className="justify-start text-font-1 text-sm">{name}</span>
      <div className="px-3 py-2 bg-bg-card rounded-tr-2xl rounded-bl-2xl rounded-br-2xl inline-flex justify-center items-center gap-2.5 overflow-hidden">
        <p className="justify-start text-font-0 text-sm">{message}</p>
      </div>
    </div>
  </div>
);

export const NarrativeBlock = ({ content }: { content: string }) => (
  <div className="inline-flex justify-start items-start gap-5 w-full">
    <div className="size-7 relative overflow-hidden shrink-0">
      <div className="size-6 left-[2.33px] top-[3.50px] absolute bg-font-2" />
    </div>
    <p className="flex-1 justify-start text-font-2 text-sm leading-relaxed whitespace-pre-wrap">
      {content}
    </p>
  </div>
);

export const ActionFooter = ({ isActive = true }: { isActive: boolean }) => (
  <footer className="w-full right-0 bottom-0 absolute inline-flex flex-col justify-start items-center gap-1">
    <div
      className="w-full h-32 left-0 bottom-0 absolute 
             bg-linear-to-b from-neutral-900/0 via-neutral-900/50 to-neutral-900 
             rounded-br-2xl backdrop-blur-[1.5px]
             mask-[linear-gradient(to_bottom,transparent,black_20%)]"
    />
    <div className="self-stretch flex flex-col justify-start items-center gap-1.25 z-30">
      <div className="self-stretch inline-flex justify-center items-center gap-1">
        <p className="body-4 text-center justify-start text-font-0">
          {isActive
            ? "이 캐릭터와 무료로 3회 대화할 수 있어요"
            : "이미 3번의 무료 대화를 진행했어요 "}
        </p>
      </div>
      <button
        className={cn(
          "self-stretch h-16 relative bg-brand rounded-br-2xl backdrop-blur-[5.05px] cursor-pointer border-none outline-none",
          !isActive && "bg-border-main",
        )}
      >
        <span
          className={cn(
            "title-3 justify-start text-font-4",
            !isActive && "text-font-disabled",
          )}
        >
          이 캐릭터와 대화하기
        </span>
      </button>
    </div>
  </footer>
);
