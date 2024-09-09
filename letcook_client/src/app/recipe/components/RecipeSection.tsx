"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { BookmarkIcon, CookingPot, Heart, ThumbsUp, SearchIcon, Clock, Users, ChefHat } from "lucide-react";
import { Recipe, User } from "CustomTypes";
import { useState, useEffect, useCallback } from "react";
import { getPublicRecipes } from "@/services/recipe.service";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import axios from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import FavoriteButton from "@/components/ui.custom/user/FavouriteButton";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function RecipeSection() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteStatuses, setFavoriteStatuses] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 4;

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPublicRecipes((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
      const { recipes: newRecipes, total } = response;

      if (newRecipes.length === 0) {
        setHasMore(false);
      } else {
        setRecipes(prevRecipes => {
          // If it's the first page, replace the entire array
          if (page === 1) {
            return newRecipes;
          }
          // Otherwise, append new recipes
          return [...prevRecipes, ...newRecipes];
        });
        setHasMore((page + 1) * ITEMS_PER_PAGE < total);
        if (user) {
          const recipeIds = newRecipes.map((recipe: Recipe) => recipe._id);
          await fetchFavoriteStatuses(recipeIds, user.id);
        }

      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const fetchFavoriteStatuses = async (recipeIds: string[], userId: string) => {
    try {
      const response = await axios.post('/api/favorite/check-multiple', { userId, recipeIds });
      setFavoriteStatuses(prevStatuses => ({ ...prevStatuses, ...response.data }));
    } catch (error) {
      console.error('Error fetching favorite statuses:', error);
    }
  };


  const renderRecipeCard = (recipe: Recipe, index: number, user?: User, isFavourited?: boolean) => (
    <Card key={`${recipe._id}-${index}`} className="overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-10 h-10 border-2 border-primary">
              <AvatarImage src={recipe.user?.avatar || "/image-not-found.png"} alt="User avatar" />
              <AvatarFallback>{recipe.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{recipe.user?.name}</span>
          </div>
        </div>
        <Link href={`/recipe/${recipe._id}`} key={`link-${recipe._id}-${index}`}>
          <div className="relative">
            <img
              src={recipe.images[0] || "/image-not-found.png"}
              alt={recipe.title}
              width={300}
              height={200}
              className="w-full aspect-[3/2] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4">
              <h3 className="font-semibold text-lg text-white drop-shadow-md">{recipe.title}</h3>
            </div>
            {user && (
              <div className="absolute top-2 right-2">
                <FavoriteButton
                  recipeId={recipe._id}
                  userId={user.id}
                  initialStatus={isFavourited}
                />
              </div>
            )}
          </div>
        </Link>
        <div className="p-4">
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center bg-slate-200 dark:bg-gray-700 rounded-full px-3 py-1">
              <Clock className="w-4 h-4 mr-1" />
              <span>{recipe.cook_time || 'N/A'} min</span>
            </div>
            <div className="flex items-center bg-slate-200 dark:bg-gray-700 rounded-full px-3 py-1">
              <Users className="w-4 h-4 mr-1" />
              <span>{recipe.serving || 'N/A'} servings</span>
            </div>
            <div className="flex items-center bg-slate-200 dark:bg-gray-700 rounded-full px-3 py-1">
              <ChefHat className="w-4 h-4 mr-1" />
              <span>{recipe.difficulty || 'N/A'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSkeletonCard = () => (
    <Card className="overflow-hidden bg-white dark:bg-gray-800">
      <CardContent className="p-0">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="w-full aspect-[3/2]" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="px-4 md:px-6 py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Latest Recipes
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe, index) => renderRecipeCard(recipe, index))}
          {isLoading && Array(ITEMS_PER_PAGE).fill(0).map((_, index) => (
            <div key={`skeleton-${index}`}>{renderSkeletonCard()}</div>
          ))}
        </div>
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => {
                setPage(prevPage => prevPage + 1);
              }}
              disabled={isLoading}
              className="flex items-center gap-2 border-gray-800 dark:border-gray-100"
            >
              {isLoading ? 'Loading...' : 'View More'}
              {!isLoading && <SearchIcon className="h-4 w-4" />}
            </Button>
          </div>
        )}
        {!hasMore && (
          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <b>Yay! You have seen all recipes</b>
          </p>
        )}
      </div>
    </section>
  );
}
