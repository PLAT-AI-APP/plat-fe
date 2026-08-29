// import { useQuery } from "@tanstack/react-query";
// import { authAxios } from "..";
// import { AppError } from "@/type/api";
// import { CharacterScenario } from "@/type/character";
//
// export const getCharacterScenarioList = async (characterId: string) => {
//   const response = await authAxios.get<CharacterScenario[]>(
//     `/character/${characterId}/scenarios`,
//   );
//
//   return response.data;
// };
//
// /** Character scenario list API is currently disabled. */
// export const useCharacterScenarioListQuery = (characterId: string) => {
//   return useQuery<CharacterScenario[], AppError>({
//     queryKey: ["get-character-scenario-list", characterId],
//     queryFn: () => getCharacterScenarioList(characterId),
//     staleTime: 1000 * 60 * 5,
//   });
// };
