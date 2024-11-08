'use client';

import { useSearchParams } from 'next/navigation';
import RecipeList from './RecipeList';
import Pagination from './Pagination';
import SearchSection from './SearchSection';
import { Loader2 } from 'lucide-react';
import { useRecipeSearch } from '@/hooks/use-recipe-search';

export default function SearchResults({initialSearchWords}: {initialQuery: string, initialSearchWords: string[]}) {
  const itemsPerPage = 5;

  const {
    recipes,
    totalRecipes,
    isLoading,
    currentPage,
    ingredients,
    handleSearch,
    handleAddIngredient,
    handleRemoveIngredient,
    handlePageChange,
  } = useRecipeSearch({ initialSearchWords, itemsPerPage });

  // fetchRecipes();


  const LoadingSkeleton = () => (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-md p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <h1 className="text-2xl font-bold mb-4">
            {isLoading ? 'Searching...' : `Search Results`}
          </h1>
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center text-gray-500">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Fetching recipes...</span>
              </div>
              <LoadingSkeleton />
            </div>
          ) : (
            <>
              <RecipeList recipes={recipes} />
              <Pagination 
                currentPage={currentPage}
                totalItems={totalRecipes}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
        <div className="md:w-1/3">
          <SearchSection
            // searchQuery={searchQuery}
            onSearch={handleSearch}
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
          />
        </div>
      </div>
    </div>
  );
}