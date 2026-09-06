import { FileUploadType } from "@/api/file/postFileUpload";

export const dataUrlToFile = async (
  dataUrl: string,
  fileName: string,
  type: string,
) => {
  // 크롭 모달 결과는 data URL이므로 업로드 API에 넘길 수 있도록 File 객체로 변환합니다.
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  return new File([blob], fileName, {
    type: type || blob.type,
  });
};

/**
 * 업로드 API가 돌려준 fileId를 실제 이미지를 서빙하는 GET /images/{fileId} URL로 변환합니다.
 * 이 엔드포인트는 확정(confirm) 전 TEMP 상태에서도 바로 동작합니다.
 */
export const getResourceImageUrl = (
  fileId: string,
  fileType: FileUploadType,
) => {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URI ?? "").replace(/\/$/, "");

  return `${baseUrl}/images/${fileId}?type=${fileType}`;
};
