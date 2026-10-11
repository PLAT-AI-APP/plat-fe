import { redirect } from "next/navigation";
import { DEFAULT_DOCS_LOCALE } from "@/api/docs/types";
import { docsPath } from "@/components/docs/docsPath";

/** /docs 는 기본 언어 문서 홈으로 보낸다. */
export default function DocsIndexPage() {
  redirect(docsPath.home(DEFAULT_DOCS_LOCALE));
}
