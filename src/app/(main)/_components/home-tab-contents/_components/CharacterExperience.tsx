"use client";
import { ArrowLeft, ArrowRight, ChatFill } from "@/icons";
import Logo from "@/icons/Logo";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import React, { useCallback } from "react";

const CharacterExperience = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    // Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  // 컴포넌트 렌더링 시마다 확인
  React.useEffect(() => {
    console.log("Embla API 상태:", emblaApi);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    console.log("Prev clicked");
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    console.log("Next clicked");
    emblaApi.scrollNext();
  }, [emblaApi]);
  return (
    <section className="flex flex-col gap-4.5">
      <header className="flex justify-between">
        <h2 className="heading-3">
          <span className="flex items-center gap-2 ">
            플랫의 공식 캐릭터 맛보기 <Logo className="w-4.5 h-4.5" />
          </span>
        </h2>
        <div className="size- inline-flex justify-start items-center gap-4">
          <Image
            alt=""
            width={0}
            height={0}
            className="size-12 rounded-full border-[3px] border-brand"
            src="/images/sample.png"
          />
          <Image
            alt=""
            width={0}
            height={0}
            className="size-12 rounded-full"
            src="/images/sample.png"
          />
          <Image
            alt=""
            width={0}
            height={0}
            className="size-12 rounded-full"
            src="/images/sample.png"
          />
        </div>
      </header>
      <article className="relative max-w-full w-full min-h-130.5 bg-neutral-900">
        {/* 1. 뷰포트 (ref 연결) */}
        <div className="w-full h-full overflow-hidden" ref={emblaRef}>
          {/* 2. 트랙 컨테이너 (flex 필수) */}
          <div className="flex w-full h-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex min-w-full h-full">
                {/* 캐릭터 프로필 카드 섹션 */}
                <section className="relative min-w-86.75 bg-white w-80 h-full rounded-tl-2xl rounded-bl-2xl inline-flex flex-col justify-end items-start">
                  <Image
                    src={"/public/images/sample.png"}
                    alt=""
                    width={100}
                    height={100}
                  />
                  <header className="absolute left-0 bottom-0 self-stretch px-6 pt-9 pb-7 bg-gradient-to-b from-neutral-950/0 to-neutral-950/70 rounded-bl-2xl flex flex-col justify-center items-start gap-1">
                    <div className="inline-flex justify-start items-center gap-2.5">
                      <h2 className="justify-start text-font-0 heading-2">
                        제목제목제목제목제목{index}
                      </h2>
                    </div>
                    <p className="body-1 self-stretch justify-start text-font-1  line-clamp-1">
                      가나다라마바사아자차카타파나다라마바사아자차카타파하
                    </p>

                    {/* 태그 리스트 영역 */}
                    <div className="inline-flex justify-start items-start gap-1">
                      <span
                        data-취소-아이콘="true"
                        className="body-4 pl-1.5 pr-1 py-0.5 bg-card rounded-md backdrop-blur-[2px] flex justify-center items-center"
                      >
                        <span className="flex justify-start items-center gap-0.5">
                          <span className="justify-start text-brand">#</span>
                          <span className="justify-start text-brand">태그</span>
                        </span>
                      </span>
                    </div>

                    {/* 대화수 정보 */}
                    <div className="inline-flex justify-center items-center gap-[4.86px]">
                      <ChatFill className="w-5 h-5 text-font-2" />
                      <span className="justify-start text-font-2 body-2">
                        235
                      </span>
                    </div>
                  </header>
                </section>

                {/* 미리보기 대화창 세션 */}
                <section className="relative flex-1 h-full min-w-0 bg-bg-darker rounded-tr-2xl rounded-br-2xl flex flex-col">
                  <div
                    id="preview-chat-container"
                    className="w-full h-96 pl-9 pr-8 pb-8 inline-flex flex-col justify-start items-start gap-6"
                  >
                    {/* 상대방 캐릭터 메시지 블록 */}
                    <div className="w-96 inline-flex justify-start items-start gap-2">
                      <div
                        data-property-1="P6"
                        className="size-10 relative bg-linear-225 from-orange-500 to-red-500 rounded-[100px] overflow-hidden"
                      >
                        <div className="w-8 h-9 left-[33.51px] top-[16.50px] absolute origin-top-left rotate-[142.81deg] bg-orange-300 rounded-full" />
                        <div className="size-[1.53px] left-[18.29px] top-[21.02px] absolute bg-font-2 rounded-full" />
                        <div className="size-[1.53px] left-[20.43px] top-[13.07px] absolute bg-font-2 rounded-full" />
                        <div className="w-[3.16px] h-0.5 left-[15.70px] top-[16.49px] absolute origin-top-left rotate-[135.34deg] bg-font-2" />
                      </div>
                      <div className="inline-flex flex-col justify-start items-start gap-1.5">
                        <span className="justify-start text-font-1">
                          캐릭터 이름이름
                        </span>
                        <div className="px-3 py-2 bg-bg-card rounded-tr-2xl rounded-bl-2xl rounded-br-2xl inline-flex justify-center items-center gap-2.5 overflow-hidden">
                          <p className="justify-start text-font-0">
                            말말말말말말말말말말말말말말말말말말말말말말말말
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 시스템 정보 및 본문 대화 내용 */}
                    <div className="inline-flex justify-start items-start gap-5">
                      <div className="size-7 relative overflow-hidden">
                        <div className="size-6 left-[2.33px] top-[3.50px] absolute bg-font-2" />
                      </div>
                      <p className="w-[694px] justify-start text-font-2">
                        &#123;&#123;user&#125;&#125;이 문을 열고 들어오는 찰나,
                        연우는 숨을 멈춘 채로 굳어버렸다. 그의 시선은 오직
                        신에게만 꽂혀 있었고, 그의 말처럼 숨을 크게 쉬려 애쓰는
                        모습이 역력했지만, 그 시도는 잘 되지 않는 듯 가슴팍만
                        작게 들썩였다.
                        <br />
                        <br />
                        신이 들어오자마자 연우는 본능적으로 몸을 뒤로 빼며 벽에
                        등을 완전히 밀착시켰다. 그의 얼굴은 극도로 창백했고,
                        동그란 눈은 공포에 질려 신을 향해 고정되어 있었다.
                        여전히 헐렁한 브라운 니트가 그의 가녀린 어깨 위에서
                        흘러내리듯 걸쳐져 있었다.
                      </p>
                    </div>

                    <div className="inline-flex justify-start items-start gap-5">
                      <div className="size-7 relative overflow-hidden">
                        <div className="size-6 left-[2.33px] top-[3.50px] absolute bg-font-2" />
                      </div>
                      <p className="w-[612px] justify-start text-font-2">
                        &#123;&#123;user&#125;&#125;이 문을 열고 들어오는 찰나,
                        연우는 숨을 멈춘 채로 굳어버렸다. 그의 시선은 오직
                        신에게만 꽂혀 있었고, 그의 말처럼 숨을 크게 쉬려 애쓰는
                        모습이 역력했지만, 그 시도는 잘 되지 않는 듯 가슴팍만
                        작게 들썩였다.
                        <br />
                      </p>
                    </div>

                    <div className="inline-flex justify-start items-start gap-5">
                      <div className="size-7 relative overflow-hidden">
                        <div className="size-6 left-[2.33px] top-[3.50px] absolute bg-font-2" />
                      </div>
                      <p className="w-full justify-start text-font-2">
                        &#123;&#123;user&#125;&#125;이 문을 열고 들어오는 찰나,
                        연우는 숨을 멈춘 채로 굳어버렸다. 그의 시선은 오직
                        신에게만 꽂혀 있었고, 그의 말처럼 숨을 크게 쉬려 애쓰는
                        모습이 역력했지만, 그 시도는 잘 되지 않는 듯 가슴팍만
                        작게 들썩였다.
                        <br />
                      </p>
                    </div>

                    <div className="inline-flex justify-start items-start gap-5">
                      <div className="size-7 relative overflow-hidden">
                        <div className="size-6 left-[2.33px] top-[3.50px] absolute bg-font-2" />
                      </div>
                      <p className="w-full justify-start text-font-2">
                        &#123;&#123;user&#125;&#125;이 문을 열고 들어오는 찰나,
                        연우는 숨을 멈춘 채로 굳어버렸다. 그의 시선은 오직
                        신에게만 꽂혀 있었고, 그의 말처럼 숨을 크게 쉬려 애쓰는
                        모습이 역력했지만, 그 시도는 잘 되지 않는 듯 가슴팍만
                        작게 들썩였다.
                        <br />
                      </p>
                    </div>

                    {/* 상대방 캐릭터 메시지 블록 반복 */}
                    <div className="w-96 inline-flex justify-start items-start gap-2">
                      <div
                        data-property-1="P6"
                        className="size-10 relative bg-linear-225 from-orange-500 to-red-500 rounded-[100px] overflow-hidden"
                      >
                        <div className="w-8 h-9 left-[33.51px] top-[16.50px] absolute origin-top-left rotate-[142.81deg] bg-orange-300 rounded-full" />
                        <div className="size-[1.53px] left-[18.29px] top-[21.02px] absolute bg-font-2 rounded-full" />
                        <div className="size-[1.53px] left-[20.43px] top-[13.07px] absolute bg-font-2 rounded-full" />
                        <div className="w-[3.16px] h-0.5 left-[15.70px] top-[16.49px] absolute origin-top-left rotate-[135.34deg] bg-font-2" />
                      </div>
                      <div className="inline-flex flex-col justify-start items-start gap-1.5">
                        <span className="justify-start text-font-1">
                          캐릭터 이름이름
                        </span>
                        <div className="px-3 py-2 bg-bg-card rounded-tr-2xl rounded-bl-2xl rounded-br-2xl inline-flex justify-center items-center gap-2.5 overflow-hidden">
                          <p className="justify-start text-font-1">
                            말말말말말말말말말말말말말말말말말말말말말말말말
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 하단 인터랙션 및 CTA 결제 유도 블록 */}
                  <footer className="w-full right-0 bottom-0 absolute inline-flex flex-col justify-start items-center gap-1">
                    <div
                      className="w-full h-30 left-0 bottom-0 absolute 
                bg-gradient-to-b from-neutral-900/0 via-neutral-900/50 to-neutral-900 
                rounded-br-2xl backdrop-blur-[8px]"
                    />
                    <div className="self-stretch flex flex-col justify-start items-center gap-1.25 z-30">
                      <div className="self-stretch inline-flex justify-center items-center gap-1">
                        <p className="body-4 text-center justify-start text-font-0">
                          이 캐릭터와 무료로 3회 대화할 수 있어요
                        </p>
                        {/* <div className="flex justify-start items-center">
                        <span className="text-center justify-start text-font-0">
                          
                        </span>
                        <span className="text-center justify-start text-font-0">
                          
                        </span>
                      </div> */}
                      </div>
                      <button className="self-stretch h-16 relative bg-brand rounded-br-2xl backdrop-blur-[5.05px] cursor-pointer">
                        <span className="title-3 justify-start text-font-4">
                          이 캐릭터와 대화하기
                        </span>
                      </button>
                    </div>
                  </footer>
                </section>
              </div>
            ))}
          </div>
        </div>

        {/* 내비게이션 컨트롤 버튼 영역 */}
        <button
          onClick={scrollPrev}
          className="size-10 p-2 left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-white/40 rounded-[20px] backdrop-blur-[1.54px] flex justify-start items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          className="size-10 p-2 right-0 top-1/2 translate-x-1/2 -translate-y-1/2 absolute bg-white/40 rounded-[20px] backdrop-blur-[1.54px] flex justify-start items-center gap-2 cursor-pointer"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </article>
    </section>
  );
};

export default CharacterExperience;
