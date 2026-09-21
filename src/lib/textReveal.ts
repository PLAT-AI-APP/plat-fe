/**
 * 스트림으로 한꺼번에 몰려 온 글자를 한 글자씩 이어 보여 주는 도우미.
 *
 * 서버나 중간 프록시가 토큰을 모아서 보내면 응답이 통째로 툭 나타난다. 받은 글자는 target 에 쌓고,
 * 화면에는 프레임마다 조금씩만 내보낸다. 밀린 양이 많을수록 한 번에 더 내보내 스트림보다 뒤처지지 않는다.
 */
export const createTextReveal = (onReveal: (text: string) => void) => {
  let target = "";
  let shownLength = 0;
  let isFinished = false;
  let frameId: number | null = null;
  let resolveDrained: (() => void) | null = null;

  const settle = () => {
    frameId = null;
    resolveDrained?.();
    resolveDrained = null;
  };

  const tick = () => {
    const backlog = target.length - shownLength;

    if (backlog > 0) {
      // 남은 양의 일정 비율만큼 내보내 처음엔 빠르게, 따라잡을수록 한 글자씩 천천히 나온다.
      shownLength += Math.max(1, Math.ceil(backlog / 12));
      onReveal(target.slice(0, shownLength));
    }

    if (isFinished && shownLength >= target.length) {
      settle();
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
        if (frameId !== null) cancelAnimationFrame(frameId);
        if (shownLength < target.length) {
          shownLength = target.length;
          onReveal(target);
        }
        frameId = null;
        return Promise.resolve();
      }

      if (shownLength >= target.length) {
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
        return Promise.resolve();
      }

      ensureRunning();
      return new Promise<void>((resolve) => {
        resolveDrained = resolve;
      });
    },

    cancel() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      resolveDrained?.();
      resolveDrained = null;
    },
  };
};
