# Node.js v24 버전 사용
FROM node:24-alpine

# 작업 디렉토리 생성
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package.json package-lock.json ./
RUN npm ci

# 전체 소스 코드 복사
COPY . .

# Next.js 기본 포트 노출
EXPOSE 3000

# 개발 서버 실행
CMD ["npm", "run", "dev"]