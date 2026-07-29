import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { Persona } from "@/type/persona";

interface MePersonasApiResponse {
  code?: string;
  errorCode?: string;
  message?: string;
  result?: "OK";
  content?: Persona[];
  data?:
    | Persona[]
    | {
        content?: Persona[];
        data?: Persona[];
        items?: Persona[];
        personas?: Persona[];
      };
  items?: Persona[];
  personas?: Persona[];
}

/** 페르소나 목록 후보 배열 추출 */
const getPersonaListCandidate = (payload: MePersonasApiResponse) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return (
    payload.data?.personas ??
    payload.data?.items ??
    payload.data?.content ??
    payload.data?.data ??
    payload.personas ??
    payload.items ??
    payload.content
  );
};

/** 페르소나 목록 응답 보정 */
const getNormalizedPersonas = (payload: MePersonasApiResponse): Persona[] => {
  const personas = getPersonaListCandidate(payload);

  if (Array.isArray(personas)) {
    return personas;
  }

  if (payload.result) {
    return [];
  }

  console.warn("/users/me/personas 응답에서 페르소나 배열을 찾지 못했습니다.", {
    payload,
  });

  return [];
};

const GetMePersonas = async () => {
  const response =
    await authAxios.get<MePersonasApiResponse>("/users/me/personas");

  return getNormalizedPersonas(response.data);
};

/** 페르소나 목록 조회 */
export const useMePersonasQuery = (
  options?: Partial<UseQueryOptions<Persona[], AppError, Persona[]>>,
) => {
  return useQuery<Persona[], AppError, Persona[]>({
    queryKey: ["me-persona-list"],
    queryFn: GetMePersonas,
    ...options,
  });
};
