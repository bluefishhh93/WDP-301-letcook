import { MongoDataSource } from "@/config/db.config";
import { ObjectId } from "mongodb";
import { Favorite } from "@/entity/favourite.entity";
import handleError from "@/util/handleError";
import { In } from "typeorm";
export class FavoriteService {
    private favoriteRepository = MongoDataSource.getRepository(Favorite);

    async addFavorite(userId: string, recipeId: string): Promise<Favorite> {
        try {
            const favorite = new Favorite();
            favorite.userId = userId;
            favorite.recipeId = recipeId;

            return await this.favoriteRepository.save(favorite);
        } catch (error) {
            return handleError(error as Error, "Error saving favorite");
        }
    }

    async removeFavorite(userId: string, recipeId: string): Promise<void> {
        try {
            await this.favoriteRepository.delete({
                userId: userId,
                recipeId: recipeId
            });
        } catch (error) {
            handleError(error as Error, "Error deleting favorite");
        }
    }

    async isFavorited(userId: string, recipeId: string): Promise<boolean> {
        const [, count] = await this.favoriteRepository.findAndCount({
            where: {
                userId: userId,
                recipeId: recipeId
            } 
        });
        return count > 0;
    }

    async getUserFavorites(userId: string): Promise<Favorite[]> {
        try {
            return await this.favoriteRepository.find({
                where: {
                    userId: userId      
                }
            });
        } catch (error) {
            return handleError(error as Error, "Error getting user favorites");
        }
    }

    async getMultipleFavoriteStatus(userId: string, recipeIds: string[]): Promise<Record<string, boolean>> {

        try {
            const favorites = await this.favoriteRepository.find({
                where: {
                    userId: userId,
                    recipeId: In(recipeIds)
                }
            });

            return recipeIds.reduce((acc, recipeId) => {
                acc[recipeId] = favorites.some(favorite => favorite.recipeId === recipeId);
                return acc;
            }, {} as Record<string, boolean>);
        } catch (error) {
            return handleError(error as Error, "Error getting multiple favorite status");
        }   
    }


    async getFavoriteRecipes(userId: string): Promise<string[]> {
        try {
            const favorites = await this.favoriteRepository.find({
                where: {
                    userId: userId
                }
            });
            return favorites.map(favorite => favorite.recipeId);
            
        } catch (error) {
            return handleError(error as Error, "Error getting user favorites");
        }
    
    }
}