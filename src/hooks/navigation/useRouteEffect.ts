import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * 경로가 변경됨을 감지하고 특정 함수를 실행하는 hook
 * 최초 진입/마운트 시점에는 실행되지 않으며, 오직 주소(pathname)가 '이동'했을 때만 실행됩니다.
 */
const useRouteEffect = (callbackFn: () => void) => {
  const pathname = usePathname();
  const savedCallback = useRef(callbackFn);

  // 최초 마운트 시점의 주소를 기억해 둡니다.
  const prevPathname = useRef(pathname);

  // 최신 callback을 유지하여 클로저 문제 방지
  useEffect(() => {
    savedCallback.current = callbackFn;
  }, [callbackFn]);

  useEffect(() => {
    // 이전 주소와 현재 주소가 '실제로 다를 때만' 페이지 이동으로 간주하고 실행합니다.
    if (prevPathname.current !== pathname) {
      savedCallback.current();

      // 실행 후 다음 이동을 위해 이전 주소를 현재 주소로 업데이트합니다.
      prevPathname.current = pathname;
    }
  }, [pathname]);
};

export default useRouteEffect;
