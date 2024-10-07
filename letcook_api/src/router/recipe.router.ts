import express from "express";
import multer from "multer";
import RecipeController from "@/controller/recipe.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const recipeController = new RecipeController();

// General recipe routes
router.get("/recipe/all", recipeController.getAll);
router.get("/recipe", recipeController.getRecipe);
router.post("/recipe", upload.any(), recipeController.createNewRecipe);

// Recipe reports
router.post("/recipe/:recipeId/report", recipeController.reportRecipe);
router.get("/recipe/reports", recipeController.getAllReportedRecipes);
router.get("/recipe/:recipeId/report", recipeController.getReportByRecipeId);
router.post("/recipe/:recipeId/block", recipeController.blockRecipe);

// Recipe search and ingredients
router.get("/recipe/search", recipeController.searchRecipes);
router.get("/recipe/ingredients", recipeController.getIngredients);

// Recipe tags
router.get("/recipe/tag", recipeController.getAllTagsName);
router.post("/recipe/tag", recipeController.createRecipeTag);
router.post("/recipe/tag/:recipeId", recipeController.addTags);

// Single recipe operations
router
  .get("/recipe/:id", recipeController.getRecipeById)
  .put("/recipe/:id", recipeController.updateRecipe);
router.put("/recipe/:id/ingredients", recipeController.updateRecipeIngredients);
router.post("/recipe/:id/accept", recipeController.acceptRecipe);
router.post("/recipe/:id/reject", recipeController.rejectRecipe);

// Recipe comments and reactions
router.post("/recipe/:id/comments", recipeController.addComment);
router
  .post("/recipe/:id/reactions", recipeController.reaction)
  .get("/recipe/:id/reactions", recipeController.getReaction);

// User-specific recipe routes
router.get("/recipe/user/:userId", recipeController.getRecipesWithUserId);
router.get("/recipe/favorite/:userId", recipeController.getFavoriteRecipes);




export default router;