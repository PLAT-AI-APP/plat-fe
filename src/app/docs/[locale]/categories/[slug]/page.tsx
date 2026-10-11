import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getDocsGroup } from "@/api/docs/server";
import DocsFrame from "@/components/docs/DocsFrame";
import { DocsPageLocales } from "@/components/docs/DocsProvider";
import DocsThumbnail from "@/components/docs/DocsThumbnail";
import { buildDocsMetadata, readDocsLocale } from "@/components/docs/docsMetadata";
import { docsPath, parseSlugId } from "@/components/docs/docsPath";
import { formatDocsMessage, getDocsMessages } from "@/i18n/locales/docs";

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const loadCategory = async (params: CategoryPageProps["params"]) => {
  const { locale: rawLocale, slug } = await params;
  const locale = readDocsLocale(rawLocale);
  const parsed = parseSlugId(slug);
  if (!locale || !parsed) return null;
  const group = await getDocsGroup(locale, parsed.id);
  return group ? { locale, parsed, group } : null;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const loaded = await loadCategory(params);
  if (!loaded) return {};
  const { locale, group } = loaded;
  return buildDocsMetadata({
    locale,
    title: group.name,
    description: group.description,
    path: docsPath.category(locale, group.slug, group.id),
    alternates: Object.fromEntries(
      group.availableLocales.map((each) => [each, docsPath.category(each, group.slug, group.id)]),
    ),
  });
}

/** 카테고리(그룹) 화면: 커버, 제목·설명, 하위 그룹 카드와 아티클 목록. */
export default async function DocsCategoryPage({ params }: CategoryPageProps) {
  const loaded = await loadCategory(params);
  if (!loaded) notFound();
  const { locale, parsed, group } = loaded;

  // slug 가 바뀌었거나 빠진 옛 주소는 정규 주소로 보낸다(같은 문서가 여러 주소로 색인되지 않게).
  if (parsed.slug !== group.slug) {
    permanentRedirect(docsPath.category(locale, group.slug, group.id));
  }

  const messages = getDocsMessages(locale);
  const subgroups = group.children.filter((child) => child.type === "GROUP");
  const pages = group.children.filter((child) => child.type === "PAGE");

  return (
    <DocsFrame messages={messages}>
      <DocsPageLocales locales={group.availableLocales} />
      <article className="mx-auto w-full max-w-[800px] px-4 pt-6 pb-24 sm:px-8 lg:pt-10">
        <DocsThumbnail
          src={group.coverImageUrl}
          alt=""
          eager
          iconSize={96}
          className="aspect-[16/7] w-full rounded-2xl"
        />

        <header className="mt-8 flex flex-col gap-3 border-b border-main pb-8">
          <p className="title-6 text-brand-dark">{messages.categoryLabel}</p>
          <h1 className="text-[2rem] leading-tight font-bold text-font-0 sm:text-[2.5rem]">
            {group.name}
          </h1>
          {group.description && <p className="body-3 text-font-2">{group.description}</p>}
        </header>

        {group.children.length === 0 && (
          <p className="body-4 py-12 text-center text-font-2">{messages.emptyCategory}</p>
        )}

        {subgroups.length > 0 && (
          <ul className="mt-6 flex flex-col gap-2">
            {subgroups.map((child) => (
              <li key={`group-${child.id}`}>
                <Link
                  href={docsPath.category(locale, child.slug, child.id)}
                  className="group -mx-3 flex items-center gap-6 rounded-2xl p-3 transition-colors hover:bg-btn-hover"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <h2 className="title-2 text-font-0 group-hover:text-brand-dark">{child.name}</h2>
                    {child.description && (
                      <p className="body-5 line-clamp-2 text-font-2">{child.description}</p>
                    )}
                    <p className="body-7 text-font-disabled">
                      {formatDocsMessage(messages.articleCount, { count: child.pageCount })}
                    </p>
                  </div>
                  <DocsThumbnail
                    src={child.coverImageUrl}
                    alt=""
                    className="aspect-[16/9] w-28 shrink-0 sm:w-[200px]"
                    iconSize={44}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {pages.length > 0 && (
          <ul className="mt-6 flex flex-col gap-1">
            {pages.map((child) => (
              <li key={`page-${child.id}`}>
                <Link
                  href={docsPath.article(locale, child.slug, child.id)}
                  className="group -mx-3 flex flex-col gap-1 rounded-xl px-3 py-4 transition-colors hover:bg-btn-hover"
                >
                  <h2 className="title-2 text-font-0 group-hover:text-brand-dark">{child.title}</h2>
                  {child.summary && (
                    <p className="body-5 line-clamp-1 text-font-2">{child.summary}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>
    </DocsFrame>
  );
}
