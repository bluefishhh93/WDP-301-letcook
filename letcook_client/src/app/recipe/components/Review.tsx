// Review.tsx
import React, { useEffect } from "react";
import Image from "next/image";

interface Ingredient {
  name: string;
  quantity: string;
}

interface Step {
  description: string;
  images: File[];
}

interface ReviewProps {
  title: string;
  description: string;
  image: string | null;
  video: string | null;
  ingredients: Ingredient[];
  steps: Step[];
  cookTime: number;
  servings: number;
  difficulty: string;
}

const Review: React.FC<ReviewProps> = ({
  title,
  description,
  image,
  video,
  ingredients,
  steps,
  cookTime,
  servings,
  difficulty,
}) => {
  useEffect(() => {
    return () => {
      steps.forEach((step) => {
        step.images.forEach((image) => {
          URL.revokeObjectURL(URL.createObjectURL(image));
        });
      });
    };
  }, [steps]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-800">Review Your Recipe</h2>
      <p className="text-amber-700">Please review your recipe details before submitting.</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-amber-800 mb-4">{title}</h3>
        
        <div className="mb-4">
          {/* Media Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video Section */}
            {video && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                <video 
                  src={video} 
                  controls
                  className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                />
              </div>
            )}
            
            {/* Image Section - Only show if there's no video or if both should be displayed */}
            {image && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src={image} 
                  alt={title} 
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{description}</p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <strong>Cook Time:</strong> {cookTime} minutes
          </div>
          <div>
            <strong>Servings:</strong> {servings}
          </div>
          <div>
            <strong>Difficulty:</strong> {difficulty}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-amber-700 mb-2">Ingredients:</h4>
          <ul className="list-disc list-inside">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">
                {ingredient.quantity} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-amber-700 mb-2">Steps:</h4>
          <ol className="list-decimal list-outside ml-5">
            {steps.map((step, index) => (
              <li key={index} className="text-gray-700 mb-4">
                <p className="mb-2">{step.description}</p>
                {step.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {step.images.map((image, imgIndex) => (
                      <Image
                        key={imgIndex}
                        src={URL.createObjectURL(image)}
                        alt={`Step ${index + 1} - Image ${imgIndex + 1}`}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Review;