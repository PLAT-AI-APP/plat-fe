/** 밀린 글자가 적을 때 내보내는 기본 속도(초당 글자 수). 눈으로 따라 읽을 수 있는 정도다. */
const BASE_CHARS_PER_SECOND = 60;

/**
 * 화면이 받은 글자보다 최대 이만큼(초)만 뒤처지게 한다.
 *
 * 긴 글이 한 번에 몰려 오면 이 시간 안에 따라잡도록 속도를 올린다. 예전처럼 프레임마다 밀린 양의
 * 일정 비율을 내보내면 첫 몇 프레임에 대부분이 쏟아져(600자면 0.2초 안에 절반 이상) 결국 툭
 * 나타난 것처럼 보였다.
 */
const MAX_LAG_SECONDS = 3;

/** 탭 전환 등으로 프레임이 오래 멈췄다 돌아와도 밀린 시간만큼 한꺼번에 쏟아내지 않도록 묶는 상한. */
const MAX_FRAME_SECONDS = 0.1;

/**
 * 화면에 글자를 내보내는 최소 간격(약 초당 30번).
 *
 * 내보낼 때마다 채팅방이 다시 그려지므로, 매 프레임(초당 60번) 내보내면 렌더도 그만큼 돈다.
 * 글자가 써지는 모습은 초당 30번이면 충분히 부드럽고 렌더는 절반이 된다. 받은 글자를 다 따라잡은
 * 순간에는 간격과 상관없이 바로 내보내 마지막 글자가 늦게 나오지 않게 한다.
 */
const MIN_REVEAL_INTERVAL_MS = 32;

/** 이모지 같은 서로게이트 쌍의 앞 절반에서 자르면 깨진 글자가 잠깐 보이므로 그 앞에서 멈춘다. */
const toSafeCutIndex = (text: string, index: number) => {
  const code = text.charCodeAt(index - 1);
  return code >= 0xd800 && code <= 0xdbff ? index - 1 : index;
};

/**
 * 스트림으로 한꺼번에 몰려 온 글자를 일정한 속도로 이어 보여 주는 도우미.
 *
 * 서버나 중간 프록시가 토큰을 모아서 보내면 응답이 통째로 툭 나타난다. 받은 글자는 target 에 쌓고,
 * 화면에는 흐른 시간만큼만 내보낸다. 프레임 수가 아니라 시간 기준이라 화면 주사율과 관계없이 같은 속도로 보인다.
 */
export const createTextReveal = (onReveal: (text: string) => void) => {
  let target = "";
  // 한 프레임에 1글자가 안 되는 몫도 버리지 않도록 소수로 누적한다.
  let revealed = 0;
  let shownLength = 0;
  let lastFrameTime: number | null = null;
  let lastRevealTime = -Infinity;
  let isFinished = false;
  let frameId: number | null = null;
  let resolveDrained: (() => void) | null = null;

  const stop = () => {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
    lastFrameTime = null;
  };

  const settle = () => {
    stop();
    resolveDrained?.();
    resolveDrained = null;
  };

  const tick = (now: number) => {
    const elapsedSeconds =
      lastFrameTime === null
        ? 0
        : Math.min((now - lastFrameTime) / 1000, MAX_FRAME_SECONDS);
    lastFrameTime = now;

    const backlog = target.length - revealed;
    if (backlog > 0) {
      const charsPerSecond = Math.max(
        BASE_CHARS_PER_SECOND,
        backlog / MAX_LAG_SECONDS,
      );
      revealed = Math.min(target.length, revealed + charsPerSecond * elapsedSeconds);

      const nextLength = toSafeCutIndex(target, Math.floor(revealed));
      const isCaughtUp = nextLength >= target.length;
      const isDue = now - lastRevealTime >= MIN_REVEAL_INTERVAL_MS;
      if (nextLength > shownLength && (isDue || isCaughtUp)) {
        shownLength = nextLength;
        lastRevealTime = now;
        onReveal(target.slice(0, shownLength));
      }
    }

    if (shownLength >= target.length) {
      if (isFinished) {
        settle();
        return;
      }

      // 다 따라잡았으면 다음 글자가 올 때까지 프레임을 돌리지 않는다. push 가 다시 깨운다.
      stop();
      return;
    }

    frameId = requestAnimationFrame(tick);
  };

  const ensureRunning = () => {
    if (frameId === null) frameId = requestAnimationFrame(tick);
  };

  return {
    push(token: string) {
      target += token;
      ensureRunning();
    },

    /** 받을 글자가 끝났음을 알리고, 화면에 다 내보낼 때까지 기다린다. */
    finish() {
      isFinished = true;

      // 숨겨진 탭에서는 requestAnimationFrame 이 멈춰 영원히 끝나지 않으므로 남은 글자를 바로 내보낸다.
      if (typeof document !== "undefined" && document.hidden) {
        stop();
        if (shownLength < target.length) {
          revealed = target.length;
          shownLength = target.length;
          onReveal(target);
        }
        return Promise.resolve();
      }

      if (shownLength >= target.length) {
        stop();
        return Promise.resolve();
      }

      ensureRunning();
      return new Promise<void>((resolve) => {
        resolveDrained = resolve;
      });
    },

    cancel() {
      settle();
    },
  };
};
