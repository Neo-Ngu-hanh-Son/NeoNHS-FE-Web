import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogEditor from "@/components/blog/BlogEditor";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { BlogEditorRef, EditorSaveResult } from "@/components/blog/type";
import { Ref } from "react";
import { message, notification } from "antd";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/components/blog/type";

interface BlogEditorSectionProps {
  editorRef: Ref<BlogEditorRef>;
  handleSave: (content: EditorSaveResult) => Promise<void>;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  editorPrestateJSON?: string;
}

export default function BlogEditorSection({ editorRef, handleSave, editorPrestateJSON }: BlogEditorSectionProps) {
  const [messageApi] = message.useMessage();

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    try {
      const resultUrl = await uploadImageToCloudinary(file);
      //console.log("Result url: " + resultUrl);
      if (!resultUrl) {
        messageApi.error("Tải ảnh lên thất bại, vui lòng thử lại");
      }
      return resultUrl || "";
    } catch (error) {
      //console.error("[BlogEditorSection] Error uploading image:", error);
      messageApi.error("Tải ảnh lên thất bại, vui lòng thử lại");
      return "";
    }
  };

  return (
    <>
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader>
          <CardTitle>Nội dung</CardTitle>
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
