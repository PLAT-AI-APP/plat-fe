interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 크롭 결과의 긴 변 상한. 화면에 쓰이는 크기는 120~227px 이라 2~3배 화면에서도 충분하다. */
const MAX_OUTPUT_EDGE = 1024;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image."));
    image.src = src;
  });

/** 크롭 결과를 어떤 형식으로 뽑을지. PNG 는 투명을 지키고, 나머지는 JPEG 로 줄인다. */
export const getCropOutputType = (inputType: string) =>
  inputType === "image/png" ? "image/png" : "image/jpeg";

/**
 * 고른 영역을 잘라 Blob 으로 돌려준다.
 *
 * 예전에는 원본 픽셀 크기 그대로 캔버스에 그린 뒤 동기 함수 toDataURL 로 뽑았다. 고해상도
 * 사진이면 그 사이 화면이 멈췄고, 결과(base64)를 다시 fetch 로 Blob 으로 바꿔 올렸다.
 * 긴 변을 1024px 로 줄이고 비동기 toBlob 으로 바로 뽑는다.
 */
export const createCroppedImageBlob = async ({
  imageSrc,
  cropArea,
  outputType,
}: {
  imageSrc: string;
  cropArea: CropArea;
  outputType: string;
}) => {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create canvas context.");
  }

  const scale = Math.min(
    1,
    MAX_OUTPUT_EDGE / Math.max(cropArea.width, cropArea.height),
  );
  canvas.width = Math.max(1, Math.round(cropArea.width * scale));
  canvas.height = Math.max(1, Math.round(cropArea.height * scale));
  context.imageSmoothingQuality = "high";

  // 원본 이미지의 실제 픽셀 좌표로 잘라낸 뒤 (필요하면 줄여서) 새 canvas에 옮겨 담습니다.
  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Failed to encode image.")),
      outputType,
      0.92,
    );
  });
};
