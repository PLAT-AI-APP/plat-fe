import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface postChatacterCreateProps {
  profileImage?: string;
  name: string;
  introduce: string;
  detailSetting: string;
  assets?: {
    name: string;
    situation: string;
    image: string;
  }[];
  visibility: string;
  description: string;
  tendency: string;
  tagList: string[];
}
const postChatacterCreate = async (props: postChatacterCreateProps) => {
  console.log(props);
  const response = await authAxios.post<ApiSuccessResponse<null>>(
    `/character`,
    props,
  );
  return response.data;
};

/** 캐릭터 생성 api */
export const useChatacterCreateMutation = () => {
  return useMutation<
    ApiSuccessResponse<null>,
    AppError,
    { props: postChatacterCreateProps }
  >({
    mutationKey: ["post-character-create"],
    mutationFn: ({ props }) => postChatacterCreate(props),
  });
};
