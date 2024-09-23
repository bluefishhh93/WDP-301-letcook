'use client'
import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MyPosts from "./MyPost";
import MyRecipes from "./MyRecipe";
import SavedRecipes from "./SavedRecipe";
import * as PostService from "@/services/post.service";
import * as RecipeService from "@/services/recipe.service";
import * as UserService from "@/services/user.service";
import { Recipe } from "CustomTypes";
import { PostType } from "Post";
import useAuth from "@/hooks/useAuth";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Image from 'next/image';
import EditProfileForm from "./EditProfileForm";
import EditProfileButton from "./EditProfileButton";
import { useSession } from "next-auth/react";

type Section = 'posts' | 'my-recipes' | 'saved-recipes';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const formSchema = z.object({
    image: z
        .custom<FileList>()
        .refine((files) => files.length === 1, 'Please upload exactly one image.')
        .refine((files) => files[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
            'Only .jpg, .png, .webp and .gif formats are supported.'
        ),
});

type FormValues = z.infer<typeof formSchema>;

const UserProfile = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [activeSection, setActiveSection] = useState<Section>('posts');
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { data: session, update } = useSession();
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

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

    // useEffect(() => {
    //     if (session?.user?.avatar) {
    //       setAvatarUrl(session.user.avatar);
    //     }
    //   }, [session]);

    useEffect(() => {
        if (user?.id) {
            fetchData(user.id);
        }
    }, [user?.id, fetchData]);

    const handleEditPost = (postId: string) => {
        // Implementation for editing post
    };

    const handleDeletePost = (postId: string) => {
        // Implementation for deleting post
    };

    const handleEditRecipe = (recipeId: string) => {
        // Implementation for editing recipe
    };

    const handleDeleteRecipe = (recipeId: string) => {
        // Implementation for deleting recipe
    };

    const handleRemoveFromSavedRecipes = (recipeId: string) => {
        // Implementation for removing from saved recipes
    };

    const onSubmit = async (data: FormValues) => {
        if (!user || !selectedFile) return;

        setIsUpdatingAvatar(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image');
            }

            const result = await response.json();
            const updatedUser = await UserService.updateProfile(user.id, { avatar: result.url });
            console.log('Avatar updated:', result.url);

            // Refresh user data or update local state
            // if (updatedUser) {
            //     user.avatar = result.url;
            //     // update({avatar: result.url});
            // }
            // update({avatar: result.url});


            form.reset();
        } catch (error) {
            console.error('Error uploading image:', error);
            form.setError('image', {
                type: 'manual',
                message: error instanceof Error ? error.message : 'Failed to upload image. Please try again.'
            });
        } finally {
            setIsUpdatingAvatar(false);
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'posts':
                return <MyPosts posts={posts} onDelete={handleDeletePost} onEdit={handleEditPost} />;
            case 'my-recipes':
                return <MyRecipes recipes={myRecipes} onEdit={handleEditRecipe} onDelete={handleDeleteRecipe} />;
            case 'saved-recipes':
                return <SavedRecipes recipes={savedRecipes} onDelete={handleRemoveFromSavedRecipes} onEdit={() => { }} />;
        }
    };

    return (
        <div className="w-full max-w-[1250px] mx-auto mt-8">
            <div className="bg-muted rounded-t-lg p-6 md:p-8">
                <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src={user?.avatar}
                            alt={user?.email}
                            className="h-full w-full object-cover"
                        />
                    </Avatar>
                    <div className=" space-y-1">
                        <h2 className="text-xl font-bold">{user?.email}</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.files);
                                                        setSelectedFile(e.target.files?.[0] || null);
                                                    }}
                                                    className="text-sm"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isUpdatingAvatar || !selectedFile}>
                                    {isUpdatingAvatar ? 'Updating...' : 'Update Avatar'}
                                </Button>
                            </form>
                        </Form>
                        <EditProfileButton userId={user!.id} />
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