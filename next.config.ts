import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
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
    ],
  },
};

export default withNextIntl(nextConfig);
