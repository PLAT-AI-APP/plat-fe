// import { useMutation } from "@tanstack/react-query";
// import { authAxios } from "..";
// import { FileUploadId } from "@/api/file/postFileUpload";
// import { AppError } from "@/type/api";
//
// interface postChatacterCreateProps {
//   representativeImageId?: FileUploadId | null;
//   profileImageId?: FileUploadId | null;
//   name: string;
//   introduce: string;
//   detailSetting: string;
//   assets?: {
//     name: string;
//     situation: string;
//     assetImageFileId: FileUploadId | null;
//     visibility: "PUBLIC" | "PRIVATE";
//   }[];
//   visibility: string;
//   allowComments: boolean;
//   description: string;
//   tendency: string;
//   category: string[];
//   tagIds: string[];
// }
//
// const postChatacterCreate = async (props: postChatacterCreateProps) => {
//   await authAxios.post(`/character`, props);
// };
//
// /** Character create API is currently disabled. */
// export const useChatacterCreateMutation = () => {
//   return useMutation<void, AppError, { props: postChatacterCreateProps }>({
//     mutationKey: ["post-character-create"],
//     mutationFn: ({ props }) => postChatacterCreate(props),
//   });
// };
