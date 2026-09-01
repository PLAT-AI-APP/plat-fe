import React from "react";

const SkeletonCharacterList = () => {
  return (
    <article className="flex gap-2 px-3 py-2.5 rounded-2xl">
      <div className="w-20.5 h-20.5 rounded-xl skeleton" />

      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-33.75 rounded-full skeleton"></div>

          <p className="h-5 w-62.5 rounded-full skeleton"></p>
        </div>

        <div className="h-5 w-20 rounded-full skeleton"></div>
      </div>
    </article>
  );
};

export default SkeletonCharacterList;
