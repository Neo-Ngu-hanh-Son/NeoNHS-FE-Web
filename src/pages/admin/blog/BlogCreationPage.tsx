import { BlogFormProvider, useBlogForm } from "@/contexts/Blog/BlogFormContext";
import BlogFormHeaderSection from "@/components/blog/creationForm/BlogFormHeaderSection";
import BlogDetailsSection from "@/components/blog/creationForm/BlogDetailsSection";
import BlogEditorSection from "@/components/blog/creationForm/BlogEditorSection";
import BlogPublishingSection from "@/components/blog/creationForm/BlogPublishingSection";
import BlogCategorySection from "@/components/blog/creationForm/BlogCategorySection";
import BlogTagsSection from "@/components/blog/creationForm/BlogTagsSection";
import BlogMediaSection from "@/components/blog/creationForm/BlogMediaSection";
import { useRef, useState } from "react";
import { BlogEditorRef, EditorSaveResult, formSchema } from "@/components/blog/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { message } from "antd";
import { BlogStatus } from "@/types/blog";
import blogService from "@/services/api/blogService";
import { useNavigate } from "react-router-dom";

function BlogCreationPageInner() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      contentJSON: "",
      contentHTML: "",
      status: BlogStatus.DRAFT,
      isFeatured: false,
      categoryId: "",
      tags: "",
      thumbnailUrl: "",
      bannerUrl: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<BlogEditorRef>(null);
  const navigate = useNavigate();
  const handleSaveEditorState = async (content: EditorSaveResult) => {
    console.log("Saving editor state: " + content);
    if (content.charCount < 30) {
      message.warning("Blog content must be at least 30 characters");
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
        message.success("Blog created successfully!");
        navigate("/admin/blog");
      } else {
        message.error(res.message || "Failed to create blog");
      }
    } catch (error) {
      console.error(error);
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  function submitHandler(data: z.infer<typeof formSchema>) {
    if (editorRef.current) {
      console.log("Saving form data: " + data);
      editorRef.current.save();
    } else {
      console.error("Editor ref not found");
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
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
