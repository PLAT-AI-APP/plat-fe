import React from "react";

const PolicyGuide = () => {
  const policies = [
    "사용 이력이 있는 노트에 대해서는 환불이 불가능합니다. (단, 미사용 상품은 결제 후 7일 이내 환불 가능)",
    "구매한 유료 노트의 유효기간은 획득 시점으로 부터 1년입니다.",
    "AI의 답변 결과에 대한 주관적인 불만족이나 단순 변심으로 인한 환불은 불가능합니다.",
    "환불 요청 및 문의는 플랫 고객센터를 통해서 가능합니다.",
    "무료로 제공된 노트는 환불 대상에서 제외되며, 유효기간은 지급 방식에 따라 다를 수 있습니다.",
    "노트는 유효기간이 임박한 순서대로 자동으로 사용됩니다.",
    "그 외 도움이 필요하신 점이 있다면 플랫 고객센터로 문의해 주세요.",
  ];

  return (
    <section className="flex flex-col gap-1 pt-12 text-font-disabled title-6">
      <h3>환불 정책 및 노트 이용 안내</h3>
      <ul className="flex flex-col gap-1.5">
        {policies.map((policy, index) => (
          <li key={index} className="leading-relaxed flex items-center gap-2">
            {/* 불렛 포인트를 위한 점(dot) */}
            <span className="ml-2 w-0.5 h-0.5 rounded-full bg-font-disabled" />

            <span>{policy}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PolicyGuide;
