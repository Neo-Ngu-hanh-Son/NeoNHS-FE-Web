/**
 * BlogEditPage
 * Admin page for editing an existing blog post.
 * Reuses the same form components as BlogCreationPage.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { message } from 'antd';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useRef } from 'react';

import { BlogFormProvider, useBlogForm } from '@/contexts/Blog/BlogFormContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import BlogDetailsSection from '@/components/blog/creationForm/BlogDetailsSection';
import BlogEditorSection from '@/components/blog/creationForm/BlogEditorSection';
import BlogPublishingSection from '@/components/blog/creationForm/BlogPublishingSection';
import BlogCategorySection from '@/components/blog/creationForm/BlogCategorySection';
import BlogTagsSection from '@/components/blog/creationForm/BlogTagsSection';
import BlogMediaSection from '@/components/blog/creationForm/BlogMediaSection';

import { blogService } from '@/services/api/blogService';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { BlogStatus } from '@/types/blog';
import type { BlogResponse } from '@/types/blog';
import { BlogEditorRef, EditorSaveResult, BlogFormSchema } from '@/components/blog/type';
import { Spinner } from '@/components/ui/spinner';

function BlogEditPageInner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editorRef = useRef<BlogEditorRef>(null);

  const [blog, setBlog] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof BlogFormSchema>>({
    resolver: zodResolver(BlogFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      contentJSON: '',
      contentHTML: '',
      status: BlogStatus.DRAFT,
      isFeatured: false,
      categoryId: '',
      tags: '',
      thumbnailUrl: '',
      bannerUrl: '',
    },
  });

  // Fetch existing blog data
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await blogService.getBlogById(id);
        console.log('Fetched blog data: ', res);
        if (res.data) {
          const b = res.data;
          setBlog(b);
          form.reset({
            title: b.title ?? '',
            slug: b.slug ?? '',
            summary: b.summary ?? '',
            contentJSON: b.contentJSON ?? '',
            contentHTML: b.contentHTML ?? '',
            status: b.status ?? BlogStatus.DRAFT,
            isFeatured: b.isFeatured ?? false,
            categoryId: b.blogCategory?.id ?? '',
            tags: b.tags ?? '',
            thumbnailUrl: b.thumbnailUrl ?? '',
            bannerUrl: b.bannerUrl ?? '',
          });
        } else {
          message.error(res.message || 'Không tìm thấy bài viết, đang chuyển hướng...', 5, () => {
            navigate('/admin/blog');
          });
        }
      } catch (err: unknown) {
        message.error(getApiErrorMessage(err, 'Không thể tải bài viết, đang chuyển hướng...'), 5, () => {
          navigate('/admin/blog');
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate, form]);

  const handleSaveEditorState = async (content: EditorSaveResult) => {
    if (!id) return;

    if (content.charCount < 30) {
      message.warning('Nội dung bài viết phải có ít nhất 30 ký tự');
      return;
    }

    setSubmitting(true);

    const formData = form.getValues();
    const payload = {
      ...formData,
      contentJSON: content.lexicalJSON,
      contentHTML: content.html,
      blogCategoryId: formData.categoryId,
    };

    try {
      const res = await blogService.updateBlog(id, payload);
      if (res.success || res.data) {
        message.success('Cập nhật bài viết thành công!');
        navigate('/admin/blog');
      } else {
        message.error(res.message || 'Cập nhật bài viết thất bại');
      }
    } catch (err: unknown) {
      message.error(getApiErrorMessage(err, 'Đã xảy ra lỗi khi cập nhật bài viết'));
    } finally {
      setSubmitting(false);
    }
  };

  function submitHandler(_data: z.infer<typeof BlogFormSchema>) {
    if (editorRef.current) {
      editorRef.current.save();
    } else {
      message.error('Trình soạn thảo chưa sẵn sàng');
    }
  }

  const handlePublish = form.handleSubmit(
    (data) => submitHandler(data),
    (errors) => {
      console.log('Blog form validation errors:', errors);
    },
  );

  const isPublished = form.watch('status') === BlogStatus.PUBLISHED;

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài viết</h1>
            <p className="text-muted-foreground">Đang chỉnh sửa: {blog?.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handlePublish} disabled={submitting}>
            {submitting ? (
              <>
                <Spinner className="h-4 w-4 animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isPublished ? 'Xuất bản' : 'Lưu bài viết'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <BlogDetailsSection form={form} />
          <BlogEditorSection
            editorRef={editorRef}
            handleSave={handleSaveEditorState}
            form={form}
            editorPrestateJSON={blog?.contentJSON}
          />
        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-6">
          <BlogPublishingSection form={form} isCreating={false} />
          <BlogMediaSection form={form} />
          <BlogCategorySection form={form} />
          <BlogTagsSection form={form} />
        </div>
      </div>
    </div>
  );
}

export default function BlogEditPage() {
  return (
    <BlogFormProvider>
      <BlogEditPageInner />
    </BlogFormProvider>
  );
}
