import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogEditor from "@/components/blog/BlogEditor";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { BlogEditorRef, EditorSaveResult } from "@/components/blog/type";
import { Ref } from "react";
import { message, notification } from "antd";
import { Controller, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { z } from "zod";
import { formSchema } from "@/components/blog/type";

interface BlogEditorSectionProps {
  editorRef: Ref<BlogEditorRef>;
  handleSave: (content: EditorSaveResult) => Promise<void>;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  editorPrestateJSON?: string;
}

export default function BlogEditorSection({ editorRef, handleSave, form, editorPrestateJSON }: BlogEditorSectionProps) {
  const [api, contextHolder] = notification.useNotification();

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    try {
      const resultUrl = await uploadImageToCloudinary(file);
      console.log("Result url: " + resultUrl);
      if (!resultUrl) {
        message.error("Error uploading image, please try again");
      }
      return resultUrl || "";
    } catch (error) {
      console.error("[BlogEditorSection] Error uploading image:", error);
      message.error("Error uploading image, please try again");
      return "";
    }
  };

  return (
    <>
      {contextHolder}
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <BlogEditor
            ref={editorRef}
            onSave={handleSave}
            onImageUpload={handleEditorImageUpload}
            initialEditorState={editorPrestateJSON}
          />
        </CardContent>
      </Card>
    </>
  );
}
