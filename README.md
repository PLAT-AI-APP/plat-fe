# PLAT - FE

AI 캐릭터 채팅 플랫폼 PLAT 의 사용자 웹(Next.js App Router).

| 항목 | 값 |
| --- | --- |
| Framework | Next.js 16 (App Router, `output: "standalone"`), React 19 |
| 상태·데이터 | TanStack Query, Zustand(`persist`), axios |
| 다국어 | next-intl (`src/i18n`) |
| 목업 | MSW (`src/mocks`) |
| 오류 수집 | Sentry (`@sentry/nextjs`, DSN 이 있을 때만) |
| Node | 24 (Dockerfile 의 `node:24-alpine` 과 맞춘다) |

## 실행

```bash
npm ci --legacy-peer-deps   # Dockerfile 과 같은 옵션
npm run dev                  # http://localhost:3000
npm run build && npm start   # 운영 빌드 확인
npm run lint                 # eslint
npx tsc --noEmit             # 타입 검사
```

- 테스트 러너는 없다. 변경 확인은 `tsc`·`eslint`·`next build` 와 브라우저 확인으로 한다.
- 백엔드(plat-be)를 로컬로 띄웠다면 `.env.development.local` 에서 `NEXT_PUBLIC_BASE_URI=http://localhost:8080`,
  `NEXT_PUBLIC_CHAT_BASE_URI=http://localhost:8083` 으로 바꾼다. `.env*.local` 은 Git 이 추적하지 않는다.
- dev 서버가 떠 있는 폴더에서 `next build` 를 돌리면 같은 `.next` 를 덮어써 dev 서버가 깨진다. 빌드 확인은 별도 작업 폴더(worktree)에서 한다.

## 환경 변수

`.env.development`(`next dev`)·`.env.production`(`next build`)이 Git 으로 관리되는 기본값이고, 개인 값은 `.env.development.local` 에 둔다.

> **`NEXT_PUBLIC_*` 는 빌드할 때 번들에 박힌다.** 실행 중인 서버나 컨테이너의 환경 변수를 바꿔도 이미 만든 번들은 바뀌지 않는다.
> 값을 바꾸면 **다시 빌드해 배포**해야 한다. 특히 점검 모드(`NEXT_PUBLIC_MAINTENANCE_MODE`)는 켜고 끌 때마다 재빌드가 필요하다.

| 변수 | 기본값(.env.production) | 뜻 |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URI` | `https://api-dev.plat.so/` | 사용자 API(plat-app-api) 오리진. 운영은 `https://api.plat.so` |
| `NEXT_PUBLIC_CHAT_BASE_URI` | `https://ai-dev.plat.so` | AI 채팅(`/chat/**`, plat-app-ai) 오리진. 비우면 `NEXT_PUBLIC_BASE_URI` 를 쓴다. 운영은 `https://ai.plat.so` |
| `NEXT_PUBLIC_API_MOCKING` | `disabled` | MSW 목업. `enabled`·`true`·`1`·`on` 이면 켠다. 바꾼 뒤 dev 서버 재시작. 끄면 남은 목업 서비스 워커를 정리한다 |
| `NEXT_PUBLIC_APP_ENV` | (비어 있음) | 배포 환경. `dev`·`local` 일 때만 개발용 화면(`/dev/**`, 가짜 본인인증 창)이 열린다. 비우거나 다른 값이면 운영처럼 닫힌다. **dev 배포는 `dev` 를 꼭 넣는다** — 빠지면 dev 서버(가짜 인증)에서 본인인증을 끝낼 수 없다 |
| `NEXT_PUBLIC_ALLOW_INDEXING` | (빈 값) | `true` 일 때만 검색 엔진 수집을 연다. 클로즈베타 동안은 비워 둔다 |
| `NEXT_PUBLIC_SITE_URL` | (빈 값) | 공유 미리보기 기준 주소(`metadataBase`). 비우면 `https://plat.so` |
| `NEXT_PUBLIC_BETA_BANNER` | (빈 값) | 클로즈베타 안내 띠. `off` 일 때만 숨긴다(비우면 보인다). 정식 출시 때 `off` |
| `NEXT_PUBLIC_MAINTENANCE_MODE` | (빈 값) | `on` 이면 `src/proxy.ts` 가 모든 화면 요청을 `/maintenance` 로 돌린다(주소는 그대로, 503). **빌드 시 고정** |
| `NEXT_PUBLIC_SENTRY_DSN` | (없음) | Sentry DSN. 없으면 브라우저·서버 모두 오류 수집을 켜지 않는다 |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | (없음) | Sentry environment 이름. 없으면 `NODE_ENV` |

- 점검 모드는 두 가지다. 배포 env 로 켜는 **전체 점검**(위 변수, 재빌드 필요)과, 백엔드가 `SERVICE_MAINTENANCE`(503)로 알려 주는
  **서버 점검**(관리자 콘솔의 점검 예약, 재빌드 없음)이다. 후자는 화면이 오류 코드를 보고 점검 안내로 넘어가며 예정 시각은 `GET /system/maintenance` 로 읽는다.
- Sentry 는 `sendDefaultPii: false`, `tracesSampleRate: 0` 이다. 대화 내용·개인정보가 섞이지 않게 요청 본문을 싣지 않는다. 소스맵 업로드는 설정되어 있지 않다.

## 세션 구조

| 저장 위치 | 내용 |
| --- | --- |
| 메모리(Zustand `useAuthStore`) | access token. **탭마다 메모리에만** 있고 localStorage 에 남기지 않는다 |
| localStorage `auth-storage` | 로그인 여부(`isLoggedIn`)만 |
| localStorage `user-storage` | 헤더에 쓰는 내 프로필 요약 |
| HttpOnly 쿠키 `refreshToken` | 백엔드가 `path=/auth` 로 내려 준다. JS 로 읽지 않고 `withCredentials` 로만 보낸다 |

- **재발급**: 401 을 받으면 `/auth/refresh` 로 새 access token 을 받아 다시 보낸다(`src/api/auth/postRefresh.ts`).
  - 한 탭 안의 동시 요청은 재발급 하나를 함께 기다린다.
  - **탭 사이 재발급 lock**: Web Locks(`navigator.locks`, 이름 `plat-refresh`)로 같은 브라우저의 모든 탭이 재발급을 한 번에 하나씩 한다.
    먼저 끝난 탭이 쿠키를 바꿔 두면 다음 탭은 새 쿠키로 요청한다. Web Locks 가 없으면 탭 안에서만 합친다.
  - 옛 쿠키로 나가 401 을 받으면 300~500ms 뒤 한 번만 다시 해 본다. 백엔드도 회전 뒤 20초 동안 같은 토큰의 재요청에 같은 새 쌍을 돌려준다.
- **`clearSession`**(`src/lib/session.ts`): 로그아웃·세션 만료 때 로그인 흔적을 한 곳에서 지운다 — 인증 상태, `user-storage`, 지갑 잔액,
  React Query 캐시. `logout` 이면 캐시를 전부, `expired` 면 화면에 없는 캐시만 버린다(떠 있는 조회는 인터셉터가 비로그인으로 다시 받는 중).
  정리할 곳이 늘면 여기에만 더한다.
- **탭 간 로그인 동기화**(`src/components/auth/AuthSessionRuntime.tsx`): `storage` 이벤트로 다른 탭의 `auth-storage`·`user-storage` 변경을 따라간다.
  다른 탭이 로그아웃하면 이 탭도 `clearSession`, 로그인하면 이 탭이 리프레시로 자기 토큰을 새로 받는다.
- 소셜 로그인은 백엔드가 `/auth/callback?code=` 로 돌려보내고, 실패하면 `/auth/callback?error=<사유 문구>` 다. 화면은 `error` 를 그대로 보인다.

## 보안 헤더

`next.config.ts` 가 모든 화면 응답(`/:path*`)에 붙인다.

| 헤더 | 값 | 이유 |
| --- | --- | --- |
| `X-Frame-Options` | `DENY` | 다른 사이트가 화면을 iframe 에 넣어 클릭을 가로채지 못하게 |
| `X-Content-Type-Options` | `nosniff` | 응답 형식을 추측해 스크립트로 실행하지 않게 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 다른 사이트로 나갈 때 경로·쿼리(결제 `pg_token` 등)를 넘기지 않게 |

CSP 는 아직 없다.

이미지는 `next/image` 의 `remotePatterns` 로 허용한 호스트만 최적화한다 — `api.plat.so`·`api-dev.plat.so` 의 `/images/**`,
`*.s3.ap-northeast-2.amazonaws.com`, 로컬 백엔드 `http://localhost:8080/images/**`(dev 서버만), `picsum.photos`(남은 더미 화면용).

## 배포

레포에 있는 파일 기준의 사실만 적는다.

- `Dockerfile`: `node:24-alpine` 두 단계 빌드(`npm ci --legacy-peer-deps` → `npm run build` → standalone `server.js`, 포트 3000).
  빌드 단계에서 `.env.production` 이 번들에 들어간다. `ARG NEXT_PUBLIC_API_URL` 은 코드가 읽지 않는 이름이라 효과가 없다.
- `docker-compose.dev.yml`·`docker-compose.prod.yml`: ECR 이미지(`${ECR_IMAGE}`)를 3000 포트로 띄운다. `docker-compose.yml` 은 로컬에서
  이미지를 직접 빌드해 운영 API 주소로 띄우는 예시인데, 여기 적은 `NEXT_PUBLIC_*` 는 실행 시 환경 변수라 이미 만든 번들에는 반영되지 않는다(위 주의).
- GitHub Actions 배포 워크플로는 `.github/workflows/frontend-deploy.yml.bak` 으로 이름을 바꿔 **꺼 두었다**. 지금 레포 안에서 자동 배포는 돌지 않는다.
- 백엔드 문서(plat-be `docs/22-AWS-Environment-Setup.md`)는 FE 운영 환경 변수를 Vercel 에 넣는다고 적는다. Vercel 설정 파일은 이 레포에 없다.

## 폴더

| 경로 | 내용 |
| --- | --- |
| `src/app` | App Router 화면 |
| `src/api` | axios 인스턴스·인터셉터(`index.ts`)와 API 함수 |
| `src/components` · `src/hooks` · `src/store` | UI · 훅 · Zustand 스토어 |
| `src/lib` | 세션(`session.ts`), 모니터링(`monitoring.ts`), 안전한 이동 경로(`safePath.ts`) 등 공용 로직 |
| `src/i18n` | next-intl 메시지·요청 설정 |
| `src/mocks` | MSW 핸들러 |
| `src/proxy.ts` | 점검 모드 라우팅 |
| `src/instrumentation*.ts` | Sentry 초기화(서버·브라우저) |
