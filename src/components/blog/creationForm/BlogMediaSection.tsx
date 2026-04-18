import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { message } from "antd";
import { Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/components/blog/type";
import { Label } from "@/components/ui/label";
import DragImageUploader from "@/components/common/DragImageUploader";

export default function BlogMediaSection({ form }: { form: UseFormReturn<z.infer<typeof formSchema>> }) {
  const [messageApi] = message.useMessage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phương tiện</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Thumbnail */}
        <Controller
          name="thumbnailUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Label className="text-sm">Ảnh đại diện</Label>
              <DragImageUploader
                value={field.value}
                onUpload={field.onChange}
                onError={(msg) => messageApi.error(msg)}
                placeholder="Kéo thả ảnh đại diện vào đây"
                minHeight={140}
                imageClassName="object-cover h-[140px]"
              />
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />

        {/* Banner */}
        <Controller
          name="bannerUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Label className="text-sm">Ảnh bìa</Label>
              <DragImageUploader
                value={field.value}
                onUpload={field.onChange}
                onError={(msg) => messageApi.error(msg)}
                placeholder="Kéo thả ảnh bìa vào đây"
                minHeight={120}
                imageClassName="object-cover h-[120px]"
              />
              {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
}
