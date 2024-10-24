import { enhanceSearch } from "@/services/recipe.service";
import SearchResults from "./SearchResults";

export default async function SearchRecipePage({
  searchParams
}: {
  searchParams: { q: string; enhanced?: string }
}) {

  const enhancedBoolean = searchParams.enhanced === 'true';
  let searchWords: string[];

  if (enhancedBoolean) {
    const { keyList, isValid } = await enhanceSearch(searchParams.q);
    searchWords = keyList;
  } else {  
    searchWords = searchParams.q.trim()
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => escapeRegExp(word));
  }
  console.log(searchWords ,'hehe');

  return <SearchResults initialQuery={searchParams.q} initialSearchWords={searchWords} />;
}

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
