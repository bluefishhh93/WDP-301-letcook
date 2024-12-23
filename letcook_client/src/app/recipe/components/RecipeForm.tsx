"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import GeneralInfo from "./GeneralInfo";
import Review from "./Review";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Ingredient from "./Ingredient";
import Step from "./Step";
import { IngredientForm, Recipe, StepForm } from "CustomTypes";
import * as RecipeService from "@/services/recipe.service";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import SuccessModal from "./SuccessModal";
import { uploadToCloudinary } from "@/lib/cloudinary";


const uploadFile = async (file: File) => {
  // Check file size before uploading
  if (file.size > 100 * 1024 * 1024) { // 100MB
    throw new Error('File size exceeds 100MB limit');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/cloudinary', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};


const EnhancedRecipeForm: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cookTime, setCookTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("");
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<IngredientForm[]>([
    { name: "", quantity: "" },
  ]);
  const [steps, setSteps] = useState<StepForm[]>([
    { description: "", images: [] },
  ]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [submittedRecipe, setSubmittedRecipe] = useState<Recipe | null>(null);
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!cookTime) newErrors.cookTime = "Cook time is required";
    if (!servings) newErrors.servings = "Number of servings is required";
    if (!difficulty) newErrors.difficulty = "Difficulty level is required";
    if (!image) newErrors.image = "Recipe image is required";

    if (ingredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    } else {
      ingredients.forEach((ing, index) => {
        if (!ing.name.trim() || !ing.quantity.trim()) {
          newErrors[`ingredient${index}`] =
            "Ingredient name and quantity are required";
        }
      });
    }

    if (steps.length === 0) {
      newErrors.steps = "At least one step is required";
    } else {
      steps.forEach((step, index) => {
        if (!step.description.trim()) {
          newErrors[`step${index}`] = "Step description is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setCurrentStep(1);
    setTitle("");
    setDescription("");
    setCookTime(0);
    setServings(0);
    setDifficulty("");
    setVideo(null);
    setImage(null);
    setImagePreview(null);
    setVideoPreview(null);
    setIngredients([{ name: "", quantity: "" }]);
    setSteps([{ description: "", images: [] }]);
    setErrors({});
  };

  const sendDataToBackend = async () => {
    if (!user || !user.id) return;
    if (!validateForm()) {
      setCurrentStep(1);
      return;
    }
  
    try {
      setIsSaving(true);
      
      // Upload main image
      let mainImageUrl;
      if (image) {
        mainImageUrl = await uploadFile(image);
      }
  
      // Upload video
      let videoUrl;
      if (video) {
        videoUrl = await uploadFile(video);
      }
  
      // Upload step images
      const updatedSteps = await Promise.all(
        steps.map(async (step) => {
          const uploadedImages = await Promise.all(
            step.images.map(img => uploadFile(img))
          );
          return {
            ...step,
            images: uploadedImages
          };
        })
      );
  
      // Rest of your code remains the same...
      const recipeData = {
        title,
        description,
        cookTime,
        servings,
        difficulty,
        image: mainImageUrl,
        video: videoUrl,
        ingredients: ingredients.map(ing => ({
          name: ing.name,
          quantity: ing.quantity
        })),
        steps: updatedSteps
      };

      console.log(recipeData);
  
      const response = await RecipeService.createRecipe(recipeData, user.accessToken);
  
      if (response.status === 200) {
        setSubmittedRecipe(response.data as Recipe);
        setIsSuccessModalOpen(true);
      } else {
        console.error("Failed to submit recipe");
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
    }

    return () => {
      if (image) {
        URL.revokeObjectURL(imagePreview as string);
      }
    };
  }, [image]);

  useEffect(() => {
    if (video) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(video);
    }else {
      setVideoPreview(null);
    }

    return () => {
      if (video) {
        URL.revokeObjectURL(videoPreview as string);
      }
    };
  }, [video]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const updateIngredient = (
    index: number,
    name: keyof IngredientForm,
    value: string
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index][name] = value;
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, { description: "", images: [] }]);
  };

  const removeStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
    //cleanup
    if (newSteps[index].images) {
      newSteps[index].images.forEach((image) =>
        URL.revokeObjectURL(URL.createObjectURL(image))
      );
    }
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const updateStep = (index: number, field: keyof StepForm, value: any) => {
    const newSteps = [...steps];
    if (field === "images") {
      //cleanup
      newSteps[index].images.forEach((image) =>
        URL.revokeObjectURL(URL.createObjectURL(image))
      );
    }
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  // //clean up
  // useEffect(() => {
  //   return () => {
  //     steps.forEach(step => {
  //       step.images.forEach(image => URL.revokeObjectURL(URL.createObjectURL(image)));
  //     });
  //   };
  // }, [steps])

  const handleCreateAnother = () => {
    setIsSuccessModalOpen(false);
    
    setTimeout(() => {
      resetForm();
    }, 300); 
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 bg-[#ece3d4] font-mono">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-800">Add New Recipe</h1>
          <p className="text-amber-700">
            Fill out the form to add a new recipe to your collection.
          </p>
        </div>
        <div className="relative">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${s <= currentStep
                    ? "bg-amber-500 text-white"
                    : "bg-amber-200 text-amber-700"
                  } transition-all duration-300`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="absolute top-4 left-0 w-full h-1 bg-amber-200">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
        <div className="space-y-6">
          {currentStep === 1 && (
            <GeneralInfo
              onImageUpload={handleImageUpload}
              onVideoUpload={handleVideoUpload}
              image={imagePreview}
              video={videoPreview}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              cookTime={cookTime}
              setCookTime={setCookTime}
              servings={servings}
              setServings={setServings}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-amber-800">Ingredients</h2>
              {ingredients.map((ingredient, index) => (
                <Ingredient
                  key={index}
                  ingredient={ingredient}
                  index={index}
                  onRemove={removeIngredient}
                  onChange={updateIngredient}
                />
              ))}
              {errors.ingredients && (
                <p className="text-xs text-red-500">{errors.ingredients}</p>
              )}

              <Button
                onClick={addIngredient}
                variant="outline"
                className="w-full"
                type="button"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Ingredient
              </Button>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-amber-800">
                Cooking Steps
              </h2>
              {steps.map((step, index) => (
                <Step
                  key={index}
                  step={step}
                  index={index}
                  onRemove={removeStep}
                  onChange={updateStep}
                />
              ))}
              {errors.steps && (
                <p className="text-xs text-red-500">{errors.steps}</p>
              )}
              <Button
                onClick={addStep}
                variant="outline"
                className="w-full"
                type="button"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </div>
          )}
          {currentStep === 4 && (
            <Review
              title={title}
              description={description}
              image={imagePreview}
              video={videoPreview}
              ingredients={ingredients}
              steps={steps}
              cookTime={cookTime}
              servings={servings}
              difficulty={difficulty}
            />
          )}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                className="bg-amber-100 text-amber-800"
              >
                Previous
              </Button>
            )}
            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-amber-500 hover:bg-amber-600 text-white"
                type="button"
              >
                Next
              </Button>
            ) : (
              <Button
                className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                onClick={sendDataToBackend}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Recipe"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        recipe={submittedRecipe}
        onCreateAnother={handleCreateAnother}

      />
    </div>
  );
};

export default EnhancedRecipeForm;
