import { FavoriteController } from "@/controller/favourite.controller";
import express from "express";

const router = express.Router();
const favoriteController = new FavoriteController();

router.post("/favorite", favoriteController.addFavorite);
router.delete("/favorite/:userId/:recipeId", favoriteController.removeFavorite);
router.get("/favorite/check/:userId/:recipeId", favoriteController.isFavorited);
router.post("/favorite/check-multiple", favoriteController.getMultipleFavoriteStatus);

/*
router.post("/favorite", favoriteController.addFavorite.bind(favoriteController));
router.delete("/favorite/:userId/:recipeId", favoriteController.removeFavorite.bind(favoriteController));
router.get("/favorite/check/:userId/:recipeId", favoriteController.isFavorited.bind(favoriteController));
router.get("/favorite/check-multiple", favoriteController.getMultipleFavoriteStatus.bind(favoriteController));

*/

export default router;