import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recipe } from 'CustomTypes';
import { ChefHat, Clock, Edit2, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

interface RecipeCardProps {
    recipe: Recipe;
    onEdit?: (recipeId: string) => void;
    onDelete?: (recipeId: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onEdit, onDelete }) => {
    return (
        <Link href={`/recipe/${recipe._id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-video">
                    <img
                        src={recipe.images[0] || "/placeholder-recipe.jpg"}
                        alt={recipe.title}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                        {recipe.difficulty}
                    </div>
                </div>
                <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
                    {/* <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{recipe.description}</p> */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {recipe.cook_time} min
                        </div>
                        <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {recipe.serving} servings
                        </div>
                        <div className="flex items-center">
                            <ChefHat className="w-4 h-4 mr-1" />
                            {recipe.ingredients.length} ingredients
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm px-2 py-1 rounded-full ${recipe.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {recipe.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Updated: {new Date(recipe.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Avatar className="w-8 h-8 mr-2">
                                <AvatarImage src={recipe.user.avatar} />
                                <AvatarFallback>{recipe.user.name}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{recipe.user.name}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(recipe._id)}>
                                <Edit2 className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onDelete && onDelete(recipe._id)}>
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default RecipeCard;