/** 상품 노출 정보 */
export interface ProductDisplay {
  name: string;
  description: string;
}

/** 상품 가격 */
export interface ProductPrice {
  currency: string;
  /** 통화 최소 단위 금액 (KRW는 소수 단위가 없어 원 금액과 동일) */
  amountMinor: number;
  taxIncluded: boolean;
  /** 할인 전 정가. 할인 상품에만 내려오며 할인율은 판매가와 비교해 계산합니다. */
  listAmountMinor?: number;
}

/** 상품 지급 노트 */
export interface ProductCredits {
  base: number;
  bonus: number;
  total: number;
}

/** 결제 상품 */
export interface Product {
  code: string;
  productId: number;
  display: ProductDisplay;
  price: ProductPrice;
  credits: ProductCredits;
}
