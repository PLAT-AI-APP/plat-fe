import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { Persona } from "@/type/persona";

// 서버 응답 전체 구조
export interface MePersonasResponse {
  data: Persona[];
}

const GetMePersonas = async () => {
  const response =
    await authAxios.get<ApiSuccessResponse<MePersonasResponse>>(
      "/users/me/personas",
    );
  console.log(response.data.data);
  return response.data.data;
};

/** 페르소나 목록 조회 */
export const useMePersonasQuery = (
  // UseQueryOptions를 사용하여 표준 옵션들을 전달받을 수 있게 설정합니다.
  options?: Partial<UseQueryOptions<MePersonasResponse, AppError, Persona[]>>,
) => {
  return useQuery<MePersonasResponse, AppError, Persona[]>({
    queryKey: ["me-persona-list"],
    queryFn: GetMePersonas,
    ...options, // 외부에서 넘어온 옵션으로 덮어씌우거나 추가합니다.
  });
};
