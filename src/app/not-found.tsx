import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <section
      id="not-found-container"
      className="flex flex-col items-center justify-center flex-1"
    >
      <h2 id="not-found-code" className="text-6xl font-bold text-brand">
        404
      </h2>
      <p id="not-found-message" className="text-font-2 mt-4 text-lg">
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link
        id="back-to-home-link"
        href="/"
        className="mt-8 px-6 py-3 bg-brand text-white rounded-lg hover:brightness-110 transition-all font-semibold"
      >
        홈으로 돌아가기
      </Link>
    </section>
  );
};

export default NotFoundPage;
