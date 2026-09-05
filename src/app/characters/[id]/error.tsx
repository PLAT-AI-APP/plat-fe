"use client";

import RouteError from "@/components/state/RouteError";

/**
 * 이 세그먼트에서 렌더가 터졌을 때의 경계.
 * 앱 껍데기(헤더·사이드바)는 살려 두고 이 영역만 대체한다.
 */
const SegmentError = (props: {
  error: Error & { digest?: string };
  reset: () => void;
}) => <RouteError {...props} />;

export default SegmentError;
