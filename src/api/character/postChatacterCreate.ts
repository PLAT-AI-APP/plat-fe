import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { FileUploadId } from "@/api/file/postFileUpload";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface postChatacterCreateProps {
  representativeImageId?: FileUploadId | null;
  profileImageId?: FileUploadId | null;
  name: string;
  introduce: string;
  detailSetting: string;
  assets?: {
    name: string;
    situation: string;
    imageId: FileUploadId | null;
    visibility: "PUBLIC" | "PRIVATE";
  }[];
  visibility: string;
  description: string;
  tendency: string;
  category: string[];
  tagIds: number[];
}

const postChatacterCreate = async (props: postChatacterCreateProps) => {
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
