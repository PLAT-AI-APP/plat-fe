// 인증이 필요한 화면 목록
export const PROTECTED_ROUTES = [
  "/my-chatting",
  "/chatting-room",
  "/character-creat",
  "/studio",
  "/usage-history",
  "/token-charge",
  "/withdrawal",
  "/profile",
];

// 인증 필요 다이얼로그를 한 번 건너뛰는 세션 키
export const SKIP_AUTH_ALERT_ONCE_KEY = "skip-auth-alert-once";

// 로그아웃 직후 강제 이동 중임을 알리는 세션 키
export const LOGOUT_REDIRECT_IN_PROGRESS_KEY =
  "logout-redirect-in-progress";

// 홈 진입 후 회원가입 완료 다이얼로그를 여는 세션 키
export const PENDING_SIGNUP_COMPLETE_DIALOG_KEY =
  "pending-signup-complete-dialog";

// 홈 진입 후 웰컴 크레딧 다이얼로그를 여는 세션 키
export const PENDING_WELCOME_CREDIT_DIALOG_KEY =
  "pending-welcome-credit-dialog";

/** 보호 경로 판별 */
export const isProtectedPath = (path: string) =>
  PROTECTED_ROUTES.some((route) => path.startsWith(route));
