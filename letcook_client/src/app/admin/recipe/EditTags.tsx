import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multiple-select';
import useAuth from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { callApi } from '@/utils/callApi';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
export default function EditTags({
  recipeId,
  currentTags,
}: {
  recipeId: string;
  currentTags: { name: string }[];
}) {
  const tagsForm = useForm<any>({
    defaultValues: {
      tags: currentTags ? currentTags.map((tag) => tag.name) : [],
    },
  });
  const {user} = useAuth();
  const [listTags, setListTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get('/api/recipe/tag');
        setListTags(res.data);
      } catch (error) { }
    };
    fetchTags();
  }, [recipeId]);


  // const addTagToServer = async (tag: string) => {
  //   try {
  //     const res = await axios.post(`/api/recipe/tag`, { name: tag });
  //     if (res.status === 200) {
  //       return res.data; // assuming the server returns the created tag
  //     }
  //   } catch (error) {
  //     console.error("Failed to add tag", error);
  //     toast.error('Failed to add new tag');
  //   }
  // };

  const onAddNewTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //remove space and not empty
    if (value.trim() === '') return;
    if (event.key === 'Enter') {
      event.preventDefault();
      tagsForm.setValue('tags', [...tagsForm.getValues('tags'), value]);
      listTags.push(value);
      setValue('');
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const res = await callApi({
        url: `/api/recipe/tag/${recipeId}`,
        method: 'POST',
        body: data,
        token: user?.accessToken,
      });
      if (res.status === 200) {
        toast.success('Update tags success');
      }
    } catch (error) {
      toast.error('Update tags failed');
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full hover:bg-secondary pl-2 rounded text-sm h-8 flex items-center justify-start">
          <div>
            Edit tags
          </div>
        </DialogTrigger>
        <DialogContent className="min-h-72 max-h-full">
          <DialogHeader>
            <DialogTitle>Edit Tags</DialogTitle>
            <DialogDescription> </DialogDescription>
          </DialogHeader>
          <Form {...tagsForm}>
            <form
              className="space-y-3 flex flex-col w-full"
              onSubmit={tagsForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={tagsForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel>recipe Tags</FormLabel>
                    <Input
                      type="text"
                      className="w-full"
                      placeholder="Add new tag"
                      onChange={(e) => {
                        setValue(e.target.value);
                      }}
                      value={value}
                      onKeyDown={onAddNewTag}
                    />
                    <FormLabel className="-mt-4">Tags Selected</FormLabel>
                    <MultiSelector
                      values={field.value}
                      onValuesChange={field.onChange}
                    >
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Select tag" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {listTags.map((tag, i) => (
                            <MultiSelectorItem key={i} value={tag}>
                              <span>{tag}</span>
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormItem>
                )}
              />

              <div className="">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
          <div className="h-40"></div>
        </DialogContent>
      </Dialog>
    </>
  );
}
