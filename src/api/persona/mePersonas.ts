import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { Persona } from "@/type/persona";

export interface MePersonasResponse {
  data: Persona[];
}

const getNormalizedPersonas = (
  payload: MePersonasResponse | Persona[],
): Persona[] => {
  // 백엔드/목업 응답이 `Persona[]` 또는 `{ data: Persona[] }` 형태로 섞여 와도
  // UI에서는 항상 배열만 받도록 여기서 한 번 정규화합니다.
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const GetMePersonas = async () => {
  const response =
    await authAxios.get<ApiSuccessResponse<MePersonasResponse | Persona[]>>(
      "/users/me/personas",
    );

  return getNormalizedPersonas(response.data.data);
};

/** 페르소나 목록 조회 */
export const useMePersonasQuery = (
  // queryFn 단계에서 배열로 정규화하므로 UI는 Persona[]만 신뢰하면 됩니다.
  options?: Partial<UseQueryOptions<Persona[], AppError, Persona[]>>,
) => {
  return useQuery<Persona[], AppError, Persona[]>({
    queryKey: ["me-persona-list"],
    queryFn: GetMePersonas,
    ...options,
  });
};
