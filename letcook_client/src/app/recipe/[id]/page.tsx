import { notFound } from 'next/navigation';
import { Recipe } from "CustomTypes";
import * as RecipeService from "@/services/recipe.service";
import { RecipeWrapper } from './components/recipe-wrapper';
import { Metadata } from 'next';

interface RecipePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
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
        images: [{ url: recipe.image, width: 1200, height: 630, alt: recipe.title }],
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
    // Define this as a regular function instead of an arrow function
    const popularRecipeIds = [
      '101033468453537182850',
      '101033468453537182850',
      '101033468453537182850'
    ];

    return popularRecipeIds.map((id) => ({
      id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  if (!params.id) {
    notFound();
  }

  try {
    const recipe = await RecipeService.getRecipeById(params.id);

    if (!recipe) {
      notFound();
    }

    return <RecipeWrapper recipe={recipe} />;
  } catch (error) {
    console.error('Error loading recipe:', error);
    notFound();
  }
}

// Choose either dynamic or revalidate, not both
export const dynamic = 'force-dynamic';