import Check from "@/icons/Check";
import React from "react";

const Suggestion = () => {
  return (
    <section className="self-stretch flex flex-col items-start gap-4">
      <header className="inline-flex items-center gap-3">
        <div className="size-8 bg-brand-opacity rounded-lg flex justify-center items-center gap-2.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.58541 4.5413C8.08374 3.08297 10.0987 3.0388 10.6896 4.4088L10.7396 4.54214L11.4121 6.5088C11.5662 6.95983 11.8152 7.37256 12.1424 7.71915C12.4696 8.06575 12.8673 8.33815 13.3087 8.51797L13.4896 8.58547L15.4562 9.25714C16.9146 9.75547 16.9587 11.7705 15.5896 12.3613L15.4562 12.4113L13.4896 13.0838C13.0384 13.2378 12.6255 13.4868 12.2788 13.814C11.932 14.1412 11.6595 14.539 11.4796 14.9805L11.4121 15.1605L10.7404 17.128C10.2421 18.5863 8.22708 18.6305 7.63708 17.2613L7.58541 17.128L6.91374 15.1613C6.75973 14.7101 6.51072 14.2972 6.18353 13.9505C5.85633 13.6037 5.45857 13.3312 5.01708 13.1513L4.83708 13.0838L2.87041 12.4121C1.41124 11.9138 1.36708 9.8988 2.73708 9.3088L2.87041 9.25714L4.83708 8.58547C5.2881 8.43135 5.70083 8.1823 6.04743 7.85511C6.39402 7.52792 6.66642 7.13021 6.84624 6.6888L6.91374 6.5088L7.58541 4.5413ZM9.16291 5.07964L8.49124 7.0463C8.25657 7.73406 7.8748 8.36239 7.37252 8.88755C6.87024 9.41271 6.25953 9.82207 5.58291 10.0871L5.37458 10.163L3.40791 10.8346L5.37458 11.5063C6.06233 11.741 6.69066 12.1227 7.21582 12.625C7.74098 13.1273 8.15035 13.738 8.41541 14.4146L8.49124 14.623L9.16291 16.5896L9.83458 14.623C10.0693 13.9352 10.451 13.3069 10.9533 12.7817C11.4556 12.2566 12.0663 11.8472 12.7429 11.5821L12.9512 11.5071L14.9179 10.8346L12.9512 10.163C12.2635 9.92829 11.6352 9.54653 11.11 9.04425C10.5848 8.54197 10.1755 7.93126 9.91041 7.25464L9.83541 7.0463L9.16291 5.07964ZM15.8296 1.66797C15.9855 1.66797 16.1383 1.7117 16.2705 1.7942C16.4028 1.87669 16.5093 1.99464 16.5779 2.13464L16.6179 2.23214L16.9096 3.08714L17.7654 3.3788C17.9216 3.43188 18.0586 3.53015 18.1589 3.66115C18.2593 3.79215 18.3184 3.94998 18.329 4.11465C18.3395 4.27932 18.3009 4.44341 18.2181 4.58613C18.1353 4.72884 18.0119 4.84375 17.8637 4.9163L17.7654 4.9563L16.9104 5.24797L16.6187 6.1038C16.5656 6.25999 16.4672 6.39688 16.3362 6.49713C16.2051 6.59737 16.0473 6.65646 15.8826 6.6669C15.7179 6.67735 15.5539 6.63867 15.4112 6.55578C15.2686 6.4729 15.1537 6.34952 15.0812 6.2013L15.0412 6.1038L14.7496 5.2488L13.8937 4.95714C13.7375 4.90406 13.6005 4.80579 13.5002 4.67479C13.3999 4.54379 13.3407 4.38595 13.3302 4.22129C13.3196 4.05662 13.3582 3.89253 13.4411 3.74981C13.5239 3.6071 13.6472 3.49219 13.7954 3.41964L13.8937 3.37964L14.7487 3.08797L15.0404 2.23214C15.0966 2.06749 15.2029 1.92456 15.3444 1.82338C15.486 1.72221 15.6556 1.66786 15.8296 1.66797Z"
              fill="#FF7A00"
            />
          </svg>
        </div>
        <h2>취향 추천 태그</h2>
      </header>

      <div
        id="recommendation-cards"
        className="self-stretch flex flex-col items-start gap-2"
      >
        {/* 카드 1 */}
        <article className="self-stretch p-3 bg-bg-darker rounded-xl border border-border-main inline-flex justify-between items-center">
          <div className="inline-flex flex-col items-start gap-1">
            <h3>장난꾸러기 소꿉친구</h3>
            <div className="rounded-md self-stretch inline-flex items-center gap-1 text-[10px]">
              {["일상", "소꿉친구"].map((tag) => (
                <span
                  key={tag}
                  className="bg-card px-1.5 py-0.5 rounded-md backdrop-blur-[2px] flex justify-center items-center"
                >
                  <span className="flex items-center gap-0.5">
                    <span>#</span>
                    <span>{tag}</span>
                  </span>
                </span>
              ))}
              <span className="px-1.5 py-0.5 bg-brand-opacity rounded-md flex justify-center items-center">
                <span className="text-brand">+3</span>
              </span>
            </div>
          </div>
          <div data-icon="check" className="size-4 relative overflow-hidden">
            <Check className="w-4 h-4 text-border-main" />
          </div>
        </article>

        {/* 카드 2 */}
        <article className="self-stretch p-3 bg-bg-darker rounded-xl border border-border-main inline-flex justify-between items-center">
          <div className="inline-flex flex-col items-start gap-1">
            <h3>장난꾸러기 소꿉친구</h3>
            <div className="rounded-md self-stretch inline-flex items-center gap-1 text-[10px]">
              {["일상", "소꿉친구"].map((tag) => (
                <span
                  key={tag}
                  className="bg-card px-1.5 py-0.5 rounded-md backdrop-blur-[2px] flex justify-center items-center"
                >
                  <span className="flex items-center gap-0.5">
                    <span>#</span>
                    <span>{tag}</span>
                  </span>
                </span>
              ))}
              <span className="px-1.5 py-0.5 bg-brand-opacity rounded-md flex justify-center items-center">
                <span className="text-brand">+3</span>
              </span>
            </div>
          </div>
          <div data-icon="check" className="size-4 relative overflow-hidden">
            <Check className="w-4 h-4 text-border-main" />
          </div>
        </article>
      </div>
    </section>
  );
};

export default Suggestion;
