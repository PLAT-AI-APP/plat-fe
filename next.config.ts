import { withSentryConfig } from "@sentry/nextjs/config";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * 모든 화면 응답에 붙이는 보안 헤더.
 * - X-Frame-Options: 다른 사이트가 우리 화면을 iframe 에 넣어 클릭을 가로채지 못하게 한다.
 * - X-Content-Type-Options: 브라우저가 응답 형식을 추측해 스크립트로 실행하지 않게 한다.
 * - Referrer-Policy: 다른 사이트로 나갈 때 주소의 경로·쿼리(pg_token 등)를 넘기지 않는다.
 */
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  experimental: {
    /*
     * 배럴 파일을 통과하는 임포트를 실제 사용한 모듈로만 좁힌다.
     *
     * src/icons/index.tsx 는 아이콘 107개를 다시 내보내고 약 100개 파일이
     * 여기서 가져다 쓴다. 배럴을 그대로 두면 아이콘 하나를 쓰려고 107개를
     * 평가하게 되고, 개발 중 컴파일도 그만큼 느려진다.
     */
    optimizePackageImports: ["@/icons", "framer-motion", "embla-carousel-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        // plat-dev-files, plat-prod-files 등 리전 내 모든 버킷을 커버
        hostname: "*.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        // GET /images/{type}/{fileId}/{variant} — 백엔드가 직접 서빙(로컬 스토리지)하거나
        // S3/CDN으로 리다이렉트한다. next/image는 이 진입 호스트만 허용하면 되고,
        // 리다이렉트 대상은 fetch가 알아서 따라간다.
        hostname: "api-dev.plat.so",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "api.plat.so",
        port: "",
        pathname: "/images/**",
      },
      // 로컬 백엔드(docker compose local)가 서빙하는 이미지
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/images/**",
      },
    ],
    // 로컬 백엔드 이미지는 사설 주소라 기본 설정에서는 최적화 서버가 받지 않는다. 개발 서버에서만 허용한다.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

/*
 * 소스맵 업로드는 배포 빌드에서 SENTRY_AUTH_TOKEN 이 있을 때만 한다.
 * 토큰이 없으면(로컬·PR 빌드) 업로드를 건너뛰어 빌드가 실패하거나 경고로 시끄러워지지 않는다.
 * 올린 소스맵은 브라우저에 공개되지 않도록 업로드 뒤 지운다.
 */
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: sentryAuthToken,
  silent: !process.env.CI,
  telemetry: false,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: !sentryAuthToken,
    deleteSourcemapsAfterUpload: true,
  },
});
