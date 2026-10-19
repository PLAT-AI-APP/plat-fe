"use client";

import React from "react";
import { useEarningSummaryQuery } from "@/api/earning/getEarningSummary";
import GiftCardList from "../_components/GiftCardList";

/** 교환 탭. 교환 가능 포인트로 상품권을 고른다. */
const ExchangeContents = () => {
  const { data } = useEarningSummaryQuery();
  // 값이 오기 전이나 없을 때는 막아 둔다. 서버도 인증이 없으면 상품권 신청을 거절한다.
  return (
    <GiftCardList
      available={data?.available ?? 0}
      identityVerified={data?.identityVerified === true}
    />
  );
};

export default ExchangeContents;
