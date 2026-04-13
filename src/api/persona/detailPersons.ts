import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { Persona } from "@/type/persona";

const GetDetailPersona = async (personaId: number) => {
  const response = await authAxios.get<ApiSuccessResponse<Persona>>(
    `/users/me/personas/${personaId}`,
  );

  return response.data.data;
};

/** 페르소나 상세 조회 */
export const useDetailPersonaQuery = (
  personaId: number,
  options?: Partial<UseQueryOptions<Persona, AppError>>,
) => {
  return useQuery<Persona, AppError>({
    queryKey: ["get-persona-detail", personaId],
    queryFn: () => GetDetailPersona(personaId),
    ...options,
  });
};
