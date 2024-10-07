import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { useAvatar } from '@/context/avatar-context';
import { useProfileContext } from '@/context/profile-context';
import { uploadImageToCloudinary, updateUserProfile } from '@/services/user.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const formSchema = z.object({
  image: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Please upload exactly one image.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .png, .webp and .gif formats are supported.'
    )
    .transform(files => files[0])
});

type FormValues = z.infer<typeof formSchema>;

export function useAvatarUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { data: session } = useSession();
  const { updateAvatar } = useAvatar();
  const { updateProfileData } = useProfileContext();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!session?.user?.id) {
      form.setError('image', { type: 'manual', message: 'User not authenticated' });
      return;
    }

    setIsUploading(true);
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(data.image);
      await updateUserProfile(session.user.id, { avatar: cloudinaryUrl });
      updateAvatar(cloudinaryUrl);
      updateProfileData(session.user.id, { avatar: cloudinaryUrl });
      form.reset();
    } catch (error) {
      console.error('Error updating avatar:', error);
      form.setError('image', { 
        type: 'manual', 
        message: error instanceof Error ? error.message : 'Failed to update avatar'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { form, isUploading, handleSubmit };
}