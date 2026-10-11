import {
  clearSocialLoginReturnPath,
  readSocialLoginReturnPath,
} from "@/hooks/auth/useSocialLogin";
import { toSafeReturnPath } from "@/lib/safePath";
import { SOCIAL_LOGIN_PROVIDER_KEY } from "@/constants/auth";
import type { SocialProvider } from "./AuthProcessing";

const PROVIDERS: SocialProvider[] = ["kakao", "google"];

/**
 * 로그인을 시작한 화면. 저장소 값은 누구나 바꿀 수 있어 같은 사이트 경로인지 검사한 뒤 쓰고, 한 번 쓰면 지운다.
 * 콜백 화면 자신으로는 돌아가지 않는다(코드가 이미 쓰여 다시 열면 실패한다).
 */
export const takeReturnPath = () => {
  const path = toSafeReturnPath(readSocialLoginReturnPath());
  clearSocialLoginReturnPath();
  return path.startsWith("/auth/callback") ? "/" : path;
};

/**
 * 로그인 버튼을 누를 때 남긴 수단. 모르거나 형식이 다르면 null — 수단 없이 안내한다.
 * 지우지 않는다: 지우면 이동 직전 다시 그릴 때 문구가 바뀌어 깜빡이고, 다음 로그인 때 덮어쓴다.
 */
export const readProvider = (): SocialProvider | null => {
  try {
    const saved = sessionStorage.getItem(SOCIAL_LOGIN_PROVIDER_KEY);
    return PROVIDERS.find((provider) => provider === saved) ?? null;
  } catch {
    return null;
  }
};

// 이 화면에 머무는 동안 값이 바뀌지 않으므로 구독할 것이 없다.
export const subscribeNothing = () => () => {};
