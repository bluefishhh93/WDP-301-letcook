// app/recipe/search/page.tsx
import { SearchWrapper } from './search-wrapper';

interface SearchPageProps {
  searchParams: {
    q: string;
    enhanced?: string;
  }
}

export default function SearchRecipePage({ searchParams }: SearchPageProps) {
  return <SearchWrapper searchParams={searchParams} />;
}