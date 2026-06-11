export const endpoint = (pathname: string) =>
  new RegExp(`${pathname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`);

export const pathValue = (requestUrl: string, pattern: RegExp) =>
  new URL(requestUrl).pathname.match(pattern)?.[1];
