import express from "express";
import multer from "multer";
import RecipeController from "@/controller/recipe.controller";
import { checkRole, verifyToken } from "@/middleware/authJwt";
import { UserRole } from "@/@types/user.d";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const recipeController = new RecipeController();


//handle api key
// General recipe routes
router.get("/recipe", recipeController.getRecipe); //handle api key
router.get("/recipe/all", recipeController.getAll); //handle api key
router.post("/recipe", verifyToken, upload.any(), recipeController.createNewRecipe);


// User-specific recipe routes
router.get("/recipe/user/", verifyToken, recipeController.getRecipesWithUserId);
router.get("/recipe/favorite/", verifyToken, recipeController.getFavoriteRecipes);


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
router.post("/recipe/tag", verifyToken, checkRole([UserRole.ADMIN]), recipeController.createRecipeTag); //admin
router.post("/recipe/tag/:recipeId", verifyToken, checkRole([UserRole.ADMIN]), recipeController.addTags); //admin

// Single recipe operations
router
  .get("/recipe/:id", recipeController.getRecipeById)
  .put("/recipe/:id", verifyToken, checkRole([UserRole.ADMIN]), recipeController.updateRecipe);
router.put("/recipe/:id/ingredients", verifyToken, checkRole([UserRole.ADMIN]), recipeController.updateRecipeIngredients);
router.post("/recipe/:id/accept", verifyToken, checkRole([UserRole.ADMIN]), recipeController.acceptRecipe);
router.post("/recipe/:id/reject", verifyToken, checkRole([UserRole.ADMIN]), recipeController.rejectRecipe);

// Recipe comments and reactions
router.post("/recipe/:id/comments", verifyToken, recipeController.addComment);
router
  .post("/recipe/:id/reactions", verifyToken, recipeController.reaction)
  .get("/recipe/:id/reactions", recipeController.getReaction);




export default router;