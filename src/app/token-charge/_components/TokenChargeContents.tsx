import Token from "@/icons/Token";
import React from "react";
import PolicyGuide from "./PolicyGuide";
import Badge from "./Badge";
import { cn, formatWithCommas } from "@/lib/utils";

export interface ProductItem {
  id: string;
  title: number; // 상품명 (예: "5,000 노트")
  bonus?: string; // 추가 증정 문구 (예: "+500개")
  price: number; // 현재 판매가
  originalPrice?: number; // 할인 전 가격
  discountRate?: number; // 할인율 (단위: %)
  badges?: ("popular" | "firstCharge")[]; // 뱃지 목록
}

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: "1",
    title: 5000,
    price: 4900,
  },
  {
    id: "2",
    title: 10000,
    bonus: "+500",
    price: 9900,
  },
  {
    id: "3",
    title: 20000,
    bonus: "+2,500",
    price: 19900,
    badges: ["firstCharge", "popular"],
  },
  {
    id: "4",
    title: 46000,
    bonus: "+5,000",
    price: 30900,
    originalPrice: 45900,
    discountRate: 34,
    badges: ["firstCharge"],
  },
  {
    id: "5",
    title: 90000,
    bonus: "+11,000",
    price: 89900,
  },
];

const TokenChargeContents = () => {
  return (
    <section className="mx-auto max-w-160 w-full pt-5 px-9">
      <div className="flex flex-col gap-2 mb-9 py-4 px-5 bg-bg-darker border border-border-main rounded-3xl">
        <span className="body-4 text-font-2">내 노트</span>
        <div className="flex items-center gap-2 title-1">
          <Token className="w-6 h-6" /> 9,999
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="title-2 text-white">상품 구매</h3>

        <ul className="flex flex-col gap-3">
          {MOCK_PRODUCTS.map((product) => (
            <li
              key={product.id}
              className={cn(
                "relative hover:bg-btn-hover cursor-pointer rounded-2xl border border-border-main py-4 px-5",
                product.badges && "pt-0",
              )}
            >
              {product.badges && (
                <div className="flex gap-2 pb-3">
                  {product.badges.map((badge) => (
                    <Badge type={badge} key={badge} />
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Token className="w-8 h-8" />
                  <div className="flex gap-2">
                    <p className="flex gap-1 body-2">
                      <span>{formatWithCommas(product.title)}</span>{" "}
                      <span>노트</span>
                    </p>

                    {product.bonus && (
                      <span className="text-brand-dark title-3">
                        {product.bonus}노트
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {product.discountRate && (
                    <span className="body-5 text-font-disabled line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    {product.discountRate && (
                      <span className="title-5 text-brand">
                        {product.discountRate}%
                      </span>
                    )}

                    <span className="title-3">
                      {formatWithCommas(product.price)}원
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <PolicyGuide />
    </section>
  );
};

export default TokenChargeContents;
