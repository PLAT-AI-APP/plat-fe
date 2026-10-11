import { redirect } from "next/navigation";
import { getDocsLocales } from "@/api/docs/server";
import { docsPath } from "@/components/docs/docsPath";

/** /docs 는 서버가 정한 기본 언어의 문서 홈으로 보낸다. */
export default async function DocsIndexPage() {
  const { defaultLocale } = await getDocsLocales();
  redirect(docsPath.home(defaultLocale));
}
