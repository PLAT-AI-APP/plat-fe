import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { clearSession } from "@/lib/session";
import {
  LOGOUT_REDIRECT_IN_PROGRESS_KEY,
  PENDING_SIGNUP_COMPLETE_DIALOG_KEY,
  PENDING_WELCOME_CREDIT_DIALOG_KEY,
  SKIP_AUTH_ALERT_ONCE_KEY,
  isProtectedPath,
} from "@/constants/auth";

const PostLogout = async () => {
  await authAxios.post("/auth/logout");
};

/** 보호 화면에서 로그아웃했다면 홈으로 이동. 이동했으면 true 반환 */
const redirectHomeIfProtected = () => {
  if (typeof window === "undefined") return false;

  if (!isProtectedPath(window.location.pathname)) return false;

  sessionStorage.removeItem(PENDING_SIGNUP_COMPLETE_DIALOG_KEY);
  sessionStorage.removeItem(PENDING_WELCOME_CREDIT_DIALOG_KEY);
  sessionStorage.setItem(SKIP_AUTH_ALERT_ONCE_KEY, "true");
  sessionStorage.setItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY, "true");
  window.location.replace("/");
  return true;
};

/** 로그아웃 */
export const useLogoutMutation = () => {
  const router = useRouter();
  return useMutation<void, AppError>({
    mutationFn: PostLogout,
    // 서버 로그아웃이 실패해도(네트워크·이미 만료) 이 기기에서는 로그아웃돼야 한다. 성공 때만 정리하면
    // 버튼을 눌렀는데 로그인된 채로 남았다. 서버 쪽 리프레시 토큰은 만료되거나 다음 로그인 때 바뀐다.
    meta: { silent: true },
    onSettled: () => {
      // 인증·내 정보·잔액·로그인에 딸린 캐시를 한 번에 비운다.
      clearSession({ reason: "logout" });

      // 보호 화면은 홈으로 이동하고, 그 외 화면은 전체 새로고침 대신
      // 서버 데이터만 다시 가져와 UI 애니메이션이 처음부터 다시 재생되지 않게 합니다.
      const movedHome = redirectHomeIfProtected();
      if (!movedHome) {
        router.refresh();
      }
    },
  });
};
