"use client";
import React, { useState } from "react";
import { Recipe } from "CustomTypes";
import { Button } from "@/components/ui/button";
import { CheckIcon, ShareIcon, PlusIcon, ExternalLink } from "lucide-react";
import Reactions from "./Reactions";
import { useAddToCart } from "@/hooks/useAddToCart";
import { getProductById } from "@/services/product.service";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import FavoriteButton from "@/components/ui.custom/user/FavouriteButton";
import ReportDialog from "./ReportDialog";
import NutritionAnalysis from "./nutrition-analysis";
import NutritionTable from "./NutritionTable";
import TasteAnalysis from "./taste-analysis";

interface SidebarProps {
  recipe: Recipe;
  analysis: any;
}

interface Nutrient {
  name: string;
  quantity: string;
}

const toastConfig = {
  autoClose: 1000,
};

const Sidebar: React.FC<SidebarProps> = ({ recipe, analysis }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { handleAddToCart } = useAddToCart();
  const { user } = useAuth();

  const handleAddToCartClick = async (productId: number) => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const product = await getProductById(productId);

      if (product) {
        await handleAddToCart(1, product);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="lg:w-1/3">
      <div className="sticky top-4 space-y-8">
        <Reactions recipeId={recipe._id} />

        <ReportDialog recipe={recipe} />
        <div className="space-y-4">
          {user && (
            <FavoriteButton
              recipeId={recipe._id}
              userId={user.id}
              className="w-full"
              iconClassName="w-5 h-5 mr-2"
              showLabel
              saveLabel="Save Recipe"
              savedLabel="Saved"
              onToggle={(isFavorited) =>
                console.log(
                  `Recipe ${isFavorited ? "saved to" : "removed from"
                  } favorites`
                )
              }
            />
          )}
          <Button variant="outline" className="w-full">
            <ShareIcon className="w-5 h-5 mr-2" />
            Share Recipe
          </Button>
        </div>
        <div className="bg-white rounded-lg p-6 dark:bg-slate-800">
          <h3 className="text-2xl font-bold mb-4">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient) => (
              <li
                key={ingredient._id}
                className="flex items-center justify-between gap-2 group"
              >
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-primary" />
                  <span>
                    {ingredient.name} - {ingredient.quantity}
                  </span>
                </div>
                {ingredient.productId && (
                  <div className="flex items-center gap-2 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleAddToCartClick(ingredient.productId!)
                      }
                      disabled={isAddingToCart}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                    <Link href={`/product/${ingredient.productId}`} passHref>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* <NutritionAnalysis data={
          {
            sugar: 25,
            fat: 45,
            protein: 60,
          }
        } /> */}
        {analysis && (
          <>
            <NutritionTable
              calories={analysis.nutrition.calories}
              protein={analysis.nutrition.protein}
              fat={analysis.nutrition.fat}
              carbs={analysis.nutrition.carbs}
            />
            <TasteAnalysis data={[
              { subject: "Sweet", value: analysis.taste.sweet, fullMark: 100 },
              { subject: "Sour", value: analysis.taste.sour, fullMark: 100 },
              { subject: "Salty", value: analysis.taste.salty, fullMark: 100 },
              { subject: "Bitter", value: analysis.taste.bitter, fullMark: 100 },
              { subject: "Savory", value: analysis.taste.savory, fullMark: 100 },
              { subject: "Fatty", value: analysis.taste.fatty, fullMark: 100 }
            ]} />
          </>
        )}
      </div>
      <ToastContainer {...toastConfig} />
    </div>
  );
};

export default Sidebar;
