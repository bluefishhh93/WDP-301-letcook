import { Recipe } from "CustomTypes";
import HeroSection from "./components/HeroSection";
import QuickFacts from "./components/QuickFacts";
import Instructions from "./components/Instructions";
import Sidebar from "./components/Sidebar";
import * as RecipeService from "@/services/recipe.service";
import RecipeComment from "@/app/recipe/[id]/components/Comment";
import Cart from "@/components/cart/Cart";
import ErrorAccessDenied from "@/components/error/ErrorAccessDenied";

interface RecipePageProps {
  params: {
    id: string;
  };
}

export interface RecipeAnalysis {
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  taste: {
    sweet: number;
    sour: number;
    salty: number;
    bitter: number;
    savory: number;
    fatty: number;
  };
}
const RecipePage: React.FC<RecipePageProps> = async ({ params }) => {
  const recipe = await RecipeService.getRecipeById(params.id);

  if (!recipe) {
    return <ErrorAccessDenied message="Recipe not found" />;
  }

  const analysis: RecipeAnalysis = await RecipeService.getRecipeAnalysis(recipe);


  return (
    <div className="bg-[#f8f6f2] text-foreground container mx-auto px-4 sm:px-20 py-12 dark:bg-[#1f1f1f]">
        <HeroSection recipe={recipe} />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <QuickFacts recipe={recipe} />
            <Instructions steps={recipe.steps} />
            {/* <CooksNotes /> */}
          </div>

          <Sidebar recipe={recipe} analysis={analysis} />
        </div>

        {/* <RelatedRecipes /> */}

        <RecipeComment
          comments={(recipe as any).commentWithUser}
          recipeId={recipe._id}
        />
      <Cart />
    </div>
  );
};

export default RecipePage;
