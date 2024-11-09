'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import axios from '@/lib/axios';
import { User, UserInfo } from 'CustomTypes';
import { ImageUploader } from '@/utils/image-upload';
import { io } from 'socket.io-client';
import env from '@/utils/env';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface FormValues {
  title: string;
  content: string;
  userId: string;
  image: string;
}

interface FormPostProps {
  user: User & UserInfo;
}

const socket = io(env.NEXT_PUBLIC_SOCKET_URL); // Thay 'your-server-url' bằng URL của server

export default function FormPost({ user }: FormPostProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      content: '',
      userId: '',
      image: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      data.userId = user.id;
      data.image = imageUrl;

      const res = await axios.post('/api/post', data);
      if (res.status === 201) {
        toast.success('Post successfully added');
        form.reset();
        setImageUrl('');

        // Gửi thông báo đến những người theo dõi qua socket
        const notificationData = {
          userId: user.id,
          title: 'New Post Created',
          content: `Your friend has created a new post: "${data.title}"`,
          postId: res.data.post._id,
        };
        console.log("notification", notificationData);

        // Gửi thông báo qua socket
        socket.emit('createNotification', notificationData);
        toast.success('Notification sent to followers');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    form.setValue('image', url);
  };

  useEffect(() => {
    // Đăng ký người dùng
    socket.emit('register', user.id);

    // Xử lý thông báo khi được tạo
    socket.on('notificationCreated', (notification) => {
      console.log('Notification created:', notification);
    });

    // Cleanup: Ngắt kết nối khi component unmount
    return () => {
      socket.disconnect();
    };
  }, [user.id]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-5 overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Please enter your post title.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div>
                  <ImageUploader
                    onUploadSuccess={handleImageUploadSuccess}
                    folder="post_images"
                  />
                  {imageUrl && (
                    <img src={imageUrl} alt="Uploaded" className="mt-2 max-w-xs" />
                  )}
                </div>
              </FormControl>
              <FormDescription>This is your post thumbnail.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <div className="h-100">
                  <Editor value={field.value} onChange={field.onChange} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="pt-7"></div>
        <Separator />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
