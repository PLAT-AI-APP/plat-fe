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
 * 백엔드가 업로드 때 미리 만들어 두는 이미지 크기 변형본 (plat-be ImageVariant).
 * sq = 정사각 크롭, 숫자는 한 변 px.
 *
 * 파일 타입마다 만드는 변형본이 다르다(FileTypePolicy). 없는 변형본을 요청하면 404 이므로
 * 타입에 맞는 것만 쓴다.
 * - USER_PROFILE: sq40, sq80
 * - CHARACTER_PROFILE: sq40, sq140
 * - UNIVERSE_PROFILE: sq80, sq140
 * - UNIVERSE_ASSET: sq80 (정사각 크롭이라 비율을 지켜야 하는 에셋 본문에는 못 쓴다)
 */
export type ImageVariant = "origin" | "sq40" | "sq80" | "sq140";

/** /images/{type}/{fileId}/{variant} 의 마지막 세그먼트 */
const IMAGE_VARIANT_PATH = /(\/images\/[^/]+\/[^/?#]+\/)([a-z0-9]+)(?=$|[?#])/;

/**
 * 업로드 API가 돌려준 fileId를 실제 이미지를 서빙하는
 * GET /images/{type}/{fileId}/{variant} URL로 변환합니다.
 * 이 엔드포인트는 확정(confirm) 전 TEMP 상태에서도 바로 동작합니다.
 * type/variant 세그먼트는 소문자만 받으므로 그대로 소문자로 바꿔 보냅니다.
 */
export const getResourceImageUrl = (
  fileId: string,
  fileType: FileUploadType,
  variant: ImageVariant = "origin",
) => {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URI ?? "").replace(/\/$/, "");

  return `${baseUrl}/images/${fileType.toLowerCase()}/${fileId}/${variant}`;
};

/**
 * 백엔드가 내려준 이미지 URL(대개 origin)을 같은 파일의 작은 변형본 URL로 바꿉니다.
 *
 * 36px 아바타에 원본(최대 수 MB 업로드를 크기 그대로 webp 로만 바꾼 파일)을 받을 이유가 없다.
 * `unoptimized` 라 next/image 가 줄여 주지도 않는 자리에서 쓴다.
 * /images/... 형태가 아닌 값(업로드 미리보기 blob:, 로컬 기본 이미지 등)은 그대로 둔다.
 */
export const toImageVariantUrl = <T extends string | null | undefined>(
  url: T,
  variant: ImageVariant,
): T => (url ? (url.replace(IMAGE_VARIANT_PATH, `$1${variant}`) as T) : url);

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
