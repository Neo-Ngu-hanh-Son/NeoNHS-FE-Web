import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlogForm } from '@/contexts/Blog/BlogFormContext';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from '@/components/blog/type';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button, Input } from '@/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, CirclePlus } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useCallback, useState } from 'react';
import { BlogCategoryRequest } from '@/types/blog';
import BlogCategoryForm, { BlogCategoryFormErrors } from '@/components/blog-categories/BlogCategoryForm';
import blogCategoryService from '@/services/api/blogCategoryService';
import { message } from 'antd';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { useBlogCategories } from '@/hooks/blog/useBlogCategories';

export default function BlogCategorySection({ form }: { form: UseFormReturn<z.infer<typeof formSchema>> }) {
  const { categories, fetchAllCategories } = useBlogCategories();
  const [formValues, setFormValues] = useState<BlogCategoryRequest>({
    name: '',
    description: '',
    status: 'ACTIVE',
  });
  const [formErrors, setFormErrors] = useState<BlogCategoryFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [openPopover, setOpenPopover] = useState(false);

  /* ── Form field handler ── */
  const handleFieldChange = useCallback((field: keyof BlogCategoryRequest, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  /* ── Validation ── */
  const validate = useCallback((): boolean => {
    const errors: BlogCategoryFormErrors = {};
    const name = formValues.name.trim();

    if (!name) {
      errors.name = 'Please enter a category name';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (name.length > 100) {
      errors.name = 'Name must be at most 100 characters';
    }

    if (formValues.description && formValues.description.length > 500) {
      errors.description = 'Description must be at most 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  function onCategoryCreationSuccess() {
    setIsCreatingCategory(false);
    // Reset form values and errors when toggling
    setFormValues({
      name: '',
      description: '',
      status: 'ACTIVE',
    });
    setFormErrors({});
    // Refetch categories to include the newly created one
    fetchAllCategories();
  }

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload: BlogCategoryRequest = {
        name: formValues.name.trim(),
        description: formValues.description?.trim() || undefined,
        status: formValues.status,
      };

      await blogCategoryService.createCategory(payload);
      messageApi.success('Blog category created successfully!');
      onCategoryCreationSuccess();
    } catch (error: unknown) {
      messageApi.error(getApiErrorMessage(error, 'Failed to create blog category. Please try again.'));
    } finally {
      setSubmitting(false);
      setIsCreatingCategory(false);
    }
  };

  function toggleCreateCategory() {
    console.log('Toggling create category form. Current state:', isCreatingCategory);
    setIsCreatingCategory((prev) => !prev);
    // Reset form values and errors when toggling
    setFormValues({
      name: '',
      description: '',
      status: 'ACTIVE',
    });
    setFormErrors({});
  }

  return (
    <Card>
      {contextHolder}
      <CardHeader>
        <CardTitle>Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category">Blog Category</FieldLabel>

                <Popover onOpenChange={setOpenPopover} open={openPopover} aria-expanded={open}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-full justify-between font-normal',
                        !field.value && 'text-muted-foreground',
                        fieldState.invalid && 'border-destructive',
                      )}
                    >
                      {field.value ? categories.find((cat) => cat.id === field.value)?.name : 'Select category...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandList>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              toggleCreateCategory();
                              setOpenPopover(false);
                            }}
                            className="cursor-pointer"
                          >
                            <CirclePlus />
                            Create new category
                          </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((cat) => (
                            <CommandItem
                              key={cat.id}
                              value={cat.name} // Command uses this for searching
                              onSelect={() => {
                                field.onChange(cat.id);
                                setOpenPopover(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn('mr-2 h-4 w-4', cat.id === field.value ? 'opacity-100' : 'opacity-0')}
                              />
                              {cat.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
        {isCreatingCategory && (
          <>
            <h1 className="text-xl font-semibold">Create new category</h1>
            <BlogCategoryForm
              mode="create"
              values={formValues}
              errors={formErrors}
              onChange={handleFieldChange}
              onSubmit={handleCreate}
              isIndependent={true}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
