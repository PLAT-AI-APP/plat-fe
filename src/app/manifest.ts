import type { MetadataRoute } from "next";

/**
 * 안드로이드 홈 화면 추가·설치용 정보. 아이콘은 라이트/다크를 고를 수 없어 다크 시안 한 벌만 쓴다.
 * display 는 browser — 홈 화면에서 열어도 주소창이 있는 보통 브라우저로 연다(결제 새 창 흐름을 그대로 두기 위해).
 */
const manifest = (): MetadataRoute.Manifest => ({
  name: "PLAT",
  short_name: "PLAT",
  description: "당신만의 AI 페르소나와 대화를 시작하세요.",
  start_url: "/",
  display: "browser",
  background_color: "#111112",
  theme_color: "#111112",
  icons: [
    { src: "/icons/android-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icons/android-512.png", sizes: "512x512", type: "image/png" },
  ],
});

export default manifest;
