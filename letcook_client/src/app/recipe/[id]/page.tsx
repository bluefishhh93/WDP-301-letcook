
// page.tsx
"use client";
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Recipe } from "CustomTypes";
import HeroSection from "./components/HeroSection";
import QuickFacts from "./components/QuickFacts";
import Instructions from "./components/Instructions";
import Sidebar from "./components/Sidebar";
import * as RecipeService from "@/services/recipe.service";
import RecipeComment from "@/app/recipe/[id]/components/Comment";
import Cart from "@/components/cart/Cart";
import ErrorAccessDenied from "@/components/error/ErrorAccessDenied";

type RecipePageProps = {
  params: { id: string };
};
// Add metadata generation for better SEO
export async function generateMetadata({ params }: RecipePageProps) {
  const recipe = await RecipeService.getRecipeById(params.id);
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  return {
    title: recipe.title,
    description: recipe.description,
  };
}

// Add static page generation for common recipes
export async function generateStaticParams() {
  // Get your most popular recipe IDs
  const popularRecipeIds = ['id1', 'id2', 'id3'];
  
  return popularRecipeIds.map((id) => ({
    id,
  }));
}

const RecipePage: React.FC<RecipePageProps> = async ({ params }) => {
  const recipe = await RecipeService.getRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

  // Wrap the analysis fetch in a Suspense boundary for streaming
  const AnalysisSection = async ({ recipe }: { recipe: Recipe }) => {
    const analysis = await RecipeService.getRecipeAnalysis(recipe);
    return <Sidebar recipe={recipe} analysis={analysis} />;
  };

  return (
    <div className="bg-[#f8f6f2] text-foreground container mx-auto px-4 sm:px-20 py-12 dark:bg-[#1f1f1f]">
      <HeroSection recipe={recipe} />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <QuickFacts recipe={recipe} />
          <Instructions steps={recipe.steps} />
        </div>

        <Suspense fallback={<div>Loading analysis...</div>}>
          <AnalysisSection recipe={recipe} />
        </Suspense>
      </div>

      <Suspense fallback={<div>Loading comments...</div>}>
        <RecipeComment
          comments={(recipe as any).commentWithUser}
          recipeId={recipe._id}
        />
      </Suspense>
      
      <Cart />
    </div>
  );
};

// Add route segment config
export const revalidate = 3600; // Revalidate every hour

export default RecipePage;