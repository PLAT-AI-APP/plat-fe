"use client";

import { Suspense, use } from "react";
import dynamic from "next/dynamic";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTermsQuery } from "@/api/legal/getTerms";
import { ErrorState } from "@/components/state";
import { LANGUAGE_LIST } from "@/constants/language";
import { LEGAL_SLUG_TYPE, type LegalSlug } from "@/constants/legal";
import { useFadeInAfterLoading } from "@/hooks/common/useFadeInAfterLoading";
import { INTL_LOCALE_BY_APP_LOCALE } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { useLocaleStore } from "@/store/useLocaleStore";

const MarkdownDocument = dynamic(
  () => import("@/components/markdown/MarkdownDocument"),
);

/** 문서 종류별 제목 키. 원문 첫 줄에 제목(# ...)이 없을 때만 쓴다. */
const TITLE_KEY: Record<LegalSlug, string> = {
  terms: "footer.terms",
  privacy: "footer.privacy",
  youth: "footer.youth",
};

const isLegalSlug = (slug: string): slug is LegalSlug =>
  slug in LEGAL_SLUG_TYPE;

/** 원문 첫 줄의 `# 제목` 은 페이지 제목으로 올리고 본문에서는 뺀다(제목이 두 번 보이지 않게). */
const splitTitle = (content: string) => {
  const match = content.match(/^#\s+(.+)\n?/);
  return match
    ? {
        title: match[1].trim(),
        body: content.slice(match[0].length).trimStart(),
      }
    : { title: null, body: content };
};

const DocumentSkeleton = () => (
  <div aria-hidden="true" className="flex flex-col gap-6">
    <div className="flex flex-col gap-2">
      <div className="skeleton h-9 w-2/3 rounded-full" />
      <div className="skeleton h-5 w-40 rounded-full" />
    </div>
    <div className="flex flex-col gap-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="skeleton h-5 w-full rounded-full" />
      ))}
    </div>
  </div>
);

/** 서버 언어 코드(EN) → 그 언어로 쓴 언어 이름(English). */
const LANGUAGE_NAME: Record<string, string> = Object.fromEntries(
  LANGUAGE_LIST.map((item) => [item.locale.toUpperCase(), item.name]),
);

/**
 * 약관·정책 문서. 원문은 관리자 콘솔 > 법적 고지에서 버전으로 올리고, 여기서는 시행 중인 버전을 보여 준다.
 * - `?v=문서ID`: 이미 시행됐던 지난 버전 — 개인정보처리방침은 변경 이력을 공개해야 한다.
 * - `?lang=en`: 그 언어의 번역본. 없으면 앱 언어로 보고, 그 번역본도 없으면 서버가 한국어 원문을 준다.
 *   번역본은 참고용이라 효력은 한국어 원문이 가진다는 것을 함께 알린다.
 * 버전 번호는 사용자에게 의미가 없어 시행일로만 구분한다.
 */
const LegalDocument = ({ slug }: { slug: LegalSlug }) => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocaleStore((state) => state.locale);
  const searchParams = useSearchParams();
  const documentId = searchParams.get("v") ?? undefined;
  const requestedLang = (searchParams.get("lang") ?? locale).toLowerCase();
  const { data, isPending, isError, error, refetch } = useTermsQuery(
    LEGAL_SLUG_TYPE[slug],
    documentId,
    requestedLang,
  );
  const fadeInClassName = useFadeInAfterLoading(isPending);

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(INTL_LOCALE_BY_APP_LOCALE[locale], {
      dateStyle: "long",
    }).format(new Date(iso));

  const current = data?.history[0];
  const isPast = Boolean(
    data && current && data.documentId !== current.documentId,
  );
  const { title, body } = data
    ? splitTitle(data.content)
    : { title: null, body: "" };

  // 번역본을 보고 있으면 참고용이라는 것을, 원하는 언어가 없어 원문을 보고 있으면 그 사실을 알린다.
  const isTranslation = Boolean(data && data.language !== "KO");
  const isFallback = Boolean(
    data && data.language === "KO" && requestedLang !== "ko",
  );

  /** 주소의 v·lang 만 바꾼다. 현재 시행본이면 v 를, 앱 언어와 같으면 lang 을 뺀다. */
  const replaceQuery = (next: { v?: string; lang?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextV = "v" in next ? next.v : (params.get("v") ?? undefined);
    const nextLang =
      "lang" in next ? next.lang : (params.get("lang") ?? undefined);
    params.delete("v");
    params.delete("lang");
    if (nextV && nextV !== current?.documentId) params.set("v", nextV);
    if (nextLang && nextLang !== locale) params.set("lang", nextLang);
    const query = params.toString();
    router.replace(`/legal/${slug}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

  const handleSelectVersion = (nextId: string) => replaceQuery({ v: nextId });
  const handleSelectLanguage = (nextLanguage: string) =>
    replaceQuery({ lang: nextLanguage.toLowerCase() });

  return (
    <article className="mx-auto flex w-full max-w-170 flex-col gap-6 pt-5 pb-16">
      {isPending && <DocumentSkeleton />}
      {isError && <ErrorState error={error} onRetry={refetch} />}

      {data && (
        <div className={cn("flex flex-col gap-6", fadeInClassName)}>
          <header className="flex flex-col gap-3">
            <h1 className="heading-3 text-font-1">
              {title ?? t(TITLE_KEY[slug])}
            </h1>

            <div className="body-5 flex flex-wrap items-center justify-between gap-2 text-font-2">
              <span>
                {t("legalPage.effectiveAt", {
                  date: formatDate(data.effectiveAt),
                })}
              </span>

              <div className="flex flex-wrap items-center gap-3">
                {data.availableLanguages.length > 1 && (
                  <label className="flex items-center gap-2">
                    <span>{t("legalPage.language")}</span>
                    <select
                      value={data.language}
                      onChange={(event) =>
                        handleSelectLanguage(event.target.value)
                      }
                      className="rounded-lg border border-main bg-card px-2 py-1 text-font-1"
                    >
                      {data.availableLanguages.map((language) => (
                        <option key={language} value={language}>
                          {LANGUAGE_NAME[language] ?? language}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {data.history.length > 1 && (
                  <label className="flex items-center gap-2">
                    <span>{t("legalPage.history")}</span>
                    <select
                      value={data.documentId}
                      onChange={(event) =>
                        handleSelectVersion(event.target.value)
                      }
                      className="rounded-lg border border-main bg-card px-2 py-1 text-font-1"
                    >
                      {data.history.map((item, index) => (
                        <option key={item.documentId} value={item.documentId}>
                          {index === 0
                            ? t("legalPage.currentOption", {
                                date: formatDate(item.effectiveAt),
                              })
                            : t("legalPage.pastOption", {
                                date: formatDate(item.effectiveAt),
                              })}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </div>

            {isTranslation && (
              <p className="body-5 rounded-xl bg-info-bg px-4 py-2 text-info">
                {t("legalPage.translationNotice")}
              </p>
            )}
            {isFallback && (
              <p className="body-5 rounded-xl bg-card-hover px-4 py-2 text-font-2">
                {t("legalPage.fallbackNotice")}
              </p>
            )}

            {isPast && (
              <p className="body-5 rounded-xl bg-warning-bg px-4 py-2 text-warning">
                {t("legalPage.pastNotice")}
              </p>
            )}
          </header>

          <section className="body-3 flex flex-col gap-3 border-t border-main pt-6 text-font-1">
            <MarkdownDocument content={body} />
          </section>
        </div>
      )}
    </article>
  );
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

const LegalPage = ({ params }: PageProps) => {
  const { slug } = use(params);
  if (!isLegalSlug(slug)) notFound();

  return (
    <Suspense>
      <LegalDocument slug={slug} />
    </Suspense>
  );
};

export default LegalPage;
