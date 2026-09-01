import type { Metadata } from "next";
import { Suspense } from "react";
import "@/app/globals.css";
import IntlProvider from "@/providers/IntlProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import ToastManager from "@/components/toast/ToastManager";
import ClientLayout from "./ClientLayout";
import "pretendard/dist/web/static/pretendard.css";
import { NavigationGuardProvider } from "next-navigation-guard";
import MSWProvider from "@/providers/MSWProvider";

export const metadata: Metadata = {
  // 1. 기본 메타데이터 및 타이틀 템플릿
  title: {
    default: "PLAT | 나만의 AI 페르소나 플랫폼",
    template: "%s | PLAT", // 하위 페이지에서 "회원가입" 입력 시 "회원가입 | PLAT"으로 표시
  },
  description:
    "PLAT에서 당신만의 AI 페르소나를 생성하고, 깊이 있는 대화를 통해 새로운 영감을 얻으세요. 당신의 상상이 현실이 되는 AI 공간입니다.",
  keywords: [
    "AI 페르소나",
    "인공지능 대화",
    "AI 캐릭터",
    "플랫",
    "PLAT",
    "대화형 AI",
    "커스텀 AI",
  ],

  // 2. 검색 엔진 로봇 제어
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // 3. 경로 기준점 및 파비콘
  // metadataBase: new URL("https://plat.so"), // 실제 도메인 주소
  alternates: {
    canonical: "/",
  },
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-32x32.png",
  //   apple: "/apple-touch-icon.png",
  // },

  // 4. Open Graph (전역 공통)
  openGraph: {
    type: "website",
    siteName: "PLAT",
    locale: "ko_KR",
    title: "PLAT | 나만의 AI 페르소나 플랫폼",
    description: "당신만의 AI 페르소나와 대화를 시작하세요.",
    // images: [
    //   {
    //     url: "/images/og-default.png", // 퍼블릭 폴더 내 기본 OG 이미지
    //     width: 1200,
    //     height: 630,
    //     alt: "PLAT - AI Persona Platform",
    //   },
    // ],
  },

  // 5. Twitter (전역 공통)
  twitter: {
    card: "summary_large_image",
    title: "PLAT | 나만의 AI 페르소나 플랫폼",
    description: "당신만의 AI 페르소나와 대화를 시작하세요.",
    // images: ["/images/og-default.png"],
    creator: "@PLAT_Official",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        {/* ThemeProvider가 가장 바깥이어야 한다. next-themes는 자기 트리 안에
            테마 복원 스크립트를 심는데, 목업이 켜지면 MSWProvider가 준비 전까지
            자식을 렌더하지 않아 그 스크립트까지 초기 마크업에서 빠진다. */}
        <ThemeProvider>
          <MSWProvider>
            <ReactQueryProvider>
              <IntlProvider>
                <NavigationGuardProvider>
                  <Suspense fallback={null}>
                    <ClientLayout>{children}</ClientLayout>
                    <ToastManager />
                  </Suspense>
                </NavigationGuardProvider>
              </IntlProvider>
            </ReactQueryProvider>
          </MSWProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
