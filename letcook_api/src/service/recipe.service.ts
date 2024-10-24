import { MongoDataSource } from "@/config/db.config.ts";
import { Recipe, RecipeComment, RecipeReaction, RecipeReport, RecipeTag } from "@/entity/recipe.entity.ts";
import UserService from "@/service/user.service";
import { Step } from "@/entity/recipeStep.entity.ts";
import { Ingredient } from "@/entity/ingredient.entity.ts";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { ObjectId } from "mongodb";
import { notificationService } from "@/config/socket.config";
import { normalize as normalizeVietnamese } from 'normalize-diacritics';

import env from "@/util/validateEnv";
import { Favorite } from "@/entity/favourite.entity";
import handleError from "@/util/handleError";
import { FavoriteService } from './favourite.service';
import { In, MongoRepository, ObjectLiteral } from "typeorm";
import { log } from "console";
import { ObjectIdLike } from "bson";
import { formatMonthName, getMonthRange } from "@/util/date";

// Updated type definitions
interface RecipeWithDetails extends Omit<Recipe, 'steps' | 'ingredients'> {
  steps: Step[];
  ingredients: Ingredient[];
  user: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  searchScore: number;
}

export default class RecipeService {
  private recipeRepository = MongoDataSource.getRepository(Recipe);
  private stepRepository = MongoDataSource.getRepository(Step);
  private ingredientRepository = MongoDataSource.getRepository(Ingredient);
  private recipeTagRepository = MongoDataSource.getRepository(RecipeTag);
  private recipeCommentRepository = MongoDataSource.getRepository(RecipeComment);
  private reacipeReactionRepository = MongoDataSource.getRepository(RecipeReaction);
  private recipeReportRepository = MongoDataSource.getRepository(RecipeReport);
  private UserService = new UserService();
  private favoriteService = new FavoriteService();

  async mapAndValidateRecipe(json: any): Promise<Recipe> {
    const recipe = plainToInstance(Recipe, json);
    json.createdAt && (recipe.createdAt = new Date(json.createdAt));
    json.updatedAt && (recipe.updatedAt = new Date(json.updatedAt));
    //not validate steps and ingredients
    recipe.steps = [];
    recipe.ingredients = [];
    await validateOrReject(recipe);
    return recipe;
  }
  /**
   * Get all recipes
   * */
  async getAll(): Promise<any> {
    const recipesData = await this.recipeRepository.find();
    const recipeDetails = await Promise.all(
      recipesData.map(async (recipe: Recipe) => {
        const steps = await this.stepRepository.find({
          where: {
            _id: { $in: recipe.steps },
          },
        } as any);
        const ingredients = await this.ingredientRepository.find({
          where: {
            _id: { $in: recipe.ingredients },
          },
        } as any);
        const _user = await this.UserService.findUserById(recipe.userId!);
        const user = _user
          ? {
            id: _user.id,
            name: _user.username,
            avatar: _user.avatar,
          }
          : {
            id: undefined,
            name: undefined,
            avatar: undefined,
          };
        return {
          ...recipe,
          steps,
          ingredients,
          user,
        };
      }),
    );
    return { recipes: recipeDetails };
  }

  /**
   * Get public recipes
   */
  async getRecipe(skip?: number, take?: number, isPublic?: boolean): Promise<any> {
    const query: any = {};
    const options: any = {
      order: {
        createdAt: "ASC",
      },
    };
    isPublic && (query.isPublished = isPublic);
    query.isActivate = true;
    skip && (options.skip = skip);
    take && (options.take = take);
    const [recipes, total] = await this.recipeRepository.findAndCount({
      where: query,
      ...options,
    });
    const recipeDetails = await Promise.all(
      recipes.map(async (recipe: Recipe) => {
        const steps = await this.stepRepository.find({
          where: {
            _id: { $in: recipe.steps },
          },
        } as any);
        const ingredients = await this.ingredientRepository.find({
          where: {
            _id: { $in: recipe.ingredients },
          },
        } as any);
        const _user = await this.UserService.findUserById(recipe.userId!);
        const user = _user
          ? {
            id: _user.id,
            name: _user.username,
            avatar: _user.avatar,
          }
          : {
            id: undefined,
            name: undefined,
            avatar: undefined,
          };
        return {
          ...recipe,
          steps,
          ingredients,
          user,
        };
      }),
    );
    return { recipes: recipeDetails, total };
  }
  /*
  * This function creates or updates ingredients in recipe
  * */
  async createOrUpdateIngredient(ingredients: any[]): Promise<ObjectId[]> {
    const ingredientIds: ObjectId[] = [];
    for (const ingredient of ingredients) {
      const _ingredient = plainToInstance(Ingredient, ingredient);
      await validateOrReject(_ingredient);

      let existingIngredient = await this.ingredientRepository.findOne({
        where: {
          _id: _ingredient._id,
        },
      });
      if (!existingIngredient) {
        existingIngredient = this.ingredientRepository.create(_ingredient);
        await this.ingredientRepository.save(existingIngredient);
      } else {
        existingIngredient.name = _ingredient.name;
        // existingIngredient.unit = _ingredient.unit;
        existingIngredient.quantity = _ingredient.quantity;
        existingIngredient.productId = _ingredient.productId;
        await this.ingredientRepository.update(
          new ObjectId(existingIngredient._id),
          existingIngredient,
        );
      }
      try {
        ingredientIds.push(existingIngredient._id);
      } catch (error: any) {
        console.error(
          `Error saving ingredient with _id ${_ingredient._id}:`,
          error.message,
        );
        throw new Error(`Failed to save step with _id ${_ingredient._id}`);
      }
      // await this.ingredientRepository.save(existingIngredient);
      // ingredientIds.push(existingIngredient._id);
    }
    return ingredientIds;
  }
  /*
  * This function creates or updates steps in recipe
  * */
  async createOrUpdateStep(steps: any[]): Promise<ObjectId[]> {
    const stepIds: ObjectId[] = [];
    for (const step of steps) {
      const _step = plainToInstance(Step, step);
      await validateOrReject(_step);

      let existingStep = await this.stepRepository.findOne({
        where: {
          _id: _step._id,
        },
      });
      if (!existingStep) {
        existingStep = this.stepRepository.create(_step);
        await this.stepRepository.save(existingStep);
      } else {
        existingStep.description = _step.description;
        existingStep.images = _step.images;
        await this.stepRepository.update(
          new ObjectId(existingStep._id),
          existingStep,
        );
      }
      try {
        stepIds.push(existingStep._id);
      } catch (error: any) {
        console.error(
          `Error saving step with _id ${_step._id}:`,
          error.message,
        );
        throw new Error(`Failed to save step with _id ${_step._id}`);
      }
    }
    return stepIds;
  }
  /*
  * This function creates or updates a recipe
  * */
  async createRecipe(json: any): Promise<Recipe> {
    const recipe = await this.mapAndValidateRecipe(json);
    recipe.steps = await this.createOrUpdateStep(json.steps);
    recipe.ingredients = await this.createOrUpdateIngredient(json.ingredients);
    recipe.updatedAt = new Date();
    return await this.recipeRepository.save(recipe);
  }

  /*
  * This function updates a recipe
  * */
  async updateRecipe(json: any, id: string): Promise<[Recipe | null, string]> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    const recipe = await this.recipeRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!recipe) {
      return [null, "Recipe not found"];
    }

    // @ts-ignore
    try {
      const updatedRecipe = await this.mapAndValidateRecipe(json);
      updatedRecipe.steps = await this.createOrUpdateStep(json.steps);
      updatedRecipe.ingredients = await this.createOrUpdateIngredient(
        json.ingredients,
      );

      Object.assign(recipe, {
        title: updatedRecipe.title,
        steps: Array.from(new Set(updatedRecipe.steps)),
        ingredients: Array.from(new Set(updatedRecipe.ingredients)),
        cook_time: updatedRecipe.cook_time,
        serving: updatedRecipe.serving,
        images: updatedRecipe.images,
        updatedAt: new Date(),
      });

      await this.recipeRepository.update(new ObjectId(recipe._id), recipe);
    } catch (error: any) {
      console.error("Error updating recipe:", error.message);
      throw new Error("Failed to update recipe");
    }
    return [recipe, id];
  }

  /*
  * Get existing ingredients
  * */
  async getIngredients(): Promise<Ingredient[]> {
    return await this.ingredientRepository.find();
  }

  async getAllTags(): Promise<RecipeTag[]> {
    return await this.recipeTagRepository.find();
  }

  async addTagToRecipe(id: string, tags: string[]) {
    try {
      const objectId = new ObjectId(id);

      // First, update the recipe
      await this.recipeRepository.update(
        { _id: objectId },
        { tags: tags.map(tag => ({ name: tag })) }
      );

      // Then, fetch the updated recipe
      const updatedRecipe = await this.recipeRepository.findOne({
        where: { _id: objectId }
      });

      if (!updatedRecipe) {
        throw new Error('Recipe not found');
      }

      return updatedRecipe;
    } catch (error) {
      console.error("Error adding tags to recipe:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to add tags to recipe: ${error.message}`);
      } else {
        throw new Error("Failed to add tags to recipe: An unknown error occurred");
      }
    }
  }

  async saveNewRecipeTag(name: string): Promise<RecipeTag> {
    try {
      // Check if the tag already exists
      let existingTag = await this.recipeTagRepository.findOne({ where: { name } });
      if (existingTag) {
        return existingTag;
      }

      // Create a new tag if it doesn't exist
      const newTag = new RecipeTag();
      newTag._id = new ObjectId();
      newTag.name = name;

      await validateOrReject(newTag);
      const createdTag = await this.recipeTagRepository.save(newTag);
      return createdTag;
    } catch (error) {
      console.error("Error saving new recipe tag:", error);
      throw new Error("Failed to save new recipe tag");
    }
  }

  async updateStatusRecipe(id: string, active: boolean, feedback?: string): Promise<Recipe> {
    try {
      const objectId = new ObjectId(id);
      const recipe = await this.recipeRepository.findOne({ where: { _id: objectId } });

      if (!recipe) {
        throw new Error('Recipe not found');
      }

      recipe.isActivate = active;
      recipe.isPublished = active;
      await this.recipeRepository.update({ _id: objectId }, recipe);
      const updatedRecipe = await this.getRecipeById(id, false);

      if (!active) {
        await notificationService.createNotification({
          userId: recipe.userId!,
          title: "Recipe Rejected",
          content: `Reason: ${feedback}`,
          createdAt: new Date(),
        });

      } else {
        await notificationService.createNotification({
          userId: recipe.userId!,
          title: "Recipe Accepted",
          content: "Your recipe was public",
          createdAt: new Date(),
        });

      }

      return updatedRecipe;
    } catch (error) {
      console.error("Error accepting recipe:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to accept recipe: ${error.message}`);
      } else {
        throw new Error("Failed to accept recipe: An unknown error occurred");
      }
    }
  }

  async getRecipeById(id: string, filterActive: boolean = true): Promise<any> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    const recipe = await this.recipeRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (!recipe.isActivate && filterActive) {
      throw new Error("Recipe is not active");
    }

    const steps = await this.stepRepository.find({
      where: {
        _id: { $in: recipe.steps },
      },
    } as any);

    const ingredients = await this.ingredientRepository.find({
      where: {
        _id: { $in: recipe.ingredients },
      },
    } as any);

    const comments = await this.recipeCommentRepository.find({
      where: {
        recipeId: new ObjectId(id),
      },
      order: {
        createdAt: "DESC",
      },
    } as any);

    const commentWithUser = await Promise.all(
      comments.map(async (comment) => {
        const { userId, ...commentWithoutUserId } = comment;
        const user = await this.UserService.findUserById(userId!);
        console.log(user);

        if (user) {
          return {
            ...commentWithoutUserId,
            user: {
              id: user.id,
              username: user.username,
              avatar: user.avatar,
            },
          };
        } else {
          return {
            ...commentWithoutUserId,
            user: {
              id: undefined,
              username: undefined,
              avatar: undefined,
            },
          };
        }
      }),
    );

    //fetching user for comment

    const _user = await this.UserService.findUserById(recipe.userId!);
    const user = _user
      ? {
        id: _user.id,
        name: _user.username,
        avatar: _user.avatar,
      }
      : {
        id: undefined,
        name: undefined,
        avatar: undefined,
      };

    return {
      ...recipe,
      steps,
      ingredients,
      user,
      commentWithUser,
    };
  }

  async updateRecipeIngredients(recipeId: string, ingredients: any[]): Promise<Recipe> {
    if (!ObjectId.isValid(recipeId)) {
      throw new Error("Invalid recipe ID");
    }

    const recipe = await this.recipeRepository.findOne({
      where: { _id: new ObjectId(recipeId) },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    const ingredientIds = await this.createOrUpdateIngredient(ingredients);
    recipe.ingredients = ingredientIds;
    recipe.updatedAt = new Date();

    await this.recipeRepository.update(
      { _id: new ObjectId(recipeId) },
      recipe
    );

    return this.getRecipeById(recipeId);
  }
  async updateIngredientProductIds(recipeId: string, ingredients: { _id: string, productId: number }[]): Promise<Recipe> {
    if (!ObjectId.isValid(recipeId)) {
      throw new Error("Invalid recipe ID");
    }

    const recipe = await this.recipeRepository.findOne({
      where: { _id: new ObjectId(recipeId) },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    for (const ingredient of ingredients) {
      await this.ingredientRepository.update(
        { _id: new ObjectId(ingredient._id) },
        { productId: ingredient.productId }
      );
    }

    recipe.updatedAt = new Date();

    await this.recipeRepository.update(
      { _id: new ObjectId(recipeId) },
      recipe
    );

    return this.getRecipeById(recipeId);
  }

  private synonymMap: { [key: string]: string[] } = {
    'ngô': ['bắp'],
    'bắp': ['ngô'],
    'heo': ['lợn'],
    'lợn': ['heo'],
    'dưa leo': ['dưa chuột'],
    'dưa chuột': ['dưa leo'],
    'đậu phộng': ['lạc'],
    'lạc': ['đậu phộng'],
  };

  /*
  searchWords: [
  "món cay", "nguyên liệu cay", "ớt", "món Thái", "món Ấn Độ",
  "món cay", "nguyên liệu cay", "ớt", "món Thái", "món Ấn Độ",
  "món Hàn Quốc", "lẩu cay", "cà ri cay", "ớt đỏ", "tiêu", "cay xé lưỡi",
  "xào cay", "canh cay", "măng ớt", "gà cay"
],
  */

  async searchRecipes(
    query: string[],
    //  tags: string[], 
    ingredients: string[],
    skip?: number,
    take?: number): Promise<any> {
    console.log("query", query);
    const searchPatterns = query.map(q => new RegExp(`.*${q}.*`, 'i'));
    const ingredientWords = ingredients.map(ingredient => ingredient.toLowerCase());

    const searchQuery: any = {
      $or: query.map(q => ({
        $or: [
          { title: { $regex: `.*${q}.*`, $options: 'i' } },
          { description: { $regex: `.*${q}.*`, $options: 'i' } },
          { 'ingredients.name': { $regex: `.*${q}.*`, $options: 'i' } },
          { 'tags.name': { $regex: `.*${q}.*`, $options: 'i' } }
        ]
      })),
      isPublished: true // Ensure only published recipes are returned
    };

    // if (tags && tags.length > 0) {
    //   searchQuery['tags.name'] = { $in: tags };
    // }

    if (ingredients && ingredients.length > 0) {
      searchQuery['ingredients.name'] = { $in: ingredients.map(ingredient => new RegExp(ingredient, 'i')) };
    }

    searchQuery['ingredients.name'] = { $in: query.map(q => new RegExp(q, 'i')) };


    const options: any = {
      where: searchQuery
    };

    skip && (options.skip = skip);
    take && (options.take = take);

    const [recipes, total] = await this.recipeRepository.findAndCount(options);

    // Calculate scores for each recipe and sort by the score
    const recipeDetails = await Promise.all(
      recipes.map(async (recipe: Recipe) => {
        const steps = await this.stepRepository.find({
          where: { _id: { $in: recipe.steps } } as any,
        });
        const ingredients = await this.ingredientRepository.find({
          where: { _id: { $in: recipe.ingredients } } as any,
        });
        const _user = await this.UserService.findUserById(recipe.userId!);
        const user = _user
          ? {
            id: _user.id,
            name: _user.username,
            avatar: _user.avatar,
          }
          : {
            id: undefined,
            name: undefined,
            avatar: undefined,
          };

        // Calculate enhanced search score for each recipe
        // const score = this.calculateEnhancedSearchScore(recipe, ingredients, searchPatterns, ingredientWords);

        return { ...recipe, steps, ingredients, user };
      })
    );

    // Sort recipes by the calculated score in descending order
    // const sortedRecipes = recipeDetails.sort((a, b) => b.score - a.score);

    return { recipes: recipeDetails, total };
  }


  // Helper method to calculate search relevance score
  private calculateSearchScore(
    recipe: Recipe,
    ingredients: any[],
    searchWords: string[]
  ): number {
    let score = 0;

    for (const word of searchWords) {
      const wordRegex = new RegExp(this.escapeRegExp(word), 'i');

      // Title matches (highest weight)
      if (wordRegex.test(recipe.title)) {
        score += 10;
      }

      // Description matches
      if (wordRegex.test(recipe.description)) {
        score += 5;
      }

      // Ingredient matches
      for (const ingredient of ingredients) {
        if (wordRegex.test(ingredient.name)) {
          score += 3;
        }
      }
    }

    return score;
  }



  private calculateEnhancedSearchScore(
    recipe: Recipe,
    ingredients: Ingredient[],
    searchPatterns: RegExp[],
    ingredientWords: string[]
  ): number {
    let score = 0;

    // Score for title matches
    searchPatterns.forEach(pattern => {
      if (pattern.test(recipe.title)) score += 3;
      if (pattern.test(recipe.description)) score += 2;
    });

    // Enhanced ingredient scoring
    ingredients.forEach(ingredient => {
      const ingredientName = ingredient.name?.toLowerCase() || '';

      // Score for exact ingredient matches
      ingredientWords.forEach(word => {
        if (ingredientName.includes(word)) {
          score += 2; // Higher score for ingredient matches
        }
      });

      // Additional score for partial matches
      searchPatterns.forEach(pattern => {
        if (pattern.test(ingredientName)) {
          score += 1;
        }
      });
    });

    // Bonus score for matching multiple search terms
    const uniqueMatches = new Set();
    searchPatterns.forEach(pattern => {
      if (pattern.test(recipe.title) ||
        pattern.test(recipe.description) ||
        ingredients.some(ing => pattern.test(ing.name || ''))) {
        uniqueMatches.add(pattern.source);
      }
    });

    // Bonus points for matching multiple terms
    score += uniqueMatches.size * 0.5;

    return score;
  }

  // Helper method to escape special regex characters
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async addComment(
    recipeId: string,
    userId: string,
    content: string,
  ): Promise<any> {
    if (!ObjectId.isValid(recipeId)) {
      throw new Error("Invalid recipe ID");
    }
    // console.log("userId --recipe", userId);
    // if (!ObjectId.isValid(userId)) {
    //   throw new Error("Invalid user ID");
    // }
    const recipe = await this.recipeRepository.findOne({
      where: { _id: new ObjectId(recipeId) },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    const comment = new RecipeComment();
    comment.recipeId = new ObjectId(recipeId);
    comment.userId = userId;
    comment.content = content;
    // comment.createdAt = new Date();

    const savedComment = await this.recipeCommentRepository.save(comment);
    recipe.comments?.push(savedComment._id);
    await this.recipeRepository.update(new ObjectId(recipeId), recipe);
    return this.getRecipeById(recipeId);
  }


  //reaction
  async reaction(
    recipeId: string,
    userId: string,
    isLike?: boolean,
    isHeart?: boolean,
    isCookpot?: boolean,
  ): Promise<RecipeReaction> {
    if (!ObjectId.isValid(recipeId)) {
      throw new Error("Invalid recipe ID");
    }
    const recipe = await this.recipeRepository.findOne({
      where: { _id: new ObjectId(recipeId) },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    //find reaction if exist
    const reaction = await this.reacipeReactionRepository.findOne({
      where: { recipeId: new ObjectId(recipeId), userId },
    });

    if (!reaction) {
      const _reaction = new RecipeReaction();
      _reaction.recipeId = new ObjectId(recipeId);
      _reaction.userId = userId;
      _reaction.isLike = isLike || false;
      _reaction.isHeart = isHeart || false;
      _reaction.isCookpot = isCookpot || false;
      await this.reacipeReactionRepository.save(_reaction);
      recipe.reactions?.push(_reaction._id);
      await this.recipeRepository.update(new ObjectId(recipeId), recipe);
      return _reaction;
    } else {
      if (isLike !== undefined) reaction.isLike = isLike;
      if (isHeart !== undefined) reaction.isHeart = isHeart;
      if (isCookpot !== undefined) reaction.isCookpot = isCookpot;
      await this.reacipeReactionRepository.update(reaction._id, reaction);
      return reaction;
    }

    // return this.getRecipeById(recipeId);
    // return reaction;
  }
  async getReaction(
    recipeId: string,
    userId?: string,
  ): Promise<{
    isLike: boolean;
    isHeart: boolean;
    isCookpot: boolean;
    likeCount: number;
    heartCount: number;
    cookpotCount: number;
  }> {
    if (!ObjectId.isValid(recipeId)) {
      throw new Error("Invalid recipe ID");
    }

    const recipe = await this.recipeRepository.findOne({
      where: { _id: new ObjectId(recipeId) },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    const [, likeCount] = await this.reacipeReactionRepository.findAndCount({
      where: { recipeId: new ObjectId(recipeId), isLike: true },
    });
    const [, heartCount] = await this.reacipeReactionRepository.findAndCount({
      where: { recipeId: new ObjectId(recipeId), isHeart: true },
    });

    const [, cookpotCount] = await this.reacipeReactionRepository.findAndCount({
      where: { recipeId: new ObjectId(recipeId), isCookpot: true },
    });

    const reaction = await this.reacipeReactionRepository.findOne({
      where: { recipeId: new ObjectId(recipeId), userId },
    });

    return {
      isLike: reaction?.isLike || false,
      isHeart: reaction?.isHeart || false,
      isCookpot: reaction?.isCookpot || false,
      likeCount,
      heartCount,
      cookpotCount,
    };
  }

  async getRecipeWithUser(recipe: Recipe) {
    const { userId, ...recipeWithoutUserId } = recipe;
    const user = await this.UserService.findUserById(userId!);
    if (user) {
      return {
        ...recipeWithoutUserId,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
      };
    } else {
      return {
        ...recipeWithoutUserId,
        user: {
          id: undefined,
          username: undefined,
          avatar: undefined,
        },
      };
    }
  }

  async getRecipesWithUserId(userid?: string) {

    const options: any = {
      order: {
        createdAt: "DESC",
      },
    };


    const recipes = await this.recipeRepository.find({
      where: { userId: userid }, // Điều kiện lấy bài đăng theo userId

      ...options,
    });
    const recipeWithUser = await Promise.all(
      recipes.map(recipe => this.getRecipeWithUser(recipe))
    );
    return recipeWithUser;
  }

  async getFavoriteRecipes(userId: string) {
    try {
      const favoritesIds = await this.favoriteService.getFavoriteRecipes(userId);
      if (!favoritesIds || favoritesIds.length === 0) {
        return [];
      }
      const options = {
        where: {
          _id: { $in: favoritesIds.map(id => new ObjectId(id)) },
        } as any
      }

      const recipes = await this.recipeRepository.find(
        options
      );

      console.log('recipes', recipes);
      console.log('favoritesIds', favoritesIds);

      // Optionally, you can add user information to each recipe
      const recipesWithUser = await Promise.all(
        recipes.map(async (recipe) => this.getRecipeWithUser(recipe))
      );

      return recipesWithUser;
    } catch (error) {
      console.error("Error getting user favorites:", error);
      handleError(error as Error, "Error getting user favorites");
      return []; // Return an empty array in case of error
    }
  }


  async reportRecipe(recipeId: string, userId: string, report: string) {
    try {

      const recipe = await this.recipeRepository.findOne({
        where: { _id: new ObjectId(recipeId) },
      });

      const user = await this.UserService.findUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (!recipe) {
        throw new Error('Recipe not found');
      }

      const existingReport = await this.recipeReportRepository.findOne({
        where: { recipeId: new ObjectId(recipeId), userId },
      });

      const reportRecipe = new RecipeReport();
      reportRecipe.recipeId = new ObjectId(recipeId);
      reportRecipe.userId = userId;
      reportRecipe.report = report;

      if (existingReport) {
        throw new Error('You have already reported this recipe');
      }

      await this.recipeReportRepository.save(reportRecipe);

      return reportRecipe;
    } catch (error) {
      handleError(error as Error, "Error reporting recipe");
    }
  }

  async getAllReportedRecipes() {
    try {
      const reportAggregation = await this.recipeReportRepository.aggregate([
        {
          $group: {
            _id: "$recipeId",  // Group by recipeId
            reportCount: { $sum: 1 }, // Count the number of reports
          },
        },
      ]).toArray();

      const recipeIds = reportAggregation.map(report => new ObjectId(report._id));

      console.log('recipeIds:', recipeIds);

      const recipes = await this.recipeRepository.find({
        where: {
          _id: { $in: recipeIds },
          isActivate: true,
        },
      });

      console.log('found recipes:', recipes);

      // Map reports and recipes to create the final output
      const reportsWithTitles = reportAggregation
        .map(report => {
          const recipe = recipes.find(r => r._id.equals(new ObjectId(report._id)));
          if (recipe) {
            return {
              recipeId: report._id,
              title: recipe.title,
              reportCount: report.reportCount,
            };
          }
          return null;
        })
        .filter(report => report !== null); // Remove null entries (blocked recipes)

      return reportsWithTitles;
    } catch (error) {
      handleError(error as Error, "Error getting reported recipes");
      throw new Error("Error fetching reported recipes");
    }
  }

  async getReportByRecipeId(recipeId: string) {
    try {
      const report = await this.recipeReportRepository.findOne({
        where: { recipeId: new ObjectId(recipeId) },
      });
      return report;
    } catch (error) {
      handleError(error as Error, "Error getting report by recipe id");
    }
  }

  async blockRecipe(recipeId: string) {
    try {
      const recipe = await this.recipeRepository.findOne({
        where: { _id: new ObjectId(recipeId) },
      });

      if (recipe) {
        recipe.isActivate = false;
        recipe.isPublished = false;
        await this.recipeRepository.update(new ObjectId(recipeId), { isActivate: false });
        await this.recipeReportRepository.delete({ recipeId: new ObjectId(recipeId) });
      } else {
        throw new Error("Recipe not found");
      }

      return recipe;
    } catch (error) {
      handleError(error as Error, "Error blocking recipe");
    }
  }

  async countRecipesToCheck(): Promise<number> {
    const [, count] = await this.recipeRepository.findAndCount({
      where: { isActivate: false },
    });
    return count;
  }

  async countRecipesByMonth() {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const recipeCounts = [];

      for (let i = 4; i >= 0; i--) {
        const { start, end } = getMonthRange(year, currentDate.getMonth() - i);
        const count = await (this.recipeRepository as unknown as MongoRepository<ObjectLiteral>).count({
          $expr: {
            $and: [
              { $gte: ["$createdAt", start] },
              { $lte: ["$createdAt", end] },
            ],
          } as any,
        });
        recipeCounts.push(count);
      }

      const data = recipeCounts.map((count, index) => ({
        month: formatMonthName(currentDate.getMonth() - 4 + index),
        recipes: count,
      }));
      return data;
    } catch (error) {
      throw new Error("Failed to get recipe data");
    }
  }


}