import { enhanceSearch } from "@/services/recipe.service";
import SearchResults from "./SearchResults";

interface SearchParams {
  q: string;
  enhanced?: string;
}

interface EnhanceSearchResult {
  keyList: string[];
  isValid: boolean;
}

export default async function SearchRecipePage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  try {
    // Validate search query exists
    if (!searchParams.q) {
      return <SearchResults initialQuery="" initialSearchWords={[]} />;
    }

    const enhancedBoolean = searchParams.enhanced === 'true';
    let searchWords: string[] = [];

    if (enhancedBoolean) {
      try {
        const enhancedResult = await enhanceSearch(searchParams.q);
        
        // Type guard to ensure enhancedResult matches expected structure
        if (isValidEnhanceSearchResult(enhancedResult)) {
          searchWords = enhancedResult.keyList;
        } else {
          console.error('Invalid enhanced search result structure');
          searchWords = processBasicSearch(searchParams.q);
        }
      } catch (error) {
        console.error('Enhanced search failed:', error);
        // Fallback to basic search if enhancement fails
        searchWords = processBasicSearch(searchParams.q);
      }
    } else {
      searchWords = processBasicSearch(searchParams.q);
    }

    return (
      <SearchResults 
        initialQuery={searchParams.q} 
        initialSearchWords={searchWords} 
      />
    );
  } catch (error) {
    console.error('Search page error:', error);
    // Provide a graceful fallback UI
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

// Helper function to process basic search
function processBasicSearch(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExp);
}

// Type guard for enhanced search result
function isValidEnhanceSearchResult(result: any): result is EnhanceSearchResult {
  return (
    result &&
    Array.isArray(result.keyList) &&
    typeof result.isValid === 'boolean'
  );
}

// Escape special characters in search terms
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}