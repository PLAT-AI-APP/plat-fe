export const getImageUrl = (url?: string | null) => {
  // 백엔드가 상대 경로로 내려준 파일 URL은 API origin을 붙여 브라우저가 접근 가능한 주소로 바꿉니다.
  if (!url) return "";
  if (
    url.startsWith("http") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URI ?? "";

  return `${baseUrl}${url}`;
};
