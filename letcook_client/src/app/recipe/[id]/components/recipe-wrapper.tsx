import { Suspense } from 'react';
import { Recipe } from "CustomTypes";
import HeroSection from "./HeroSection";
import QuickFacts from "./QuickFacts";
import Instructions from "./Instructions";
import Sidebar from "./Sidebar";
import * as RecipeService from "@/services/recipe.service";
import RecipeComment from "./Comment";
import Cart from "@/components/cart/Cart";

interface RecipeWrapperProps {
  recipe: Recipe;
}

interface Analysis {
  // Add your analysis type definition here
  // Example:
  nutritionalInfo?: {
    calories: number;
    protein: number;
    // ... other fields
  };
}

interface AnalysisSectionProps {
  recipe: Recipe;
}

async function AnalysisSection({ recipe }: AnalysisSectionProps) {
  try {
    const analysis = await RecipeService.getRecipeAnalysis(recipe);
    return <Sidebar recipe={recipe} analysis={analysis} />;
  } catch (error) {
    console.error('Error loading analysis:', error);
    return <div>Failed to load analysis</div>;
  }
}

const AnalysisLoading = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
  </div>
);

const CommentsLoading = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-20 bg-gray-200 rounded dark:bg-gray-700"></div>
    <div className="h-20 bg-gray-200 rounded dark:bg-gray-700"></div>
  </div>
);

export function RecipeWrapper({ recipe }: RecipeWrapperProps) {
  return (
    <div className="bg-[#f8f6f2] text-foreground container mx-auto px-4 sm:px-20 py-12 dark:bg-[#1f1f1f]">
      <HeroSection recipe={recipe} />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <QuickFacts recipe={recipe} />
          <Instructions steps={recipe.steps} />
        </div>

        <div className="lg:w-1/3">
          <Suspense fallback={<AnalysisLoading />}>
            <AnalysisSection recipe={recipe} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<CommentsLoading />}>
        <RecipeComment
          comments={(recipe as any).commentWithUser}
          recipeId={recipe._id}
        />
      </Suspense>
      
      <Cart />
    </div>
  );
}