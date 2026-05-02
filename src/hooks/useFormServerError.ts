import { useFormContext, FieldValues, Path } from "react-hook-form";

export const useFormServerError = <T extends FieldValues>() => {
  const { setError } = useFormContext<T>();

  /**
   * 서버의 필드 에러 객체를 받아 React Hook Form 상태에 등록
   * @param fields - { [fieldName]: "errorMessage" } 형태의 객체
   */
  const setFieldErrors = (fields?: Partial<Record<string, string>>) => {
    if (!fields) return false;

    Object.entries(fields).forEach(([key, message]) => {
      // key가 T(폼 타입)의 실제 필드명인지 확인하며 setError 적용
      setError(key as Path<T>, {
        type: "server",
        message: message,
      });
    });

    return true;
  };

  return { setFieldErrors };
};
