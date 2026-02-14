import { BlogFormProvider, useBlogForm } from "@/contexts/Blog/BlogFormContext";
import BlogFormHeader from "@/pages/admin/blog/components/BlogFormHeader";
import BlogDetails from "@/pages/admin/blog/components/BlogDetails";
import BlogEditorSection from "@/pages/admin/blog/components/BlogEditorSection";
import BlogPublishing from "@/pages/admin/blog/components/BlogPublishing";
import BlogCategory from "@/pages/admin/blog/components/BlogCategory";
import BlogTags from "@/pages/admin/blog/components/BlogTags";
import BlogMedia from "@/pages/admin/blog/components/BlogMedia";
import { useRef, useState } from "react";
import { BlogEditorRef, EditorSaveResult, formSchema } from "@/components/blog/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { message } from "antd";
import { BlogStatus } from "@/types/blog";

function BlogCreationPageInner() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      summary: "",
      contentJSON: "",
      contentHTML: "",
      status: BlogStatus.DRAFT,
      isFeatured: false,
      categoryId: "",
      tags: [],
    },
  });

  const editorRef = useRef<BlogEditorRef>(null);

  const handleSaveEditorState = async (content: EditorSaveResult) => {
    console.log(content);
  };

  function submitHandler(data: z.infer<typeof formSchema>) {
    message.info("Form submitted!");
    console.log("Form data: ", data);
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl">
      <BlogFormHeader form={form} onSubmit={submitHandler} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <BlogDetails form={form} />
          <BlogEditorSection editorRef={editorRef} handleSave={handleSaveEditorState} />
        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-6">
          <BlogPublishing />
          <BlogMedia />
          <BlogCategory />
          <BlogTags />
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
