import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogStatus } from "@/types/blog";
import { z } from "zod";
import { formSchema } from "@/components/blog/type";
import { UseFormReturn } from "react-hook-form";
import { message } from "antd";
import { Spinner } from "@/components/ui/spinner";

export default function BlogFormHeaderSection({
  form,
  onSubmit,
  submitting,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  submitting: boolean;
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const handlePublish = form.handleSubmit(
    (data) => {
      //console.log("Blog form submit: ", data);
      onSubmit(data);
    },
    (errors) => {
      messageApi.error("Biểu mẫu còn lỗi. Vui lòng sửa trước khi gửi.");
      //console.log("Blog form error: ", errors);
    },
  );

  const isPublished = form.getValues("status") === BlogStatus.PUBLISHED;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tạo bài blog mới</h1>
          <p className="text-muted-foreground">Soạn thảo và xuất bản bài viết mới.</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={handlePublish} disabled={form.formState.isSubmitting || submitting}>
          {form.formState.isSubmitting || submitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isPublished ? "Xuất bản" : "Lưu bài viết"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
