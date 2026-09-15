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

/**
 * 유저 프로필 이미지처럼 백엔드가 `/image/{id}?type=...` 상대 경로로 내려주는 값을
 * next/image가 그대로 못 쓰는 절대 URL로 바꿉니다. 상대 경로를 그대로 두면 API
 * 서버가 아니라 프론트 자신의 origin에서 찾아 404가 나므로, 이미 절대 URL인
 * 값(S3 등)은 그대로 두고 `/`로 시작하는 값만 API base URL을 붙여줍니다.
 */
export const resolveApiImageUrl = (
  url: string | null | undefined,
): string | undefined => {
  if (!url) return undefined;
  if (!url.startsWith("/")) return url;

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URI ?? "").replace(/\/$/, "");

  return `${baseUrl}${url}`;
};
