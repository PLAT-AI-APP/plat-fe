import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 경로가 변경됨을 감지하고 특정 함수를 실행하는 hook
 * @param callbackFn 경로가 변경될 때마다 실행될 로직
 */
const useRouteEffect = (callbackFn: () => void) => {
  const pathname = usePathname();

  useEffect(() => {
    // 경로가 변경될 때마다 실행될 로직
    callbackFn();
  }, [pathname]); // pathname이 바뀔 때마다 useEffect 실행
};

export default useRouteEffect;
