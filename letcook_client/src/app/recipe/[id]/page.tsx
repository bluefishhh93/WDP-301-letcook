import { notFound } from 'next/navigation';
import { Recipe } from "CustomTypes";
import * as RecipeService from "@/services/recipe.service";
import { RecipeWrapper } from './components/recipe-wrapper';
import { Metadata } from 'next';
import { cache } from 'react';

interface RecipePageProps {
  params: { id: string };
}

// Cache the recipe fetch
const getRecipe = cache(async (id: string) => {
  try {
    const recipe = await RecipeService.getRecipeById(id);
    if (!recipe) return null;
    return recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
});

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipe(params.id);
  
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
      images: [{ url: recipe.image, width: 1200, height: 630, alt: recipe.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description: recipe.description,
      images: [recipe.image],
    },
  };
}

// Pre-render common recipe pages
export async function generateStaticParams() {
  const popularRecipeIds = [
    '101033468453537182850',
    // Add more popular recipe IDs
  ];

  return popularRecipeIds.map((id) => ({
    id: id.toString(),
  }));
}

export default async function RecipePage({ params }: RecipePageProps) {
  if (!params.id) {
    notFound();
  }

  const recipe = await getRecipe(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <RecipeWrapper recipe={recipe} />
    </div>
  );
}

// Use revalidate instead of dynamic
export const revalidate = 3600; // Revalidate every hour