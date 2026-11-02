/**
 * 브라우저 뒤로가기/앞으로가기(popstate)를 next-navigation-guard 보다 먼저 받아 막는다.
 *
 * 라이브러리는 popstate 를 자기 리스너에서 삼켰다가 다시 쏘는데, Next.js 16 에서는 이 흐름이 가드 콜백까지
 * 가지 않고 그대로 통과해 버린다. 같은 대상의 리스너는 등록한 순서대로 불리고 capture 여도 앞서지 못하므로,
 * Next.js 라우터와 라이브러리의 리스너(마운트 때 등록)보다 먼저 등록되도록 앱 로드 때 모듈 최상단에서 단다.
 * instrumentation-client.ts 가 이 파일을 import 해 그 시점을 보장한다(하이드레이션 전에 실행된다).
 */

type BlockedHandler = (targetPath: string) => void;

let blockedHandler: BlockedHandler | null = null;
// 막은 뒤 원래 위치로 돌아가려고 history.go 를 부르면 popstate 가 한 번 더 오는데, 그건 막지 않고 통과시킨다.
let isRestoring = false;

const readStackIndex = (state: unknown) => {
  const index = Number((state as Record<string, unknown> | null)?.__next_navigation_guard_stack_index);
  return Number.isFinite(index) ? index : null;
};

// 현재 화면의 history 위치. 막을 때 몇 칸을 되돌아가야 하는지 계산하는 기준이다.
let currentStackIndex: number | null = null;

if (typeof window !== "undefined") {
  currentStackIndex = readStackIndex(window.history.state);

  window.addEventListener("popstate", (event) => {
    if (isRestoring) {
      isRestoring = false;
      currentStackIndex = readStackIndex(event.state);
      return;
    }

    if (!blockedHandler) {
      currentStackIndex = readStackIndex(event.state);
      return;
    }

    // Next.js·라이브러리가 이 이동을 처리하지 못하게 하고, URL 만 바뀐 상태를 원위치로 되돌린다.
    event.stopImmediatePropagation();

    const targetIndex = readStackIndex(event.state);
    const delta = currentStackIndex !== null && targetIndex !== null ? currentStackIndex - targetIndex : 1;
    const targetPath = window.location.pathname + window.location.search;

    isRestoring = true;
    window.history.go(delta);
    // 복구 이동이 일어나지 않아도 플래그가 남아 다음 뒤로가기를 놓치지 않게 한다.
    window.setTimeout(() => {
      isRestoring = false;
    }, 500);

    blockedHandler(targetPath);
  });
}

/** 뒤로가기를 막을 화면이 켜고 끈다. handler 에는 사용자가 가려던 경로가 넘어온다. */
export const setPopStateGuard = (handler: BlockedHandler | null) => {
  blockedHandler = handler;
  if (handler && typeof window !== "undefined") {
    currentStackIndex = readStackIndex(window.history.state);
  }
};
