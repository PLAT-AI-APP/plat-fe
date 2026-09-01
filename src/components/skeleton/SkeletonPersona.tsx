import React from "react";

const SkeletonPersona = () => {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 w-full bg-card-hover rounded-xl" />
      ))}
    </div>
  );
};

export default SkeletonPersona;
