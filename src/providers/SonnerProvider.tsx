"use client";

import { Toaster } from "sonner";
import { Close, Info, StatusSuccessLine } from "@/icons";
import StatusError from "@/icons/StatusError";
import StatusWarning from "@/icons/StatusWarning";
import { APP_TOAST_DURATION } from "@/lib/toast";

/**
 * 화면 상단 중앙 알림.
 *
 * plat-admin-fe 의 toast 를 그대로 옮겨 왔다. 직접 만든 구현 대신 sonner 를
 * 쓰면 자동 닫힘 타이머의 호버 일시정지, 스와이프로 닫기, 여러 개가 쌓였을 때
 * 호버로 펼치기, prefers-reduced-motion 대응이 함께 따라온다.
 *
 * 아이콘만 plat-fe 것으로 바꿨다. 관리자 쪽은 라인(스트로크) 아이콘 계열이라
 * 그대로 가져오면 이 앱의 솔리드 아이콘들과 따로 놀기 때문이다.
 */
const SonnerProvider = () => {
  return (
    <Toaster
      position="top-center"
      closeButton
      duration={APP_TOAST_DURATION}
      offset={24}
      mobileOffset={16}
      visibleToasts={3}
      icons={{
        success: <StatusSuccessLine className="text-success" size={20} />,
        error: <StatusError className="text-danger" size={20} />,
        warning: <StatusWarning className="text-warning" size={20} />,
        info: <Info className="text-info" size={20} />,
        close: <Close className="text-font-disabled" size={18} />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "sonner-toast",
          title: "title-5 text-font-1",
          description: "body-5 mt-0.5 text-font-2",
          closeButton:
            "absolute right-3 top-3 cursor-pointer rounded-md transition hover:opacity-70",
        },
      }}
    />
  );
};

export default SonnerProvider;
