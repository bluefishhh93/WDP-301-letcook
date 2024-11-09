// app/recipe/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Recipe } from "CustomTypes";
import * as RecipeService from "@/services/recipe.service";
import { RecipeWrapper } from './components/recipe-wrapper';

interface RecipePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: RecipePageProps) {
  try {
    const recipe = await RecipeService.getRecipeById(params.id);
    
    if (!recipe) {
      return {
        title: 'Recipe Not Found',
        description: 'The requested recipe could not be found.'
      };
    }

    return {
      title: recipe.title,
      description: recipe.description,
      openGraph: {
        title: recipe.title,
        description: recipe.description,
        images: [{ url: recipe.image, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: recipe.title,
        description: recipe.description,
        images: [recipe.image],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Recipe',
      description: 'Discover amazing recipes',
    };
  }
}

export async function generateStaticParams() {
  try {
    const popularRecipeIds = () => {
      return ['101033468453537182850', '101033468453537182850', '101033468453537182850'];
    };


    return popularRecipeIds().map((id: string) => ({
      id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await RecipeService.getRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

  return <RecipeWrapper recipe={recipe} />;
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour