import axios, {
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

/**
 * 조회(GET) 요청 1차 속도 제한.
 *
 * 화면이 같은 조회를 겹쳐 부르거나(버튼 연타·탭 왕복), 누군가 콘솔에서 반복 호출을 걸어도
 * 서버로 나가는 양을 브라우저 단에서 먼저 묶는다. 막는 게 아니라 늦춘다 — 사용자는 실패를 보지 않고,
 * 서버는 순간 폭주를 받지 않는다. 우회는 막을 수 없으므로 진짜 통제는 서버 필터(RateLimitFilter)가 한다.
 *
 * 1) 같은 주소·같은 파라미터·같은 인증으로 이미 나가 있는 GET 이 있으면 새로 보내지 않고 그 응답을 나눠 쓴다.
 * 2) 토큰 버킷: 순간 BURST 개까지는 바로 보내고, 그다음부터는 초당 REFILL_PER_SEC 개 속도로 줄 세워 보낸다.
 */
const BURST = 20;
const REFILL_PER_SEC = 10;

let tokens = BURST;
let lastRefillAt = Date.now();
/** 줄 선 요청이 순서대로 나가도록 마지막 예약 시각을 이어 붙인다. */
let queueTail: Promise<void> = Promise.resolve();

const refill = () => {
  const now = Date.now();
  tokens = Math.min(
    BURST,
    tokens + ((now - lastRefillAt) / 1000) * REFILL_PER_SEC,
  );
  lastRefillAt = now;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const takeToken = (): Promise<void> => {
  const turn = queueTail.then(async () => {
    refill();
    if (tokens < 1) {
      await sleep(((1 - tokens) / REFILL_PER_SEC) * 1000);
      refill();
    }
    tokens -= 1;
  });
  queueTail = turn;
  return turn;
};

const inFlight = new Map<string, Promise<AxiosResponse>>();

const requestKey = (config: InternalAxiosRequestConfig) =>
  JSON.stringify([
    config.baseURL,
    config.url,
    config.params ?? null,
    config.headers?.Authorization ?? null,
    config.headers?.["Accept-Language"] ?? null,
  ]);

/** 기본 어댑터를 감싸 GET 에만 묶음·속도 제한을 건다. 다른 메서드는 그대로 보낸다. */
export const withGetThrottle = (adapter: AxiosAdapter): AxiosAdapter => {
  return async (config) => {
    if ((config.method ?? "get").toLowerCase() !== "get") return adapter(config);

    // 취소 신호를 쓰는 요청은 나눠 쓰면 한쪽 취소가 다른 쪽까지 끊는다. 속도 제한만 건다.
    if (config.signal) {
      await takeToken();
      return adapter(config);
    }

    const key = requestKey(config);
    const shared = inFlight.get(key);
    // 응답 인터셉터가 response.data 를 바꿔 끼우므로, 받는 쪽마다 겉껍데기를 새로 만든다.
    // 실패도 받는 쪽의 config 로 바꿔 돌려준다. 401 재발급이 config 에 _retry 를 표시하므로 섞이면 안 된다.
    if (shared) {
      return shared.then(
        (response) => ({ ...response, config }),
        (error: unknown) => {
          if (!axios.isAxiosError(error)) throw error;
          throw Object.assign(
            Object.create(Object.getPrototypeOf(error) as object),
            error,
            { config },
          );
        },
      );
    }

    const pending = takeToken()
      .then(() => adapter(config))
      .finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
    return pending.then((response) => ({ ...response }));
  };
};

/** 인스턴스의 기본 어댑터를 속도 제한 어댑터로 바꾼다. */
export const installGetThrottle = (instance: {
  defaults: { adapter?: InternalAxiosRequestConfig["adapter"] };
}) => {
  if (typeof window === "undefined") return;
  instance.defaults.adapter = withGetThrottle(
    axios.getAdapter(instance.defaults.adapter ?? ["xhr", "http", "fetch"]),
  );
};
