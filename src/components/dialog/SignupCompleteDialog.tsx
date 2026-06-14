import type { SignupCompleteDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

const SignupCompleteDialog = ({
  nickname,
  onClose,
  onLogin,
}: SignupCompleteDialogProps) => {
  const handleLogin = () => {
    onClose();
    onLogin();
  };

  return (
    <Dialog
      onClose={onClose}
      label={
        <div className="flex w-full flex-col items-start justify-end gap-3 break-words">
          <div className="flex w-full flex-col items-start gap-1">
            <p className="body-5 w-full text-font-2">
              안녕하세요 {nickname}님,
            </p>
            <h2 className="title-2 w-full text-font-1">
              회원가입을 축하드려요!
            </h2>
          </div>

          <div className="body-4 w-full text-font-2">
            <p>소중한 정보 보호와 안전한 서비스 이용을 위해,</p>
            <p>방금 만드신 계정으로 재로그인 해주세요.</p>
          </div>
        </div>
      }
      confirmText="로그인하기"
      confirmFn={handleLogin}
    />
  );
};

export default SignupCompleteDialog;
