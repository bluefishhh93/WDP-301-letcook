import { NextFunction, query, Request, Response } from "express";
import RecipeService from "@/service/recipe.service.ts";
import { CreateRecipeDTO } from "@/dto/create-recipe.dto";
import { parseIngredients, parseSteps } from "@/util/recipe.util";
import { uploadToCloudinary } from "@/util/cloudinary.util";
import env from "@/util/validateEnv";

export default class RecipeController {
  private recipeService = new RecipeService();
  createNewRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user as { id: string };
      const {
        title,
        description,
        cookTime,
        servings,
        difficulty,
        image,
        video,
        ingredients,
        steps
      } = req.body;
  
      const recipe: CreateRecipeDTO = {
        userId: id,
        title,
        description,
        cook_time: parseInt(cookTime),
        serving: parseInt(servings),
        difficulty,
        images: image ? [image] : [],
        video,
        ingredients,
        steps,
        isPublic: false,
        createdAt: new Date(),
      };
  
      const newRecipe = await this.recipeService.createRecipe(recipe);
      res.status(200).json(newRecipe);
    } catch (error) {
      next(error);
    }
  };
  createRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipe = await this.recipeService.createRecipe(req.body);
      res.status(201).json({
        message: "Recipe created successfully",
        recipe: recipe,
      });
    } catch (error) {
      next(error);
    }
  };
  updateRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipe = await this.recipeService.updateRecipe(
        req.body,
        req.params.id,
      );
      res.status(201).json({
        message: "Recipe updated successfully",
        recipe: recipe,
      });
    } catch (error) {
      next(error);
    }
  };

  getRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;
      const isPublic = req.query.isPublic ? req.query.isPublic === 'true' : undefined;
      const { recipes, total } = await this.recipeService.getRecipe(skip, take, isPublic);


      res.status(200).json({
        message: "Recipes fetched successfully",
        recipes,
        total,

      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipes = await this.recipeService.getAll();
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  };

  getIngredients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ingredients = await this.recipeService.getIngredients();
      res.status(200).json(ingredients);
    } catch (error) {
      next(error);
    }
  };

  getAllTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await this.recipeService.getAllTags();
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  };

  getAllTagsName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await this.recipeService.getAllTags();
      const tagNames = tags.map((tag) => tag.name);
      res.status(200).json(tagNames);
    } catch (error) {
      next(error);
    }
  };

  createRecipeTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body; // Extract name from req.body
      const tag = await this.recipeService.saveNewRecipeTag(name);
      res.status(201).json({
        message: "Tag created successfully",
        tag: tag,
      });
    } catch (error) {
      next(error);
    }
  };

  addTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.recipeId;
      const tags = req.body.tags;
      const savedTags = await Promise.all(
        tags.map(async (tag: string) => {
          return await this.recipeService.saveNewRecipeTag(tag);
        }),
      );
      const post = await this.recipeService.addTagToRecipe(recipeId, tags);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  acceptRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const recipe = await this.recipeService.updateStatusRecipe(
        recipeId,
        true,
      );
      res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  };

  rejectRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const feedback = req.body.feedback;
      const recipe = await this.recipeService.updateStatusRecipe(
        recipeId,
        false,
        feedback,
      );
      res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  };

  updateRecipeIngredients = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const recipeId = req.params.id;
      const ingredients = req.body.ingredients;


      const updatedRecipe = await this.recipeService.updateIngredientProductIds(recipeId, ingredients);


      res.status(200).json({
        message: "Recipe ingredients updated successfully",
        recipe: updatedRecipe,
      });
    } catch (error) {
      next(error);
    }
  };

  getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('getRecipeById');
      const recipeId = req.params.id;
      const recipe = await this.recipeService.getRecipeById(recipeId);
      res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  };

  addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const content = req.body.content;
      const userId = req.body.userId;
      const recipe = await this.recipeService.addComment(
        recipeId,
        userId,
        content,
      );
      res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  };

  reaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.body.userId;
      const isLike = req.body.isLike as boolean;
      const isHeart = req.body.isHeart as boolean;
      const isCookpot = req.body.isCookpot as boolean;
      const recipe = await this.recipeService.reaction(
        recipeId,
        userId,
        isLike,
        isHeart,
        isCookpot,
      );
      res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }

  };
  getReaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipeId = req.params.id;
      const userId = req.query.userId as string;
      const reaction = await this.recipeService.getReaction(recipeId, userId);
      res.status(200).json(reaction);
    } catch (error) {
      next(error);
    }
  };

  searchRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchWords: string[] = Array.isArray(req.query.searchWords)
        ? req.query.searchWords as string[]
        : req.query.searchWords
          ? [req.query.searchWords as string]
          : [];


      const tags: string[] = [];
      const ingredients: string[] = Array.isArray(req.query.ingredients)
        ? req.query.ingredients as string[]
        : req.query.ingredients
          ? [req.query.ingredients as string]
          : [];


      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const recipes = await this.recipeService.searchRecipes( searchWords, ingredients, skip, limit );
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  }

  getRecipesWithUserId = async (req: Request, res: Response) => {
    const { id } = req.user as { id: string };
    try {
      const recipes = await this.recipeService.getRecipesWithUserId(id);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch posts', error });
    }
  }

    getFavoriteRecipes = async (req: Request, res: Response) => {
    const { id } = req.user as { id: string };
    try {
      const recipes = await this.recipeService.getFavoriteRecipes(id);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch favorite recipes', error });
    }
  }

  reportRecipe = async (req: Request, res: Response) => {
    try {
      const { recipeId } = req.params;
      const { userId, report } = req.body;

      const reportRecipe = await this.recipeService.reportRecipe(recipeId, userId, report);
      
      res.status(201).json({ message: 'Recipe reported successfully', reportRecipe });
    } catch (error) {
      res.status(500).json({ message: 'Failed to report recipe', error });
    }
  }

  getAllReportedRecipes = async (req: Request, res: Response) => {

    try {
      const recipes = await this.recipeService.getAllReportedRecipes();
      res.json(recipes);

    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch reported recipes', error });
    }

  }

  getReportByRecipeId = async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    try {
      const recipe = await this.recipeService.getReportByRecipeId(recipeId);
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch reported recipe', error });
    }
  }

  blockRecipe = async (req: Request, res: Response) => {
    const { recipeId } = req.params;

    try {
      const recipe = await this.recipeService.blockRecipe(recipeId);
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Failed to block recipe', error });
    }
  }

}

