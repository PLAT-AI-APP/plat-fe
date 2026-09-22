"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

/** 각 페이지 metadata.title 의 제목 부분과 대응하는 메시지 키. 동적 세그먼트는 한 칸으로 본다. */
const ROUTE_TITLE_KEYS: ReadonlyArray<readonly [RegExp, string]> = [
  [/^\/$/, "pageTitles.home"],
  [/^\/auth\/callback$/, "pageTitles.authCallback"],
  [/^\/character-creat$/, "pageTitles.characterCreate"],
  [/^\/characters\/[^/]+$/, "pageTitles.characterDetail"],
  [/^\/chatting-room$/, "pageTitles.chattingRoom"],
  [/^\/my-chatting$/, "myChatting.title"],
  [/^\/my-reports$/, "pageTitles.myReports"],
  [/^\/notification$/, "notification.title"],
  [/^\/profile\/[^/]+$/, "pageTitles.profile"],
  [/^\/search$/, "pageTitles.search"],
  [/^\/settings$/, "settings.title"],
  [/^\/studio\/[^/]+$/, "pageTitles.studio"],
  [/^\/token-charge$/, "tokenCharge.title"],
  [/^\/usage-history$/, "pageTitles.usageHistory"],
  [/^\/withdrawal$/, "withdrawalPage.title"],
];

/** layout.tsx 의 title.template("%s | PLAT") 과 같은 형식 */
const TITLE_SUFFIX = " | PLAT";

/**
 * 선택한 언어에 맞춰 브라우저 탭 제목을 맞춘다.
 *
 * 탭 제목은 서버 metadata 로 정해지는데 이 앱의 언어는 클라이언트 스토어에 있어 서버가 번역할 수
 * 없다(PageTitle 과 같은 사정). 그래서 언어나 경로가 바뀔 때마다 여기서 다시 쓴다.
 * metadata 는 첫 렌더와 검색 엔진용 기본값으로 남는다.
 */
const DocumentTitle = () => {
  const t = useTranslations();
  const pathname = usePathname();

  useEffect(() => {
    const titleKey = ROUTE_TITLE_KEYS.find(([pattern]) => pattern.test(pathname))?.[1];

    // 전용 제목이 없는 화면(회원가입·공지 상세 등)은 layout 의 기본 제목과 같은 문구를 쓴다.
    const title = titleKey
      ? `${t(titleKey)}${TITLE_SUFFIX}`
      : t("pageTitles.siteDefault");

    const applyTitle = () => {
      // 같은 값을 다시 쓰면 그것도 변경으로 잡혀 감시가 스스로를 깨우므로 다를 때만 쓴다.
      if (document.title !== title) document.title = title;
    };

    applyTitle();

    // 첫 로드에서는 Next 가 서버 metadata 의 <title> 을 하이드레이션 뒤에 늦게 반영해 방금 쓴 값을
    // 덮어쓰는 경우가 있다. <head> 만 좁게 지켜보다가 덮어쓰이면 다시 맞춘다.
    const observer = new MutationObserver(applyTitle);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [pathname, t]);

  return null;
};

export default DocumentTitle;
