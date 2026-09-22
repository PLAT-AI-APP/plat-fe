import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";
import type { FaqItem } from "@/type/qna";
import { qnaQueryKeys } from "./queryKeys";

const getFaqList = async () => {
  const response = await axiosInstance.get<FaqItem[]>("/faqs");

  return response.data;
};

/**
 * 자주 하는 질문 전체. 수십 건 수준이라 한 번에 받고 카테고리 필터는 화면에서 한다.
 * 로그인 없이도 볼 수 있다.
 */
export const useFaqListQuery = () =>
  useQuery<FaqItem[], AppError>({
    queryKey: qnaQueryKeys.faqList(),
    queryFn: getFaqList,
  });
