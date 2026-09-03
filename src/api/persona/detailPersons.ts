import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { Persona } from "@/type/persona";

interface DetailPersonaApiResponse {
  code?: string;
  data?: Persona | { persona?: Persona };
  errorCode?: string;
  message?: string;
  persona?: Persona;
  result?: "OK";
}

/** 페르소나 상세 객체 여부 */
const isPersona = (value?: Persona | { persona?: Persona }): value is Persona =>
  Boolean(value && "personaId" in value && "name" in value);

/** 페르소나 상세 응답 위치 보정 */
const getNormalizedDetailPersona = (
  payload: DetailPersonaApiResponse,
): Persona => {
  if (isPersona(payload)) {
    return payload;
  }

  const data = payload.data;
  const persona = data && "persona" in data ? data.persona : data;

  if (isPersona(persona)) {
    return persona;
  }

  if (payload.persona) {
    return payload.persona;
  }

  throw {
    code: "MESSAGE",
    fields: {},
    message: "페르소나 상세 응답을 확인해 주세요.",
  } satisfies AppError;
};

const GetDetailPersona = async (personaId: string) => {
  const response = await authAxios.get<DetailPersonaApiResponse>(
    `/users/me/personas/${personaId}`,
  );

  return getNormalizedDetailPersona(response.data);
};

/** 페르소나 상세 조회 */
export const useDetailPersonaQuery = (
  personaId: string,
  options?: Partial<UseQueryOptions<Persona, AppError>>,
) => {
  return useQuery<Persona, AppError>({
    queryKey: ["get-persona-detail", personaId],
    queryFn: () => GetDetailPersona(personaId),
    ...options,
  });
};
