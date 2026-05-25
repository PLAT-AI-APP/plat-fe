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
  tagList: { name: string }[];
}

const postChatacterCreate = async (props: postChatacterCreateProps) => {
  // 서버로 보내기 직전에 tagList만 string[] 형태로 가공(Mapping)합니다.
  const payload = {
    ...props,
    tagList: props.tagList.map((tag) => tag.name), // [{ name: "로맨틱" }] -> ["로맨틱"]
  };

  console.log("🔥 폼 원본 데이터:", props);
  console.log("🚀 서버로 전송되는 가공된 페이로드:", payload);

  const response = await authAxios.post<ApiSuccessResponse<null>>(
    `/character`,
    payload,
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
