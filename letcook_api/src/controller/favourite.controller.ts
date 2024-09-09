// src/controllers/FavoriteController.ts
import { FavoriteService } from "@/service/favourite.service";
import { NextFunction, Request, Response } from "express";

export class FavoriteController {
  private favoriteService = new FavoriteService();

  constructor() {
    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.isFavorited = this.isFavorited.bind(this);
    this.getMultipleFavoriteStatus = this.getMultipleFavoriteStatus.bind(this);
  }

  async addFavorite(req: Request, res: Response, next: NextFunction) {
    const { userId, recipeId } = req.body;
    try {
      const favorite = await this.favoriteService.addFavorite(userId, recipeId);
      res.status(201).json(favorite);
    } catch (error) {
      next(error);  
    }
  }

  async removeFavorite(req: Request, res: Response, next: NextFunction) {
    const { userId, recipeId } = req.params;
    try {
      await this.favoriteService.removeFavorite(userId, recipeId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  async isFavorited(req: Request, res: Response, next: NextFunction) {
    const { userId, recipeId } = req.params;
    try {
      const isFavorited = await this.favoriteService.isFavorited(userId, recipeId);
      res.json({ isFavorited });
    } catch (error) {
      next(error);
    }
  }

  async getMultipleFavoriteStatus(req: Request, res: Response, next: NextFunction) {
    const { userId, recipeIds } = req.body;
    try {
      const isFavorited = await this.favoriteService.getMultipleFavoriteStatus(userId, recipeIds);
      res.json(isFavorited);
    } catch (error) {
      next(error);
    }
  }

  // Add other methods as needed
}