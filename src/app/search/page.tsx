import type { Metadata } from "next";
import SearchLanding from "./_components/SearchLanding";
import SearchResultsContents from "./_components/SearchResultsContents";

export const metadata: Metadata = {
  title: "검색",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { q } = await searchParams;

  if (!q) {
    return <SearchLanding />;
  }

  return <SearchResultsContents initialQuery={q} />;
};

export default SearchPage;
