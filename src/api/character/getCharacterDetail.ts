// import { useQuery } from "@tanstack/react-query";
// import { authAxios } from "..";
// import { AppError } from "@/type/api";
// import { CharacterDetail } from "@/type/character";
//
// export const getCharacterDetail = async (characterId: string) => {
//   const response = await authAxios.get<CharacterDetail>(
//     `/character/${characterId}`,
//   );
//
//   return response.data;
// };
//
// /** Character detail API is currently disabled. */
// export const useCharacterDetailQuery = (characterId: string) => {
//   return useQuery<CharacterDetail, AppError>({
//     queryKey: ["get-character-detail", characterId],
//     queryFn: () => getCharacterDetail(characterId),
//     staleTime: 1000 * 60 * 5,
//   });
// };
