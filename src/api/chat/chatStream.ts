import { useAuthStore } from "@/store/useAuthStore";
import { useLocaleStore } from "@/store/useLocaleStore";
import { refreshAccessToken } from "@/api/auth/postRefresh";
import type { AppError } from "@/api";

export interface ChatStreamHandlers {
  /** 토큰 조각이 도착할 때마다 호출됩니다. 조각을 이어붙이면 전체 응답이 됩니다. */
  onToken?: (token: string, eventId: string) => void;
  /** 생성이 정상 종료됐습니다. */
  onDone?: (eventId: string) => void;
  /** 서버가 생성 실패를 알렸습니다. 네트워크 오류가 아니라 생성 자체의 실패입니다. */
  onFailed?: (reason: string, eventId: string) => void;
}

export interface ChatStreamOptions extends ChatStreamHandlers {
  turnId: string;
  /**
   * 마지막으로 받은 이벤트 id. 재연결 시 넘기면 서버가 그 지점부터 이어 보냅니다.
   * 넘기지 않으면 버퍼 처음부터 다시 받습니다.
   */
  lastEventId?: string;
  signal?: AbortSignal;
}

const SSE_ENDPOINT = (turnId: string) => `/chat/${turnId}/stream`;

/** SSE 한 블록(빈 줄로 구분)을 필드 단위로 파싱합니다. */
const parseEventBlock = (block: string) => {
  let id = "";
  let event = "message";
  const dataLines: string[] = [];

  for (const rawLine of block.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    if (!line || line.startsWith(":")) continue;

    const colonIndex = line.indexOf(":");
    const field = colonIndex === -1 ? line : line.slice(0, colonIndex);
    // 스펙상 콜론 뒤 공백 한 칸은 값에 포함하지 않습니다.
    const value =
      colonIndex === -1 ? "" : line.slice(colonIndex + 1).replace(/^ /, "");

    if (field === "id") id = value;
    else if (field === "event") event = value;
    else if (field === "data") dataLines.push(value);
  }

  return { id, event, data: dataLines.join("\n") };
};

const buildHeaders = (lastEventId?: string) => {
  const headers: Record<string, string> = {
    Accept: "text/event-stream",
  };

  const token = useAuthStore.getState().accessToken;
  if (token) headers.Authorization = `Bearer ${token}`;

  if (typeof window !== "undefined") {
    const deviceId = localStorage.getItem("plat_device_id");
    if (deviceId) headers["X-Device-ID"] = deviceId;
    headers["Accept-Language"] = useLocaleStore.getState().locale;
  }

  if (lastEventId) headers["Last-Event-ID"] = lastEventId;

  return headers;
};

const toAppError = (status: number, body: string): AppError => {
  try {
    const parsed = JSON.parse(body) as Partial<AppError>;
    return {
      code: parsed.code || "CHAT_STREAM_ERROR",
      fields: parsed.fields || {},
      message: parsed.message || "채팅 응답을 받지 못했습니다.",
      status,
    };
  } catch {
    return {
      code: "CHAT_STREAM_ERROR",
      fields: {},
      message: "채팅 응답을 받지 못했습니다.",
      status,
    };
  }
};

/**
 * 채팅 턴 출력 스트림(SSE)을 구독합니다.
 *
 * EventSource는 Authorization 헤더를 실을 수 없어 fetch로 직접 읽습니다.
 * 토큰이 만료된 401은 한 번 재발급한 뒤 같은 지점부터 다시 붙습니다.
 */
export const consumeChatStream = async ({
  turnId,
  lastEventId,
  signal,
  onToken,
  onDone,
  onFailed,
}: ChatStreamOptions): Promise<void> => {
  // 끊겨서 다시 붙을 때 이어 받을 지점. 마지막으로 처리한 이벤트 id를 계속 갱신합니다.
  let cursor = lastEventId;

  const connect = async (allowRetry: boolean): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URI ?? ""}${SSE_ENDPOINT(turnId)}`,
      {
        method: "GET",
        headers: buildHeaders(cursor),
        credentials: "include",
        signal,
      },
    );

    if (response.status === 401 && allowRetry) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        useAuthStore.getState().setAccessToken(newAccessToken);
        return connect(false);
      }
    }

    if (!response.ok || !response.body) {
      throw toAppError(response.status, await response.text().catch(() => ""));
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 이벤트 경계는 빈 줄입니다. 마지막 조각은 아직 덜 온 블록이라 버퍼에 남깁니다.
        const blocks = buffer.split(/\n\n|\r\n\r\n/);
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          if (!block.trim()) continue;

          const { id, event, data } = parseEventBlock(block);
          if (id) cursor = id;

          if (event === "done") {
            onDone?.(id);
            return;
          }
          if (event === "failed") {
            onFailed?.(data, id);
            return;
          }
          onToken?.(data, id);
        }
      }
    } finally {
      reader.cancel().catch(() => undefined);
    }
  };

  await connect(true);
};
