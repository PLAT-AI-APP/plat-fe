"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { notifyManager, useQueryClient } from "@tanstack/react-query";
import { notifyApiError } from "@/api";
import { walletQueryKeys } from "@/api/wallet/queryKeys";
import { noteQueryKeys } from "@/api/note/queryKeys";
import { consumeChatStream } from "@/api/chat/chatStream";
import { usePostChatStartMutation } from "@/api/chat/postChatStart";
import { prependLatestRoomMessages } from "@/api/room/getRoomMessages";
import { roomQueryKeys } from "@/api/room/queryKeys";
import { getApiErrorMessage, isAppError } from "@/lib/apiError";
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
  /** 응답을 하나도 받지 못하고 실패한 턴의 원문. 입력창에 되돌려 글을 잃지 않게 한다. */
  onTurnFailed?: (message: string) => void;
}

interface ChatTurnState {
  chatTurnId: string;
  userContent: string;
  assistantContent: string;
  /** 응답 글자를 아직 받거나 화면에 내보내는 중인지 */
  isStreaming: boolean;
}

/**
 * 채팅 한 턴(전송 → 토큰 스트림 수신 → 저장된 메시지 반영)을 다룹니다.
 *
 * 턴이 진행되는 동안의 사용자 말풍선과 응답은 서버 이력과 별개로 pendingMessages 에 담기고,
 * 서버가 저장을 마쳐 이력에 들어오면 그때 지웁니다.
 *
 * 응답 글자를 다 내보내면 곧바로 다음 전송을 받습니다. 저장 확인(최대 몇 초)은 뒤에서 이어지므로,
 * 확인을 기다리는 턴과 새 턴이 잠시 함께 있을 수 있어 턴을 배열로 들고 있습니다.
 */
export const useChatTurn = ({
  roomId,
  universeCharacterId,
  personaId,
  modelId,
  multiplier,
  characterName,
  profileImage,
  onTurnFailed,
}: UseChatTurnParams) => {
  const queryClient = useQueryClient();
  const { mutateAsync: startChat } = usePostChatStartMutation();
  const [turns, setTurns] = useState<ChatTurnState[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  // state 는 다음 렌더에야 반영돼, 연달아 눌린 전송을 막으려면 즉시 읽히는 ref 가 필요합니다.
  const isBusyRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  // 실패 콜백은 부모가 매 렌더 새로 만들 수 있어, runTurn 을 다시 만들지 않도록 ref 로 읽는다.
  const onTurnFailedRef = useRef(onTurnFailed);
  useEffect(() => {
    onTurnFailedRef.current = onTurnFailed;
  }, [onTurnFailed]);

  // 화면을 떠나면 스트림 구독만 끊습니다. 생성은 서버에서 끝까지 이어지고 결과는 이력에 저장됩니다.
  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
    },
    [],
  );

  const updateTurn = useCallback(
    (chatTurnId: string, patch: Partial<ChatTurnState>) => {
      setTurns((previous) =>
        previous.map((turn) =>
          turn.chatTurnId === chatTurnId ? { ...turn, ...patch } : turn,
        ),
      );
    },
    [],
  );

  const removeTurn = useCallback((chatTurnId: string) => {
    setTurns((previous) =>
      previous.filter((turn) => turn.chatTurnId !== chatTurnId),
    );
  }, []);

  const releaseBusy = useCallback(() => {
    isBusyRef.current = false;
    setIsBusy(false);
  }, []);

  const syncSavedMessages = useCallback(async () => {
    for (let attempt = 0; attempt < SYNC_RETRY_COUNT; attempt += 1) {
      // 첫 시도는 바로, 그 뒤로는 저장될 시간을 조금씩 준다. 마지막 시도 뒤에는 기다릴 이유가 없다.
      if (attempt > 0) await wait(SYNC_RETRY_DELAY_MS);

      const addedCount = await prependLatestRoomMessages(queryClient, roomId);
      if (addedCount > 0) return true;
    }

    return false;
  }, [queryClient, roomId]);

  /**
   * 저장된 이력을 확인한 뒤 임시 말풍선을 치웁니다.
   *
   * 이력 반영(setQueryData)의 화면 알림은 notifyManager 가 다음 틱에 모아 보낸다. 여기서 바로
   * setTurns 를 부르면 임시 말풍선이 먼저 사라지고 서버 메시지는 한 틱 뒤에 나타나 깜빡인다.
   * 같은 큐에 넣어 두 변경이 한 번에 그려지게 한다.
   */
  const settleTurn = useCallback(
    async (chatTurnId: string, keepIfUnsynced: boolean) => {
      const isSynced = await syncSavedMessages().catch(() => false);

      // 저장 확인이 끝내 안 된 정상 응답은 사라지지 않게 남겨 둡니다.
      if (isSynced || !keepIfUnsynced) {
        notifyManager.schedule(() => removeTurn(chatTurnId));
      }

      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
    },
    [queryClient, removeTurn, syncSavedMessages],
  );

  const runTurn = useCallback(
    async (
      message: string,
      chatTurnId: string,
      abortController: AbortController,
      request: { universeCharacterId: string; personaId: string; modelId: string },
    ) => {
      let hasStarted = false;
      let receivedText = "";
      // 토큰이 뭉쳐서 와도 응답이 툭 나타나지 않도록 화면에는 조금씩 이어 보여 준다.
      const reveal = createTextReveal((text) => {
        updateTurn(chatTurnId, { assistantContent: text });
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
          onToken: (token) => {
            receivedText += token;
            reveal.push(token);
          },
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
        if (abortController.signal.aborted) return;

        updateTurn(chatTurnId, { isStreaming: false });
        // 응답이 다 보였으니 바로 다음 말을 받는다. 저장 확인은 뒤에서 이어진다.
        releaseBusy();

        void queryClient.invalidateQueries({
          queryKey: walletQueryKeys.balance(),
        });
        // 노트를 썼으니 사용 내역도 달라졌다.
        void queryClient.invalidateQueries({
          queryKey: noteQueryKeys.usageHistoryLists(),
        });

        // 실패해도 부분 응답이 저장됐을 수 있어, 이력을 한 번 확인한 뒤에 화면의 임시 말풍선을 치웁니다.
        void settleTurn(chatTurnId, !hasFailed);
      } catch (error) {
        reveal.cancel();
        if (abortController.signal.aborted) return;

        releaseBusy();

        // 스트림 구독 실패(네트워크 끊김 등)는 MutationCache 를 거치지 않아 여기서 알립니다.
        // fetch 가 던지는 TypeError 는 AppError 가 아니라 notifyApiError 가 무시하므로 직접 띄운다.
        if (hasStarted) {
          if (isAppError(error)) notifyApiError(error);
          else showAppToast("error", getApiErrorMessage("chatNoResponse"));
        }

        if (hasStarted && receivedText) {
          // 받다 만 응답이 서버에 저장됐을 수 있다. 확인되면 이력으로 바꾸고, 아니면 보이던 대로 둔다.
          updateTurn(chatTurnId, { isStreaming: false });
          void settleTurn(chatTurnId, true);
          return;
        }

        // 아무 응답도 못 받았다면 보낸 말이 조용히 사라지지 않게, 말풍선을 거두고 입력창에 되돌린다.
        removeTurn(chatTurnId);
        onTurnFailedRef.current?.(message);
        if (hasStarted) void settleTurn(chatTurnId, false);
      }
    },
    [
      multiplier,
      roomId,
      startChat,
      queryClient,
      updateTurn,
      removeTurn,
      releaseBusy,
      settleTurn,
    ],
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
      setTurns((previous) => [
        ...previous,
        {
          chatTurnId,
          userContent: message,
          assistantContent: "",
          isStreaming: true,
        },
      ]);

      void runTurn(message, chatTurnId, abortController, {
        universeCharacterId,
        personaId,
        modelId,
      });

      return true;
    },
    [universeCharacterId, personaId, modelId, runTurn],
  );

  /** 세계관·페르소나·모델을 모두 받아 지금 보낼 수 있는지 */
  const canSend = Boolean(universeCharacterId && personaId && modelId);

  const pendingMessages = useMemo<ChatMessageType[]>(
    () =>
      turns.flatMap((turn) => {
        const messages: ChatMessageType[] = [
          {
            id: `pending-user-${turn.chatTurnId}`,
            role: "user",
            content: turn.userContent,
          },
        ];

        // 첫 토큰이 오기 전에도 자리를 잡아 두면 ChatContentBlock 이 입력 중 표시를 그린다.
        // 전송 후 몇 초간 아무것도 없다가 응답이 툭 나타나지 않게 하려는 것이다.
        if (turn.isStreaming || turn.assistantContent) {
          messages.push({
            id: `pending-assistant-${turn.chatTurnId}`,
            role: "assistant",
            characterName,
            profileImage,
            content: turn.assistantContent,
            isStreaming: turn.isStreaming,
          });
        }

        return messages;
      }),
    [turns, characterName, profileImage],
  );

  return {
    pendingMessages,
    /** 응답을 기다리거나 받는 중인지. 이 동안은 다음 전송을 받지 않습니다. */
    isBusy,
    canSend,
    sendMessage,
  };
};
