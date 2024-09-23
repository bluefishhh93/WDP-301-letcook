'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Image from 'next/image';

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
})

type FormValues = z.infer<typeof formSchema>;


export default function UpdateAvatarForm({}) {
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setIsUploading(true);
        const file = data.image[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setUploadedImageUrl(result.url);
            } else {
                const errorData = await response.json();
                console.error('Upload failed:', errorData.error);
                form.setError('image', { type: 'manual', message: errorData.error });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            form.setError('image', { type: 'manual', message: 'Failed to upload image. Please try again.' });
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                    onChange={(e) => field.onChange(e.target.files)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                {uploadedImageUrl && (
                    <div>
                        <p>Uploaded Image:</p>
                        <Image src={uploadedImageUrl} alt="Uploaded" layout="responsive" width={500} height={300} />
                    </div>
                )}
            </form>
        </Form>
    )
}
