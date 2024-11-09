import { cache, Suspense } from 'react';
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

const getAnalysis = cache(async (recipe: Recipe) => {
  try {
    return await RecipeService.getRecipeAnalysis(recipe);
  } catch (error) {
    console.error('Error loading analysis:', error);
    return null;
  }
});

async function AnalysisSection({ recipe }: { recipe: Recipe }) {
  const analysis = await getAnalysis(recipe);
  
  if (!analysis) {
    return <div>Failed to load analysis</div>;
  }

  return <Sidebar recipe={recipe} analysis={analysis} />;
}

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

function AnalysisLoading() {
  return <div>Loading analysis...</div>;
}

function CommentsLoading() {
  return <div>Loading comments...</div>;
}
