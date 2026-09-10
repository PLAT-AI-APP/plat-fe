import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ChangeQueryStringProps {
  updateKey: string;
  updateValue: string;
  /** true=기록을 남김 기본은 false*/
  isHistory?: boolean;
}
/**
 * @returns changeQueryString 현재 경로에서 쿼리스트링을 추가해주는 함수 반환
 */
export const useChangeQueryString = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams.toString());

  const changeQueryString = ({
    updateKey,
    updateValue,
    isHistory = false,
  }: ChangeQueryStringProps) => {
    params.set(updateKey, updateValue);

    return isHistory
      ? router.push(`${pathname}?${params.toString()}`)
      : router.replace(`${pathname}?${params.toString()}`);
  };

  return changeQueryString;
};
