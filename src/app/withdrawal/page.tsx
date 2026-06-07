import { Metadata } from "next";
import WithdrawalContents from "./WithdrawalContents";

export const metadata: Metadata = {
  title: "회원탈퇴",
};

const WithdrawalPage = () => {
  return <WithdrawalContents />;
};

export default WithdrawalPage;
