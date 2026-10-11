import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDocsHome } from "@/api/docs/server";
import { DocsPageLocales } from "@/components/docs/DocsProvider";
import DocsSearchBox from "@/components/docs/DocsSearchBox";
import DocsThumbnail from "@/components/docs/DocsThumbnail";
import { allLocaleAlternates, buildDocsMetadata, readDocsLocale } from "@/components/docs/docsMetadata";
import { docsPath } from "@/components/docs/docsPath";
import { LogoWordmark } from "@/icons";
import { formatDocsCount, getDocsMessages } from "@/i18n/locales/docs";

interface DocsHomeProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DocsHomeProps): Promise<Metadata> {
  const locale = readDocsLocale((await params).locale);
  if (!locale) return {};
  return buildDocsMetadata({
    locale,
    path: docsPath.home(locale),
    alternates: allLocaleAlternates(docsPath.home),
  });
}

/** 문서 홈: 어두운 배너(로고·검색) + 최상위 카테고리 목록. */
export default async function DocsHomePage({ params }: DocsHomeProps) {
  const locale = readDocsLocale((await params).locale);
  if (!locale) notFound();

  const [{ groups }, messages] = [await getDocsHome(locale), getDocsMessages(locale)];

  return (
    <>
      <DocsPageLocales locales={null} />

      {/* 배너는 테마와 무관하게 어둡다. dark 클래스로 안쪽 토큰(로고 글자색·검색창)을 다크 값으로 맞춘다. */}
      <section className="dark relative overflow-hidden bg-scrim text-font-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,var(--brand-opacity-2),transparent_55%),radial-gradient(ellipse_at_85%_100%,var(--brand-opacity),transparent_60%)]"
        />
        <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-8 px-4 py-16 sm:py-20">
          <h1 className="flex items-center gap-3">
            <LogoWordmark className="h-10 w-auto sm:h-12" aria-label="PLAT" />
            <span className="heading-2 sm:text-[2rem] text-font-0">{messages.serviceLabel}</span>
          </h1>
          <DocsSearchBox size="lg" className="max-w-[600px]" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[960px] px-4 pt-12 pb-24 sm:px-6">
        <h2 className="heading-2 mb-6 text-font-0">{messages.allCategories}</h2>
        {groups.length === 0 ? (
          <p className="body-4 py-10 text-center text-font-2">{messages.emptyHome}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {groups.map((group, index) => (
              <li key={group.id}>
                <Link
                  href={docsPath.category(locale, group.slug, group.id)}
                  className="group -mx-3 flex items-center gap-6 rounded-2xl p-3 transition-colors hover:bg-btn-hover"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <h3 className="title-2 text-font-0 group-hover:text-brand-dark">{group.name}</h3>
                    {group.description && (
                      <p className="body-5 line-clamp-2 text-font-2">{group.description}</p>
                    )}
                    <p className="body-7 text-font-disabled">
                      {formatDocsCount(locale, messages.articleCount, group.pageCount)}
                    </p>
                  </div>
                  <DocsThumbnail
                    src={group.coverImageUrl}
                    alt=""
                    eager={index < 3}
                    className="aspect-[16/9] w-28 shrink-0 sm:w-[200px]"
                    iconSize={44}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
