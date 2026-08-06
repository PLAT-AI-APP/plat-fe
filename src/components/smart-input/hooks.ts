import React, { useEffect, useRef, useState } from "react";

export const useLeftPadding = (leftElement: React.ReactNode) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const [paddingLeft, setPaddingLeft] = useState<number>(16);

  useEffect(() => {
    if (leftElement && iconRef.current) {
      const iconWidth = iconRef.current.offsetWidth;
      setPaddingLeft(16 + iconWidth + 12);
    } else {
      setPaddingLeft(16);
    }
  }, [leftElement]);

  return { iconRef, paddingLeft };
};
