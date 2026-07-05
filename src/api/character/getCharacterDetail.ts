import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { CharacterDetail } from "@/type/character";

export const getCharacterDetail = async (characterId: string) => {
  const response = await authAxios.get<ApiSuccessResponse<CharacterDetail>>(
    `/character/${characterId}`,
  );

  return response.data.data;
};

/** 캐릭터 상세 페이지 콘텐츠 영역에 필요한 프로필, 설정, 시나리오, 댓글 데이터를 조회합니다. */
export const useCharacterDetailQuery = (characterId: string) => {
  return useQuery<CharacterDetail, AppError>({
    queryKey: ["get-character-detail", characterId],
    queryFn: () => getCharacterDetail(characterId),
    staleTime: 1000 * 60 * 5,
  });
};
