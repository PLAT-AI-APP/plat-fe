import { FieldValues, Path, useFormContext } from "react-hook-form";

export const useFormServerError = <T extends FieldValues>() => {
  const { setError, setFocus } = useFormContext<T>();

  const setFieldErrors = (fields?: Partial<Record<string, string>>) => {
    if (!fields) return false;

    const entries = Object.entries(fields);
    if (entries.length === 0) return false;

    const lastErrorKey = entries[entries.length - 1][0];
    setFocus(lastErrorKey as Path<T>);

    entries.forEach(([key, message]) => {
      setError(key as Path<T>, {
        type: "server",
        message,
      });
    });

    return true;
  };

  return { setFieldErrors };
};
