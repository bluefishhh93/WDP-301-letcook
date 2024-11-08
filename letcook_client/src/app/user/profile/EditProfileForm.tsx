import useAuth from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useEffect } from "react";
import { ToggleContext } from "@/components/interactive-overlay";
import { useToast } from "@/components/ui/use-toast";
import useProfile from "@/hooks/useProfile";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/services/user.service";

//schema
const userSchema = z.object({
    username: z.string().min(1, "Username is required"),
    phone: z.string().nullable().optional()
        .refine(
            (value) => value === null || value === '' || /^\d{10}$/.test(value || ''),
            "Số điện thoại không hợp lệ"
        ),
    address: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
});


type FormValues = z.infer<typeof userSchema>;


export default function EditProfileForm({ token }: { token: string }) {
    const { profile, isLoading, error } = useProfile(token);
    const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: profile?.username || "",
            phone: profile?.phone || "",
            address: profile?.address || "",
            bio: profile?.bio || "",
        }
    });

    useEffect(() => {
        if (profile) {
            form.reset({
                username: profile.username,
                phone: profile.phone,
                address: profile.address,
                bio: profile.bio,
            });
        }
    }, [profile, form]);

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await updateUserProfile(token, data);
            toast({
                title: "Profile updated",
                description: "Your profile has been successfully updated.",
            });
            setIsOverlayOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        }
    }

    if (isLoading) return <div>Loading...</div>;

    
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }

    return(

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 p-6 max-w-lg mx-auto">
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg font-semibold">Username</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="Your username" 
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-2" 
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                    </FormItem>
                )}
            />
            
            <fieldset className="border-t mt-8 pt-6 space-y-6">
                <legend className="text-base font-semibold text-gray-700">Optional Information</legend>

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone (optional)</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Your phone number" 
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-2" 
                                    {...field} 
                                    value={field.value || ''} 
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address (optional)</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder="Your address" 
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-2" 
                                    {...field} 
                                    value={field.value || ''} 
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio (optional)</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Tell us about yourself" 
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-2 h-24 resize-none" 
                                    {...field} 
                                    value={field.value || ''} 
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
            </fieldset>

            <Button 
                type="submit" 
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
            >
                {isLoading ? "Updating..." : "Update Profile"}
            </Button>
            </form>
        </Form>
    )
}