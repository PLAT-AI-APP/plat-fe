# --- 1단계: 빌드 환경 ---
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

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