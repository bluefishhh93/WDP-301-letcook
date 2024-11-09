// SearchWrapper.tsx
import { enhanceSearch } from "@/services/recipe.service";
import SearchResults from "./SearchResults";
import { cache } from 'react';

interface SearchParams {
  q: string;
  enhanced?: string;
}

interface EnhanceSearchResult {
  keyList: string[];
  isValid: boolean;
}

// Cache the search results
const getSearchResults = cache(async (query: string, enhanced: boolean) => {
  try {
    if (enhanced) {
      const enhancedResult = await enhanceSearch(query);
      if (isValidEnhanceSearchResult(enhancedResult)) {
        return enhancedResult.keyList;
      }
    }
    return processBasicSearch(query);
  } catch (error) {
    console.error('Search processing error:', error);
    return processBasicSearch(query);
  }
});

export async function SearchWrapper({ searchParams }: { searchParams: SearchParams }) {
  try {
    // Validate search query exists
    if (!searchParams.q) {
      return <SearchResults initialQuery="" initialSearchWords={[]} />;
    }

    const enhancedBoolean = searchParams.enhanced === 'true';
    const searchWords = await getSearchResults(searchParams.q, enhancedBoolean);

    return (
      <SearchResults 
        initialQuery={searchParams.q} 
        initialSearchWords={searchWords} 
      />
    );
  } catch (error) {
    console.error('Search page error:', error);
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold text-red-600">
          Sorry, something went wrong with the search
        </h2>
        <p className="mt-2">Please try again or modify your search terms.</p>
      </div>
    );
  }
}

function processBasicSearch(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExp);
}

function isValidEnhanceSearchResult(result: any): result is EnhanceSearchResult {
  return (
    result &&
    Array.isArray(result.keyList) &&
    typeof result.isValid === 'boolean'
  );
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}