import React from 'react';
import { useAvatarUpload } from '@/hooks/use-avatar-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function AvatarUploadForm() {
  const { form, isUploading, handleSubmit } = useAvatarUpload();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                  {...rest}
                />
              </FormControl>
              {value && <p className="text-sm text-gray-500 mt-2">Selected file: {value.name}</p>}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Update Profile Picture'}
        </Button>
      </form>
    </Form>
  );
}