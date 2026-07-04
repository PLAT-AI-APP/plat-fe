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
