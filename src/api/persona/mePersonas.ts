import { useQuery } from "@tanstack/react-query";
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
export const useMePersonasQuery = () => {
  return useQuery<MePersonasResponse, AppError, Persona[]>({
    queryKey: ["me-persona-list"],
    // select: (response) => response.data,
    queryFn: GetMePersonas,
  });
};
