import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recipe } from 'CustomTypes';
import { Clock, Users, ChefHat, Edit2, Trash2 } from 'lucide-react';
import RecipeCard from './RecipeCard';

interface MyRecipesProps {
  recipes: Recipe[];
  onEdit: (recipeId: string, updatedRecipe: Partial<Recipe>) => void;
  onDelete: (recipeId: string) => void;
}

const MyRecipes: React.FC<MyRecipesProps> = ({ recipes, onEdit, onDelete }) => {
  const handleEditRecipe = (recipe: Recipe) => {
    const updatedTitle = prompt("Edit recipe name:", recipe.title);
    const updatedDescription = prompt("Edit recipe description:", recipe.description);

    if (updatedTitle !== null && updatedDescription !== null) {
      onEdit(recipe._id, { ...recipe, title: updatedTitle, description: updatedDescription });
    }
  };

  return (
    <div className="py-6 md:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default MyRecipes;