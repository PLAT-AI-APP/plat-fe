/**
 * 브라우저가 한가할 때 실행한다. requestIdleCallback 이 없는 Safari 는 잠깐 미룬다.
 * 돌려주는 함수로 취소한다(effect 정리용).
 */
export const runWhenIdle = (task: () => void) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(task, { timeout: 3000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(task, 1500);
  return () => clearTimeout(id);
};
