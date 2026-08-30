"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

export const DELETE_UNIVERSE_MUTATION_KEY = ["delete-universe"];

const deleteUniverse = async (universeId: string) => {
  await authAxios.delete(`/universe/${universeId}`);
};

export const useUniverseDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationKey: DELETE_UNIVERSE_MUTATION_KEY,
    mutationFn: deleteUniverse,
    onSuccess: (_, universeId) => {
      queryClient.removeQueries({
        queryKey: ["get-universe-detail", universeId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-today-pick"] });
      queryClient.invalidateQueries({ queryKey: ["get-new-work"] });
      queryClient.invalidateQueries({ queryKey: ["get-official-preview"] });
      queryClient.invalidateQueries({ queryKey: ["get-asset-preview"] });
      queryClient.invalidateQueries({ queryKey: ["get-popular-tag"] });
      queryClient.invalidateQueries({ queryKey: ["get-user-recommend"] });
    },
  });
};
