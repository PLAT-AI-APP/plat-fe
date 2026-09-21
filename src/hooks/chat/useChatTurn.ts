"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notifyApiError } from "@/api";
import { walletQueryKeys } from "@/api/wallet/queryKeys";
import { consumeChatStream } from "@/api/chat/chatStream";
import { usePostChatStartMutation } from "@/api/chat/postChatStart";
import { prependLatestRoomMessages } from "@/api/room/getRoomMessages";
import { roomQueryKeys } from "@/api/room/queryKeys";
import { getApiErrorMessage } from "@/lib/apiError";
import { createTextReveal } from "@/lib/textReveal";
import { showAppToast } from "@/lib/toast";
import type { ChatMessageType } from "@/type/chat";

// 서버는 턴이 끝난 뒤 두 메시지를 저장하므로, 바로 조회하면 아직 없을 수 있어 잠깐 기다리며 다시 봅니다.
const SYNC_RETRY_COUNT = 3;
const SYNC_RETRY_DELAY_MS = 1000;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

interface UseChatTurnParams {
  roomId: string;
  /** 세계관 안의 캐릭터 ID. 세계관 상세를 받기 전에는 없습니다. */
  universeCharacterId?: string;
  personaId?: string;
  /** ChatModelOption.name. 모델 목록을 받기 전에는 없습니다. */
  modelId?: string;
  multiplier?: number;
  characterName: string;
  profileImage: string;
}

interface ChatTurnState {
  chatTurnId: string;
  userContent: string;
  assistantContent: string;
}

/**
 * 채팅 한 턴(전송 → 토큰 스트림 수신 → 저장된 메시지 반영)을 다룹니다.
 *
 * 턴이 진행되는 동안의 사용자 말풍선과 응답은 서버 이력과 별개로 pendingMessages 에 담기고,
 * 서버가 저장을 마쳐 이력에 들어오면 그때 지웁니다.
 */
export const useChatTurn = ({
  roomId,
  universeCharacterId,
  personaId,
  modelId,
  multiplier,
  characterName,
  profileImage,
}: UseChatTurnParams) => {
  const queryClient = useQueryClient();
  const { mutateAsync: startChat } = usePostChatStartMutation();
  const [turn, setTurn] = useState<ChatTurnState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  // state 는 다음 렌더에야 반영돼, 연달아 눌린 전송을 막으려면 즉시 읽히는 ref 가 필요합니다.
  const isBusyRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 화면을 떠나면 스트림 구독만 끊습니다. 생성은 서버에서 끝까지 이어지고 결과는 이력에 저장됩니다.
  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
    },
    [],
  );

  const syncSavedMessages = useCallback(async () => {
    for (let attempt = 0; attempt < SYNC_RETRY_COUNT; attempt += 1) {
      const addedCount = await prependLatestRoomMessages(queryClient, roomId);
      if (addedCount > 0) return true;

      await wait(SYNC_RETRY_DELAY_MS);
    }

    return false;
  }, [queryClient, roomId]);

  const runTurn = useCallback(
    async (
      message: string,
      chatTurnId: string,
      abortController: AbortController,
      request: { universeCharacterId: string; personaId: string; modelId: string },
    ) => {
      let hasStarted = false;
      let shouldKeepPending = false;
      // 토큰이 뭉쳐서 와도 응답이 툭 나타나지 않도록 화면에는 조금씩 이어 보여 준다.
      const reveal = createTextReveal((text) => {
        setTurn((previous) =>
          previous ? { ...previous, assistantContent: text } : previous,
        );
      });

      try {
        // 시작 요청의 실패 토스트는 MutationCache 가 이미 띄웁니다.
        const { turnId } = await startChat({
          chatTurnId,
          context: {
            roomId,
            universeCharacterId: request.universeCharacterId,
            personaId: request.personaId,
          },
          generation: {
            message,
            model: request.modelId,
            multiplier: multiplier ?? 1,
          },
        });
        hasStarted = true;

        let hasFailed = false;
        await consumeChatStream({
          turnId,
          signal: abortController.signal,
          onToken: (token) => reveal.push(token),
          onFailed: (reason) => {
            hasFailed = true;
            // reason 은 서버가 준 실패 코드(예: AI_PROVIDER_FAILED)다. 사용자에게는 같은 문구를 보이되,
            // 원인을 알 수 있게 콘솔에 남기고 개발 모드에서는 토스트에도 붙인다.
            console.error("[chat] 응답 생성 실패:", reason);
            showAppToast("error", getApiErrorMessage("chatNoResponse"), {
              description:
                process.env.NODE_ENV === "production" ? undefined : reason,
            });
          },
        });

        // 받은 글자를 화면에 다 내보낸 뒤에 임시 말풍선을 서버 이력으로 바꿔야 끝에서 툭 튀지 않는다.
        await reveal.finish();

        // 실패해도 부분 응답이 저장됐을 수 있어, 이력을 한 번 확인한 뒤에 화면의 임시 말풍선을 치웁니다.
        const isSynced = await syncSavedMessages();
        shouldKeepPending = !isSynced && !hasFailed;

        void queryClient.invalidateQueries({
          queryKey: walletQueryKeys.balance(),
        });
        void queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
      } catch (error) {
        reveal.cancel();
        if (abortController.signal.aborted) return;

        // 스트림 구독 실패(네트워크 등)는 MutationCache 를 거치지 않아 여기서 알립니다.
        if (hasStarted) notifyApiError(error);
      } finally {
        if (!abortController.signal.aborted) {
          isBusyRef.current = false;
          setIsBusy(false);
          // 저장 확인이 끝내 안 된 정상 응답은 사라지지 않게 남겨 둡니다.
          if (!shouldKeepPending) setTurn(null);
        }
      }
    },
    [multiplier, roomId, startChat, syncSavedMessages, queryClient],
  );

  /** 전송을 받아들였는지 바로 돌려줍니다. 받지 못했으면 입력창이 글을 지우지 않도록 false 입니다. */
  const sendMessage = useCallback(
    (rawMessage: string) => {
      const message = rawMessage.trim();

      if (
        !message ||
        !universeCharacterId ||
        !personaId ||
        !modelId ||
        isBusyRef.current
      ) {
        return false;
      }

      const chatTurnId = crypto.randomUUID();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      isBusyRef.current = true;
      setIsBusy(true);
      setTurn({ chatTurnId, userContent: message, assistantContent: "" });

      void runTurn(message, chatTurnId, abortController, {
        universeCharacterId,
        personaId,
        modelId,
      });

      return true;
    },
    [universeCharacterId, personaId, modelId, runTurn],
  );

  const pendingMessages = useMemo<ChatMessageType[]>(() => {
    if (!turn) return [];

    const messages: ChatMessageType[] = [
      {
        id: `pending-user-${turn.chatTurnId}`,
        role: "user",
        content: turn.userContent,
      },
    ];

    // 첫 토큰이 오기 전에는 빈 말풍선을 그리지 않습니다.
    if (turn.assistantContent) {
      messages.push({
        id: `pending-assistant-${turn.chatTurnId}`,
        role: "assistant",
        characterName,
        profileImage,
        content: turn.assistantContent,
      });
    }

    return messages;
  }, [turn, characterName, profileImage]);

  return {
    pendingMessages,
    /** 응답을 기다리거나 받는 중인지. 이 동안은 다음 전송을 받지 않습니다. */
    isBusy,
    sendMessage,
  };
};
