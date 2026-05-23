import React from "react";

const SkeletonCharacterExperience = () => {
  return (
    <div className="w-300 inline-flex justify-start items-center">
      <div className="w-80 h-130.5 bg-card-hover rounded-tl-2xl rounded-bl-2xl" />
      <div className="w-213.25 h-130.5 pl-9 pr-4 py-14 bg-bg-darkest rounded-tr-2xl rounded-br-2xl flex justify-start items-center gap-5">
        <div className="size- flex justify-start items-start gap-5">
          <div className="size-14 bg-card-hover rounded-full" />
          <div className="size- inline-flex flex-col justify-start items-start gap-11">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="w-96 h-8 bg-card-hover rounded-[30px]" />
              <div className="w-155.75 h-8 bg-card-hover rounded-[30px]" />
            </div>
            <div className="w-155.75 h-48 bg-card-hover rounded-[20px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCharacterExperience;
