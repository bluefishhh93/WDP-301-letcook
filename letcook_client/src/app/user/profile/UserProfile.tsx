'use client'
import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MyPosts from "./MyPost";
import MyRecipes from "./MyRecipe";
import SavedRecipes from "./SavedRecipe";
import * as PostService from "@/services/post.service";
import * as RecipeService from "@/services/recipe.service";
import { Recipe } from "CustomTypes";
import { PostType } from "Post";
import useAuth from "@/hooks/useAuth";

type Section = 'posts' | 'my-recipes' | 'saved-recipes';

const UserProfile = () => {   
    const { user } = useAuth();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [activeSection, setActiveSection] = useState<Section>('posts');

    const fetchData = useCallback(async (userId: string) => {
        try {
            const [postsRes, myRecipesRes, savedRecipesRes] = await Promise.all([
                PostService.getPostWithUserId(userId),
                RecipeService.getRecipesByUserId(userId),
                RecipeService.getFavoriteRecipes(userId)
            ]);

            setPosts(postsRes || []);
            setMyRecipes(myRecipesRes || []);
            setSavedRecipes(savedRecipesRes || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchData(user.id);
        }
    }, [user?.id, fetchData]);

    const handleEditPost = (postId: string) => {

    };

    const handleDeletePost = (postId: string) => {

    };

    const handleEditRecipe = (recipeId: string) => {

    };

    const handleDeleteRecipe = (recipeId: string) => {

    };

    const handleRemoveFromSavedRecipes = (recipeId: string) => {

    };

    const renderSection = () => {
        switch(activeSection) {
            case 'posts':
                return <MyPosts posts={posts} onDelete={handleDeletePost} onEdit={handleEditPost} />;
            case 'my-recipes':
                return <MyRecipes recipes={myRecipes} onEdit={handleEditRecipe} onDelete={handleDeleteRecipe} />;
            case 'saved-recipes':
                return <SavedRecipes recipes={savedRecipes} onDelete={handleRemoveFromSavedRecipes} onEdit={()=> {}} />;
        }
    };

    return (
        <div className="w-full max-w-[1250px] mx-auto mt-8">
            <div className="bg-muted rounded-t-lg p-6 md:p-8">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage
                            src={user?.avatar}
                            alt={user?.email}
                            className="h-full w-full"
                        />
                    </Avatar>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold">{user?.email}</h2>
                    </div>
                </div>
            </div>
            <div className="border-b">
                <div className="flex justify-center">
                    <div className="flex gap-4 pt-4 text-sm font-medium">
                        {(['posts', 'my-recipes', 'saved-recipes'] as Section[]).map((section) => (
                            <button
                                key={section}
                                className={`px-4 py-2 rounded-t-lg hover:bg-muted/50 transition-colors ${activeSection === section ? 'bg-muted/50' : ''}`}
                                onClick={() => setActiveSection(section)}
                            >
                                {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>
                </div>
                {renderSection()}
            </div>
        </div>
    );
}

export default UserProfile;