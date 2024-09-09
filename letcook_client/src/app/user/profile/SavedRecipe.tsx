import React from 'react';
import { Recipe } from 'CustomTypes';
import RecipeCard from './RecipeCard';

interface SavedRecipesProps {
  recipes: Recipe[];
  onEdit: (recipeId: string) => void;
  onDelete: (recipeId: string) => void;
}

const SavedRecipes: React.FC<SavedRecipesProps> = ({ recipes, onEdit, onDelete }) => {
  return (
    <div className="py-6 md:py-8 h-[550px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe._id} 
            recipe={recipe} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};

export default SavedRecipes;