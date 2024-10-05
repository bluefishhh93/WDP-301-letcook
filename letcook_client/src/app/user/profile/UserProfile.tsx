'use client'
import { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import EditProfileButton from "./EditProfileButton";
import { signIn, useSession } from "next-auth/react";
import { Upload } from "lucide-react";
import { revalidatePath } from "next/cache";
import useProfile from "@/hooks/useProfile";

type Section = 'posts' | 'my-recipes' | 'saved-recipes';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const formSchema = z.object({
    image: z
        .custom<File>((v) => v instanceof File, {
            message: "Please upload a file",
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            'Only .jpg, .png, .webp and .gif formats are supported.'
        )
        .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const UserProfile = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [activeSection, setActiveSection] = useState<Section>('posts');
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const { data: session, update } = useSession();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { profile } = useProfile(user?.id || '');

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
        if (!user || !data.image) return;

        setIsUpdatingAvatar(true);
        const formData = new FormData();
        formData.append('file', data.image);

        try {
            const response = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image');
            }

            const { url } = await response.json();
            const res = await UserService.updateProfile(user.id, { avatar: url });
            update({ ...session, user: { ...session?.user, avatar: url } });
            revalidatePath('/user');
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

    const handleUploadButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file);
            form.handleSubmit(onSubmit)();
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
                    <div className="relative">
                        <Avatar className="w-20 h-20">
                            <AvatarImage
                                src={profile?.avatar}
                                alt="avatar"
                                className="rounded-full object-cover"
                            />
                            <AvatarFallback>
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            type="button"
                            className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-yellow-400 p-2 text-white shadow-lg ring-1 ring-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            onClick={handleUploadButtonClick}
                        >
                            <Upload size={16} />
                        </button>
                    </div>
                    <div className="space-y-1">
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
                                                    onChange={handleFileChange}
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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