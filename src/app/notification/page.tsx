import { ArrowRight, Clock } from "@/icons";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React from "react";

export const NOTICE_MOCK_DATA = [
  {
    id: 1,
    category: "공지",
    title: "서비스 이용 약관 변경 안내",
    createdAt: "2026-02-03T09:00:00.000Z", // 서버에서 오는 날것의 데이터
  },
  {
    id: 2,
    category: "점검",
    title: "2월 정기 점검 안내 (2/3 02:00~06:00)",
    createdAt: "2026-02-01T15:00:00.000Z",
  },
  {
    id: 3,
    category: "일반",
    title: "서비스 이용 가이드 업데이트",
    createdAt: "2026-01-21T10:20:00.000Z",
  },
  {
    id: 4,
    category: "이벤트",
    title: "신년 맞이 출석 이벤트 당첨자 발표",
    createdAt: "2026-01-10T18:45:00.000Z",
  },
];

const NotificationPage = () => {
  return (
    <section className="flex flex-col items-center">
      <h2 className="py-4 text-white text-[20px] font-semibold text-center">
        공지사항
      </h2>

      <ul className="flex flex-col gap-1.5 max-w-155 w-11/12">
        {NOTICE_MOCK_DATA.map(({ category, createdAt, id, title }) => (
          <li
            key={id}
            className="flex justify-between items-center p-4 cursor-pointer"
          >
            <div className="flex flex-col gap-1">
              <p className="flex gap-2 font-medium">
                <span
                  className={cn(
                    "text-white",
                    category === "공지"
                      ? "text-font-accents"
                      : category === "점검" && "text-brand",
                  )}
                >
                  {`[${category}]`}
                </span>
                {title}
              </p>
              <span className="flex items-center gap-1 text-font-2 text-[13px]">
                <Clock className="w-3.5 h-3.5" />
                {dayjs(createdAt).format("YYYY. MM. DD")}
              </span>
            </div>

            <ArrowRight className="w-4.5 h-4.5" />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NotificationPage;
