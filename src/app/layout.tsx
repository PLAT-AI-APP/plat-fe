import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "@/app/globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import ClientLayout from "./ClientLayout";
import "pretendard/dist/web/static/pretendard.css";
import { NavigationGuardProvider } from "next-navigation-guard";
// import MSWProvider from "@/providers/MSWProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 1. 기본 메타데이터 및 타이틀 템플릿
  title: {
    default: "Plat | 나만의 AI 페르소나 플랫폼",
    template: "%s | Plat", // 하위 페이지에서 "회원가입" 입력 시 "회원가입 | Plat"으로 표시
  },
  description:
    "Plat에서 당신만의 AI 페르소나를 생성하고, 깊이 있는 대화를 통해 새로운 영감을 얻으세요. 당신의 상상이 현실이 되는 AI 공간입니다.",
  keywords: [
    "AI 페르소나",
    "인공지능 대화",
    "AI 캐릭터",
    "플랫",
    "Plat",
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
    siteName: "Plat",
    locale: "ko_KR",
    title: "Plat | 나만의 AI 페르소나 플랫폼",
    description: "당신만의 AI 페르소나와 대화를 시작하세요.",
    // images: [
    //   {
    //     url: "/images/og-default.png", // 퍼블릭 폴더 내 기본 OG 이미지
    //     width: 1200,
    //     height: 630,
    //     alt: "Plat - AI Persona Platform",
    //   },
    // ],
  },

  // 5. Twitter (전역 공통)
  twitter: {
    card: "summary_large_image",
    title: "Plat | 나만의 AI 페르소나 플랫폼",
    description: "당신만의 AI 페르소나와 대화를 시작하세요.",
    // images: ["/images/og-default.png"],
    creator: "@Plat_Official",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <MSWProvider> */}
        <ReactQueryProvider>
          <ThemeProvider>
            <NavigationGuardProvider>
              <Suspense fallback={null}>
                <ClientLayout>{children}</ClientLayout>
              </Suspense>
            </NavigationGuardProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        {/* </MSWProvider> */}
      </body>
    </html>
  );
}
