import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogStatus } from "@/types/blog";
import { z } from "zod";
import { formSchema } from "@/components/blog/type";
import { UseFormReturn } from "react-hook-form";

export default function BlogFormHeader({
  form,
  onSubmit,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}) {
  const navigate = useNavigate();
  const handlePublish = form.handleSubmit(
    (data) => {
      console.log("Blog form submit: ", data);
      onSubmit(data);
    },
    (errors) => {
      console.log("Blog form error: ", errors);
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
          <h1 className="text-3xl font-bold tracking-tight">Create New Blog</h1>
          <p className="text-muted-foreground">Draft and publish a new blog post.</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={handlePublish} disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isPublished ? "Publish" : "Save Blog"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
