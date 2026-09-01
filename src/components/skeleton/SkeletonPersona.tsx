import React from "react";

const SkeletonPersona = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 w-full skeleton rounded-xl" />
      ))}
    </div>
  );
};

export default SkeletonPersona;
