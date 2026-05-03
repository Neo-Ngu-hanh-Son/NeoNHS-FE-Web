import { BlogFormProvider, useBlogForm } from '@/contexts/Blog/BlogFormContext';
import BlogFormHeaderSection from '@/components/blog/creationForm/BlogFormHeaderSection';
import BlogDetailsSection from '@/components/blog/creationForm/BlogDetailsSection';
import BlogEditorSection from '@/components/blog/creationForm/BlogEditorSection';
import BlogPublishingSection from '@/components/blog/creationForm/BlogPublishingSection';
import BlogCategorySection from '@/components/blog/creationForm/BlogCategorySection';
import BlogTagsSection from '@/components/blog/creationForm/BlogTagsSection';
import BlogMediaSection from '@/components/blog/creationForm/BlogMediaSection';
import { useRef, useState } from 'react';
import { BlogEditorRef, EditorSaveResult, BlogFormSchema } from '@/components/blog/type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { message } from 'antd';
import { BlogStatus } from '@/types/blog';
import blogService from '@/services/api/blogService';
import { useNavigate } from 'react-router-dom';

function BlogCreationPageInner() {
  const [messageApi, contextHolder] = message.useMessage();

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
    mode: 'onBlur',
  });
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<BlogEditorRef>(null);
  const navigate = useNavigate();

  const handleSaveEditorState = async (content: EditorSaveResult) => {
    console.log('Saving editor state: ' + content);
    if (content.charCount < 30) {
      messageApi.warning('Nội dung bài viết phải có ít nhất 30 ký tự');
      return;
    }
    const formData = form.getValues();
    const payload = {
      ...formData,
      contentJSON: content.lexicalJSON,
      contentHTML: content.html,
      blogCategoryId: formData.categoryId,
    };

    try {
      setLoading(true);
      const res = await blogService.createBlog(payload);
      if (res.success || res.data) {
        messageApi.success('Tạo bài viết thành công!');
        navigate('/admin/blog');
      } else {
        messageApi.error(res.message || 'Tạo bài viết thất bại');
      }
    } catch (error) {
      console.error(error);
      messageApi.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  function submitHandler(data: z.infer<typeof BlogFormSchema>) {
    if (editorRef.current) {
      console.log('Saving form data: ' + data);
      editorRef.current.save();
    } else {
      console.error('Editor ref not found');
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      {contextHolder}
      <BlogFormHeaderSection form={form} onSubmit={submitHandler} submitting={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <BlogDetailsSection form={form} />
          <BlogEditorSection editorRef={editorRef} handleSave={handleSaveEditorState} form={form} />
        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-6">
          <BlogPublishingSection form={form} isCreating />
          <BlogMediaSection form={form} />
          <BlogCategorySection form={form} />
          <BlogTagsSection form={form} />
        </div>
      </div>
    </div>
  );
}

export default function BlogCreationPage() {
  return (
    <BlogFormProvider>
      <BlogCreationPageInner />
    </BlogFormProvider>
  );
}
