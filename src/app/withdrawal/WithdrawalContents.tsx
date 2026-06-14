"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Checkbox from "@/icons/Checkbox";
import CheckboxEmpty from "@/icons/CheckboxEmpty";
import { useDeleteUserMutation } from "@/api/user/deleteUser";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import ActiveButton from "@/components/ActiveButton";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/store/useDialogStore";

const WITHDRAWAL_NOTICES = [
  "모든 데이터와 개인정보는 삭제되며 다시 찾을 수 없어요",
  "주문과 거래 내역은 일정기간 동안 안전하게 보관돼요",
  "사용하지 않은 크레딧은 환불되지 않고 함께 지워져요",
  "같은 이메일 주소로는 7일 동안 가입할 수 없어요",
];

const SKIP_AUTH_ALERT_ONCE_KEY = "skip-auth-alert-once";

const WithdrawalContents = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const logout = useAuthStore((state) => state.logout);
  const { isPending } = useDeleteUserMutation();
  const openDialog = useDialogStore((state) => state.openDialog);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const nickname = user?.nickname || "회원";
  const canSubmit = isConfirmed && !isPending;

  const handleDeleteConfirm = () => {
    // 탈퇴 api연동시 주석 해제
    // if (isPending) return;
    // deleteUser(undefined, {
    //   onSuccess: () => openCompleteDialog(),
    // });
    openCompleteDialog();
  };

  const openCompleteDialog = () => {
    openDialog("WITHDRAWAL_COMPLETE", {
      onConfirm: handleCompleteConfirm,
    });
  };

  const openConfirmDialog = () => {
    openDialog("WITHDRAWAL_CONFIRM", {
      isPending,
      onConfirm: handleDeleteConfirm,
    });
  };

  const handleCompleteConfirm = () => {
    sessionStorage.setItem(SKIP_AUTH_ALERT_ONCE_KEY, "true");
    logout();
    clearUser();
    window.location.replace("/");
  };

  return (
    <section className="flex min-h-full w-full items-center justify-center bg-bg-dark px-5 py-16">
      <div className="flex w-full max-w-148 flex-col gap-18">
        <h1 className="heading-2 text-font-1">회원탈퇴</h1>

        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full flex-col gap-4">
            <header className="flex w-full flex-col gap-2">
              <h2 className="heading-3R text-font-1">
                {nickname}님과의 이별이 너무 아쉬워요
              </h2>
              <p className="body-2 text-font-2">
                헤어지게 되어 정말 아쉬워요. PLAT에서 탈퇴 전, 아래의 내용을 꼭
                확인해 주세요
              </p>
            </header>

            <div className="flex w-full flex-col gap-1">
              <div className="rounded-2xl bg-bg-darkest px-4 py-6">
                <ul className="body-4 list-disc space-y-0 pl-5 text-font-disabled">
                  {WITHDRAWAL_NOTICES.map((notice) => (
                    <li key={notice}>{notice}</li>
                  ))}
                  <li>
                    직접 제작한 캐릭터와 세계관은 탈퇴 후 모두 지워져요
                    <br />
                    단, 기존 채팅방은 유지되며 신규 메세지는 전송할 수 없어요
                  </li>
                </ul>
              </div>

              <p className="text-[10px] leading-[1.5] text-font-disabled">
                결제·환불·크레딧 거래 기록은 「전자상거래법」·「국세기본법」
                등에 따른 보관 의무(5년)가 있어 즉시 삭제되지 않습니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="checkbox"
            aria-checked={isConfirmed}
            className="body-4 flex items-end gap-1.5 text-white/60"
            onClick={() => setIsConfirmed((prev) => !prev)}
          >
            {isConfirmed ? (
              <Checkbox className="size-5 shrink-0 text-font-1" />
            ) : (
              <CheckboxEmpty className="size-5 shrink-0 text-font-2" />
            )}
            <span>위에 적힌 내용을 전부 확인했어요</span>
          </button>
        </div>

        <div className="flex w-full gap-4">
          <button
            type="button"
            className="title-3 flex h-13 flex-1 items-center justify-center rounded-xl bg-card text-font-1 transition-colors hover:bg-card-hover"
            onClick={() => router.back()}
          >
            좀 더 생각할래요
          </button>

          <ActiveButton
            type="button"
            isActive={canSubmit}
            text={isPending ? "탈퇴 처리 중" : "탈퇴할게요"}
            onClick={openConfirmDialog}
            className={cn(
              "h-13 flex-1 rounded-xl",
              !canSubmit && "text-font-disabled",
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default WithdrawalContents;
