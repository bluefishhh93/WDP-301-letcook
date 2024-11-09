// app/recipe/search/page.tsx
import { SearchWrapper } from './search-wrapper';

interface SearchPageProps {
  searchParams: {
    q: string;
    enhanced?: string;
  }
}

// Mark the page as statically generated
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Generate static params for common searches
export async function generateStaticParams() {
  // Common search terms that you want to pre-render
  const commonSearches = [
    { q: 'chicken', enhanced: 'true' },
    { q: 'vegetarian', enhanced: 'true' },
    { q: 'dessert', enhanced: 'true' },
    { q: 'quick meals', enhanced: 'true' },
    { q: 'breakfast', enhanced: 'true' },
  ];

  return commonSearches.map((search) => ({
    searchParams: search
  }));
}

export default function SearchRecipePage({ searchParams }: SearchPageProps) {
  return <SearchWrapper searchParams={searchParams} />;
}