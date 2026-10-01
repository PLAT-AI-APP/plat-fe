# --- 1단계: 빌드 환경 ---
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# 오류 수집(Sentry). 값은 배포 때만 넣는다. DSN 이 비어 있으면 수집이 꺼진다.
# NEXT_PUBLIC_* 는 빌드 시점에 번들에 박히므로 런타임 env 가 아니라 build-arg 로 받는다.
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    NEXT_PUBLIC_SENTRY_ENVIRONMENT=$NEXT_PUBLIC_SENTRY_ENVIRONMENT \
    SENTRY_ORG=$SENTRY_ORG \
    SENTRY_PROJECT=$SENTRY_PROJECT
# 인증 토큰은 ARG/ENV 로 받으면 이미지 레이어에 남으므로 빌드 시크릿으로만 읽는다.
# 시크릿이 없으면(로컬·PR 빌드) 소스맵 업로드만 건너뛴다.
RUN --mount=type=secret,id=sentry_auth_token \
    sh -c 'if [ -f /run/secrets/sentry_auth_token ]; then export SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token)"; fi; npm run build'

# --- 2단계: 실행 환경 (최종 이미지) ---
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# standalone 모드에 필요한 핵심 파일들만 빌드 단계에서 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]