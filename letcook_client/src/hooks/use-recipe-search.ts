"use client";
import { useState, useEffect } from 'react';
import { searchRecipes } from '@/services/recipe.service';
import { Recipe } from 'CustomTypes';

interface UseRecipeSearchProps {
  initialSearchWords: string[];
  itemsPerPage: number;
}

interface UseRecipeSearchResult {
  recipes: Recipe[];
  totalRecipes: number;
  isLoading: boolean;
  currentPage: number;
  searchWords: string[];
  ingredients: string[];
  handleSearch: () => void;
  handleAddIngredient: (ingredient: string) => void;
  handleRemoveIngredient: (ingredient: string) => void;
  handlePageChange: (page: number) => void;
  setIngredients: (ingredients: string[]) => void;
}

export function useRecipeSearch({ initialSearchWords, itemsPerPage }: UseRecipeSearchProps): UseRecipeSearchResult {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchWords, setSearchWords] = useState<string[]>(initialSearchWords);
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    fetchRecipes();
  }, [searchWords, ingredients, currentPage]);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const data = await searchRecipes(searchWords, ingredients, (currentPage - 1) * itemsPerPage, itemsPerPage);
      if (data) {
        setRecipes(data.recipes);
        setTotalRecipes(data.total);
      } else {
        console.error('Search request failed');
      }
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // if (query === searchQuery) return;
    // if (query.trim() === '') return;
    
    // setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleAddIngredient = (ingredient: string) => {
    setIngredients([...ingredients, ingredient]);
    setCurrentPage(1);
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    recipes,
    totalRecipes,
    isLoading,
    currentPage,
    searchWords,
    ingredients,
    handleSearch,
    handleAddIngredient,
    handleRemoveIngredient,
    handlePageChange,
    setIngredients
  };
}