'use client';

import { useState } from 'react';
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
import useUploadFile from '@/hooks/useUploadFile';
import { toast } from 'react-toastify';
import axios from '@/lib/axios';
import { User, UserInfo } from 'CustomTypes';

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

export default function FormPost({ user }: FormPostProps) {
  const { InputFile, filePath } = useUploadFile('post');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      content: '',
      userId: '',
      image: filePath,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      data.userId = user.id;
      const res = await axios.post('/api/post', data);
      if (res.status === 201) {
        toast.success('Post successfully added');
        form.reset();
      }
    } catch (error) {
      toast.error('Error adding post');
    } finally {
      setIsSubmitting(false);
    }
  };
  // const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });
  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-5 overflow-y-auto"
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
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
                <InputFile
                  onChange={(filePath: string) => {
                    field.onChange(filePath);
                  }}
                />
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
                {/* <Textarea
                  {...field}
                  placeholder="content"
                  className="resize-y h-max-80 overflow-auto h-60"
                /> */}
                <div className="h-100">
                  <Editor value={field.value} onChange={field.onChange} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="pt-7"></div>
        <Separator />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
