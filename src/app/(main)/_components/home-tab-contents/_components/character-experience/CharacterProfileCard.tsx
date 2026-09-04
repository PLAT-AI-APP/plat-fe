import { ChatFill } from "@/icons";
import Image from "next/image";
import React from "react";
import { OfficialPreviewItem } from "@/api/home/getOfficialPreview";

interface CharacterProfileCardProps {
  item: OfficialPreviewItem;
}

const CharacterProfileCard = ({ item }: CharacterProfileCardProps) => {
  return (
    // md 미만: 전체 폭 + 정사각형 비율(반응형 수정 전 w-95×h-full 정사각형과 동일 비율)로
    // 위쪽에 쌓인다. 고정 높이(h-56) 대신 aspect-square를 쓰는 이유: 폭이 화면마다
    // 다른데 높이만 고정이면 화면이 넓을수록 크롭 비율이 가로로 길어져 이상하게 잘려 보인다.
    // max-h-95(380px)는 반응형 수정 전 원래 높이(w-95/h-full 정사각형의 절대값)를 넘지
    // 않도록 잡은 상한이다 — 폭이 380px보다 넓은 화면에서도 이미지가 끝없이 커지지 않는다.
    // md 이상: 원래처럼 고정폭+고정높이(aspect 해제)로 왼쪽에 붙는다.
    <section className="relative w-full aspect-square max-h-95 shrink-0 rounded-tl-2xl rounded-tr-2xl overflow-hidden bg-scrim inline-flex flex-col justify-end items-start md:aspect-auto md:max-h-none md:min-w-86.75 md:w-95 md:h-full md:shrink md:rounded-tr-none md:rounded-bl-2xl">

      <Image
        src={item.images[0]}
        alt={item.title}
        width={100}
        height={100}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <header className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-center gap-1 self-stretch bg-linear-to-b from-scrim/0 via-scrim/80 to-scrim px-6 pb-7 pt-9">
        <div className="inline-flex items-center gap-2.5">
          <h2 className="text-font-0 title-2 line-clamp-1">{item.title}</h2>
        </div>
        <p className="body-3 text-font-1 line-clamp-1">{item.description}</p>

        {/* 태그 리스트 영역 */}
        {item.tags.length > 0 && (
          <div className="inline-flex items-start gap-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="body-5 flex justify-center items-center"
              >
                <span className="text-font-2">#{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* 대화수 정보 */}
        <div className="inline-flex justify-center items-center gap-[4.86px]">
          <ChatFill className="size-4 text-font-2" />
          <span className="text-font-2 body-5">{item.chatCount}</span>
        </div>
      </header>
    </section>
  );
};

export default CharacterProfileCard;
