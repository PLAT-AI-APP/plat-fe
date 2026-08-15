import type { Metadata } from "next";
import SearchResultsContents from "./_components/SearchResultsContents";

export const metadata: Metadata = {
  title: "검색 결과",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { q } = await searchParams;

  return <SearchResultsContents initialQuery={q ?? ""} />;
};

export default SearchPage;
