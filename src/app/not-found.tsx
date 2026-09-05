import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <section
      id="not-found-container"
      className="flex flex-col items-center justify-center flex-1"
    >
      <h2 id="not-found-code" className="display-1 text-brand">
        404
      </h2>
      <p id="not-found-message" className="body-2 mt-4 text-font-2">
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Link
        id="back-to-home-link"
        href="/"
        className="title-5 mt-8 rounded-lg bg-brand px-6 py-3 text-on-brand transition hover:brightness-110"
      >
        홈으로 돌아가기
      </Link>
    </section>
  );
};

export default NotFoundPage;
