import { notFound } from 'next/navigation';
import { Recipe } from "CustomTypes";
import * as RecipeService from "@/services/recipe.service";
import { RecipeWrapper } from './components/recipe-wrapper';
import { Metadata } from 'next';
import { cache, Suspense } from 'react';
import Loading from '@/components/Loading';

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

// Helper to optimize Cloudinary image URL for social sharing
function getOptimizedImageUrl(cloudinaryUrl: string): string {
  if (!cloudinaryUrl) return '';
  
  // Check if it's a Cloudinary URL
  if (!cloudinaryUrl.includes('cloudinary.com')) {
    return cloudinaryUrl;
  }

  try {
    // Parse the URL
    const url = new URL(cloudinaryUrl);
    const urlParts = url.pathname.split('/');

    // Find the upload part index
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) return cloudinaryUrl;

    // Insert transformation parameters after 'upload'
    // f_auto: automatic format selection
    // q_auto: automatic quality
    // w_1200,h_630,c_fill: resize to optimal social sharing dimensions
    // g_auto: automatic gravity/cropping
    urlParts.splice(uploadIndex + 1, 0, 'f_auto,q_auto,w_1200,h_630,c_fill,g_auto');

    // Reconstruct the URL
    url.pathname = urlParts.join('/');
    return url.toString();
  } catch (error) {
    console.error('Error optimizing Cloudinary URL:', error);
    return cloudinaryUrl;
  }
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipe(params.id);
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.'
    };
  }

  const optimizedImageUrl = getOptimizedImageUrl(recipe.images[0]);

  return {
    title: recipe.title,
    description: recipe.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'),
    openGraph: {
      type: 'article',
      title: recipe.title,
      description: recipe.description,
      images: [{
        url: optimizedImageUrl,
        width: 1200,
        height: 630,
        alt: recipe.title,
      }],
      siteName: 'Your Recipe Site',
      locale: 'en_US',
      url: `/recipes/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description: recipe.description,
      images: [optimizedImageUrl],
    },
    alternates: {
      canonical: `/recipes/${params.id}`,
    },
  };
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
      <Suspense fallback={<Loading />}>
        <RecipeWrapper recipe={recipe} />
      </Suspense>
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour