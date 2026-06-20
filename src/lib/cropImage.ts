interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image."));
    image.src = src;
  });

export const createCroppedImageDataUrl = async ({
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

  canvas.width = Math.max(1, Math.round(cropArea.width));
  canvas.height = Math.max(1, Math.round(cropArea.height));

  // 원본 이미지의 실제 픽셀 좌표로 잘라낸 뒤 새 canvas에 그대로 옮겨 담습니다.
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

  return canvas.toDataURL(outputType, 0.92);
};
