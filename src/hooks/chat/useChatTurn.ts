"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { notifyManager, useQueryClient } from "@tanstack/react-query";
import { notifyApiError } from "@/api";
import { walletQueryKeys } from "@/api/wallet/queryKeys";
import { noteQueryKeys } from "@/api/note/queryKeys";
import { consumeChatStream } from "@/api/chat/chatStream";
import { chatQueryKeys } from "@/api/chat/queryKeys";
import { usePostChatRegenerateMutation } from "@/api/chat/postChatRegenerate";
import { usePostChatStartMutation } from "@/api/chat/postChatStart";
import {
  prependLatestRoomMessages,
  removeRoomMessagesFromCacheFrom,
} from "@/api/room/getRoomMessages";
import { roomQueryKeys } from "@/api/room/queryKeys";
import { getApiErrorMessage, isAppError } from "@/lib/apiError";
import {
  parseRecommendations,
  stripRecommendationBlock,
} from "@/lib/chatRecommendations";
import { createTextReveal } from "@/lib/textReveal";
import { showAppToast } from "@/lib/toast";
import { useDialogStore } from "@/store/useDialogStore";
import type { ChatMessageType, ChatStartResponse } from "@/type/chat";

/** 크레딧 예약 시 잔액이 모자라면 서버가 주는 코드(422). */
const CREDIT_INSUFFICIENT_CODE = "CREDIT_INSUFFICIENT";
/** 같은 사용자의 이전 턴이 아직 생성 중이라 새 턴을 받지 않을 때 서버가 주는 코드(409). */
const CHAT_TURN_IN_PROGRESS_CODE = "CHAT_TURN_IN_PROGRESS";

// 서버는 턴이 끝난 뒤 두 메시지를 저장하므로, 바로 조회하면 아직 없을 수 있어 잠깐 기다리며 다시 봅니다.
const SYNC_RETRY_COUNT = 3;
const SYNC_RETRY_DELAY_MS = 1000;
/** 저장 확인이 안 된 채 남겨 둔 응답을 다시 확인해 보고 거두기까지 기다리는 시간 */
const UNSYNCED_TURN_TTL_MS = 10_000;
/** 이전 턴이 아직 도는 중(409)일 때, 그 결과를 이력에 붙이러 다시 보는 시점들 */
const IN_PROGRESS_RESYNC_DELAYS_MS = [5_000, 15_000];

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
  /** 사용자가 보낸 말. 재생성 턴은 이미 저장된 말을 다시 쓰므로 비어 있다. */
  userContent?: string;
  /** 재생성 턴이 바꿀 옛 AI 답 id. 턴이 도는 동안 화면에서 옛 답을 가린다. */
  replacesMessageId?: string;
  assistantContent: string;
  /** 응답 글자를 아직 받거나 화면에 내보내는 중인지 */
  isStreaming: boolean;
  /** 저장 확인을 끝내 못 해 보이던 대로 남겨 둔 턴. 다음 서버 메시지가 반영되거나 잠시 뒤 거둔다. */
  isUnsynced?: boolean;
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
  const { mutateAsync: startRegenerate } = usePostChatRegenerateMutation();
  const openDialog = useDialogStore((state) => state.openDialog);
  const [turns, setTurns] = useState<ChatTurnState[]>([]);
  // 마지막 응답에 딸려 온 추천 문장. 서버가 저장하지 않으므로 새로고침하면 사라진다.
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  // state 는 다음 렌더에야 반영돼, 연달아 눌린 전송을 막으려면 즉시 읽히는 ref 가 필요합니다.
  const isBusyRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  // 실패 콜백은 부모가 매 렌더 새로 만들 수 있어, runTurn 을 다시 만들지 않도록 ref 로 읽는다.
  const onTurnFailedRef = useRef(onTurnFailed);
  useEffect(() => {
    onTurnFailedRef.current = onTurnFailed;
  }, [onTurnFailed]);

  // 남겨 둔 턴을 거두거나 이력을 다시 보는 예약. 화면을 떠나면 모두 취소한다.
  const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  // 이 화면에서 턴을 한 번이라도 보냈는지. 떠날 때 이력·목록을 새로 받게 할지 정한다.
  const hasRunTurnRef = useRef(false);

  const schedule = useCallback((callback: () => void, delayMs: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delayMs);
    timersRef.current.add(timer);
  }, []);

  // 화면을 떠나면 스트림 구독만 끊습니다. 생성은 서버에서 끝까지 이어지고 결과는 이력에 저장됩니다.
  // 캐시에는 아직 그 결과가 없으므로, 돌아왔을 때 마지막 턴이 빠져 보이지 않게 이력과 목록을 새로 받게 합니다.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      abortControllerRef.current?.abort();
      timers.forEach(clearTimeout);
      timers.clear();
      if (hasRunTurnRef.current) {
        void queryClient.invalidateQueries({
          queryKey: roomQueryKeys.messages(roomId),
        });
        void queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
      }
    };
  }, [queryClient, roomId]);

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

  /** 저장된 새 메시지를 캐시에 붙이고 그 id 를 돌려준다. 끝내 저장이 안 보이면 null. */
  const syncSavedMessages = useCallback(async (): Promise<string[] | null> => {
    for (let attempt = 0; attempt < SYNC_RETRY_COUNT; attempt += 1) {
      // 첫 시도는 바로, 그 뒤로는 저장될 시간을 조금씩 준다. 마지막 시도 뒤에는 기다릴 이유가 없다.
      if (attempt > 0) await wait(SYNC_RETRY_DELAY_MS);

      const addedIds = await prependLatestRoomMessages(queryClient, roomId);
      if (addedIds.length > 0) return addedIds;
    }

    return null;
  }, [queryClient, roomId]);

  /**
   * 저장된 이력을 확인한 뒤 임시 말풍선을 치웁니다.
   *
   * 이력 반영(setQueryData)의 화면 알림은 notifyManager 가 다음 틱에 모아 보낸다. 여기서 바로
   * setTurns 를 부르면 임시 말풍선이 먼저 사라지고 서버 메시지는 한 틱 뒤에 나타나 깜빡인다.
   * 같은 큐에 넣어 두 변경이 한 번에 그려지게 한다.
   */
  const settleTurn = useCallback(
    async (
      chatTurnId: string,
      keepIfUnsynced: boolean,
      replacesMessageId?: string,
    ) => {
      const addedIds = await syncSavedMessages().catch(() => null);
      const isSynced = addedIds !== null;

      if (isSynced || !keepIfUnsynced) {
        notifyManager.schedule(() => {
          // 재생성이 저장됐으면 서버는 옛 답과 그 뒤 대화를 지웠다. 캐시에서도 같이 빼야 다시 보이지 않는다.
          // 저장되지 않았으면(실패) 서버에 그대로 있으니 가림만 푼다.
          if (addedIds && replacesMessageId) {
            removeRoomMessagesFromCacheFrom(
              queryClient,
              roomId,
              replacesMessageId,
              addedIds,
            );
          }
          // 새 서버 메시지가 반영됐으면 그보다 앞서 남겨 둔 미확정 턴도 이번 조회에 함께 들어왔거나
          // 끝내 저장되지 않은 것이다. 그대로 두면 서버 메시지와 겹쳐 두 번 보인다.
          setTurns((previous) =>
            previous.filter(
              (turn) =>
                turn.chatTurnId !== chatTurnId &&
                !(isSynced && turn.isUnsynced),
            ),
          );
        });
      } else {
        // 저장 확인이 끝내 안 된 정상 응답은 바로 사라지지 않게 남겨 두고, 잠시 뒤 한 번 더 확인한 다음 거둔다.
        // 그때까지도 이력에 없으면 서버에 저장되지 않은 것이라 계속 들고 있으면 새로고침과 화면이 어긋난다.
        updateTurn(chatTurnId, { isUnsynced: true });
        schedule(() => {
          void prependLatestRoomMessages(queryClient, roomId)
            .catch(() => [] as string[])
            .then((lateIds) => {
              notifyManager.schedule(() => {
                if (lateIds.length > 0 && replacesMessageId) {
                  removeRoomMessagesFromCacheFrom(
                    queryClient,
                    roomId,
                    replacesMessageId,
                    lateIds,
                  );
                }
                removeTurn(chatTurnId);
              });
            });
        }, UNSYNCED_TURN_TTL_MS);
      }

      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
      // 지나온 대화는 요약이 비동기로 바뀌고, 재생성이면 그 턴 이전으로 되돌아간다.
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.detail(roomId) });
      // 답에 새 에셋이 나왔으면 갤러리에서 풀린다.
      void queryClient.invalidateQueries({
        queryKey: chatQueryKeys.assetGallery(roomId),
      });
    },
    [queryClient, roomId, removeTurn, updateTurn, schedule, syncSavedMessages],
  );

  /** 이전 턴이 서버에서 아직 도는 중이다. 끝나면 저장될 그 결과를 잠시 뒤 이력에 붙인다. */
  const resyncAfterInProgress = useCallback(() => {
    IN_PROGRESS_RESYNC_DELAYS_MS.forEach((delayMs) => {
      schedule(() => {
        void prependLatestRoomMessages(queryClient, roomId).catch(() => []);
        void queryClient.invalidateQueries({ queryKey: roomQueryKeys.lists() });
      }, delayMs);
    });
  }, [queryClient, roomId, schedule]);

  const runTurn = useCallback(
    async (
      chatTurnId: string,
      abortController: AbortController,
      start: () => Promise<ChatStartResponse>,
      options: {
        /** 아무 응답도 못 받고 실패하면 입력창에 되돌릴 원문. 재생성은 되돌릴 입력이 없다. */
        restoreMessage?: string;
        replacesMessageId?: string;
      },
    ) => {
      const { restoreMessage, replacesMessageId } = options;
      hasRunTurnRef.current = true;
      let hasStarted = false;
      let receivedText = "";
      // 화면에 내보낸 본문 길이. 추천 블록을 뗀 뒤 늘어난 만큼만 이어 보낸다.
      let revealedLength = 0;
      // 토큰이 뭉쳐서 와도 응답이 툭 나타나지 않도록 화면에는 조금씩 이어 보여 준다.
      const reveal = createTextReveal((text) => {
        updateTurn(chatTurnId, { assistantContent: text });
      });

      /** 응답 끝의 추천 블록은 말풍선에 그리지 않는다(서버도 저장할 때 뗀다). */
      const revealBody = () => {
        const body = stripRecommendationBlock(receivedText);
        if (body.length <= revealedLength) return;

        reveal.push(body.slice(revealedLength));
        revealedLength = body.length;
      };

      try {
        // 시작 요청은 전역 토스트를 끄고 아래 catch 에서 직접 알린다(노트 부족은 다이얼로그).
        const { turnId } = await start();
        hasStarted = true;

        let hasFailed = false;
        await consumeChatStream({
          turnId,
          signal: abortController.signal,
          onToken: (token) => {
            receivedText += token;
            revealBody();
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

        if (hasFailed && !receivedText) {
          // 한 글자도 못 받고 실패하면 서버는 아무것도 저장하지 않는다. 보낸 말이 잠깐 떠 있다 사라지지 않게
          // 말풍선을 바로 거두고 입력창에 되돌린다. 재생성이면 가려 둔 옛 답이 다시 보인다.
          reveal.cancel();
          if (abortController.signal.aborted) return;
          removeTurn(chatTurnId);
          releaseBusy();
          if (restoreMessage !== undefined) {
            onTurnFailedRef.current?.(restoreMessage);
          }
          return;
        }

        // 받은 글자를 화면에 다 내보낸 뒤에 임시 말풍선을 서버 이력으로 바꿔야 끝에서 툭 튀지 않는다.
        await reveal.finish();
        if (abortController.signal.aborted) return;

        // 추천은 응답을 다 받아야 온전한 JSON 이 된다. 방 설정이 꺼져 있으면 빈 배열이라 그대로 지운다.
        setSuggestions(parseRecommendations(receivedText));

        updateTurn(chatTurnId, { isStreaming: false });
        // 응답이 다 보였으니 바로 다음 말을 받는다. 저장 확인은 뒤에서 이어진다.
        releaseBusy();

        // 실패해도 부분 응답이 저장됐을 수 있어, 이력을 한 번 확인한 뒤에 화면의 임시 말풍선을 치웁니다.
        void settleTurn(chatTurnId, !hasFailed, replacesMessageId);
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
          void settleTurn(chatTurnId, true, replacesMessageId);
          return;
        }

        // 아무 응답도 못 받았다면 보낸 말이 조용히 사라지지 않게, 말풍선을 거두고 입력창에 되돌린다.
        // 재생성이면 가려 둔 옛 답이 다시 보인다.
        removeTurn(chatTurnId);
        if (restoreMessage !== undefined) {
          onTurnFailedRef.current?.(restoreMessage);
        }
        if (!hasStarted) {
          // 노트가 모자라 시작하지 못했으면 토스트 대신 충전으로 안내한다. 보낸 말은 위에서 입력창에 돌려놨다.
          if (isAppError(error) && error.code === CREDIT_INSUFFICIENT_CODE) {
            openDialog("CREDIT_INSUFFICIENT", {});
          } else if (
            isAppError(error) &&
            error.code === CHAT_TURN_IN_PROGRESS_CODE
          ) {
            // 방금 떠났다 돌아온 사이 이전 답이 서버에서 아직 만들어지는 중이다. 곧 이력에 붙인다.
            showAppToast("info", getApiErrorMessage("chatTurnInProgress"));
            resyncAfterInProgress();
          } else {
            notifyApiError(error);
          }
        }
        if (hasStarted) void settleTurn(chatTurnId, false, replacesMessageId);
      } finally {
        if (hasStarted) {
          // 시작된 턴은 성공·실패·중단 어느 쪽이든 예약·정산으로 잔액과 사용 내역이 바뀐다.
          void queryClient.invalidateQueries({
            queryKey: walletQueryKeys.balance(),
          });
          void queryClient.invalidateQueries({
            queryKey: noteQueryKeys.usageHistoryLists(),
          });
        }
      }
    },
    [
      queryClient,
      updateTurn,
      removeTurn,
      releaseBusy,
      settleTurn,
      openDialog,
      resyncAfterInProgress,
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
      // 지난 답에 딸려 온 추천은 새 말을 보내는 순간 의미가 없다.
      setSuggestions([]);
      setTurns((previous) => [
        ...previous,
        {
          chatTurnId,
          userContent: message,
          assistantContent: "",
          isStreaming: true,
        },
      ]);

      void runTurn(
        chatTurnId,
        abortController,
        () =>
          startChat({
            chatTurnId,
            context: { roomId, universeCharacterId, personaId },
            generation: {
              message,
              model: modelId,
              multiplier: multiplier ?? 1,
            },
          }),
        { restoreMessage: message },
      );

      return true;
    },
    [
      universeCharacterId,
      personaId,
      modelId,
      multiplier,
      roomId,
      startChat,
      runTurn,
    ],
  );

  /**
   * AI 답 다시 만들기. 새 답을 받는 동안 옛 답과 그 뒤 대화를 가리고, 서버가 확정하면 그것들을 지우고 새 답을 붙인다.
   * 실패하면 서버에 그대로 있어 가림만 푼다.
   */
  const regenerateMessage = useCallback(
    (messageId: string) => {
      if (
        !universeCharacterId ||
        !personaId ||
        !modelId ||
        isBusyRef.current
      ) {
        return;
      }

      const chatTurnId = crypto.randomUUID();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      isBusyRef.current = true;
      setIsBusy(true);
      setSuggestions([]);
      setTurns((previous) => [
        ...previous,
        {
          chatTurnId,
          replacesMessageId: messageId,
          assistantContent: "",
          isStreaming: true,
        },
      ]);

      void runTurn(
        chatTurnId,
        abortController,
        () =>
          startRegenerate({
            chatTurnId,
            context: { roomId, universeCharacterId, personaId },
            messageId,
            generation: { model: modelId, multiplier: multiplier ?? 1 },
          }),
        { replacesMessageId: messageId },
      );
    },
    [
      universeCharacterId,
      personaId,
      modelId,
      multiplier,
      roomId,
      startRegenerate,
      runTurn,
    ],
  );

  /** 세계관·페르소나·모델을 모두 받아 지금 보낼 수 있는지 */
  const canSend = Boolean(universeCharacterId && personaId && modelId);

  const pendingMessages = useMemo<ChatMessageType[]>(
    () =>
      turns.flatMap((turn) => {
        const messages: ChatMessageType[] =
          turn.userContent === undefined
            ? []
            : [
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

  /** 재생성 중이라 화면에서 가릴 첫 메시지 id. 이 답부터 뒤 대화를 모두 가린다. */
  const replacingFromMessageId = useMemo(
    () => turns.find((turn) => turn.replacesMessageId)?.replacesMessageId,
    [turns],
  );

  return {
    pendingMessages,
    replacingFromMessageId,
    /** 마지막 답의 추천 문장. 방 설정이 꺼져 있거나 아직 답을 받지 않았으면 빈 배열입니다. */
    suggestions,
    /** 응답을 기다리거나 받는 중인지. 이 동안은 다음 전송을 받지 않습니다. */
    isBusy,
    canSend,
    sendMessage,
    regenerateMessage,
  };
};
