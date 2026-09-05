"use client";

import RouteError from "@/components/state/RouteError";

const ErrorPage = (props: {
  error: Error & { digest?: string };
  reset: () => void;
}) => <RouteError {...props} />;

export default ErrorPage;
