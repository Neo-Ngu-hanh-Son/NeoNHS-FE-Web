import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { message } from 'antd';
import { Controller, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { blogFormSchema } from '@/components/blog/type';
import { Label } from '@/components/ui/label';
import DragImageUploader from '@/components/common/DragImageUploader';

export default function BlogMediaSection({ form }: { form: UseFormReturn<z.infer<typeof blogFormSchema>> }) {
  const [messageApi] = message.useMessage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Thumbnail */}
        <Controller
          name="thumbnailUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Label className="text-sm">Thumbnail</Label>
              <DragImageUploader
                value={field.value}
                onUpload={field.onChange}
                onError={(msg) => messageApi.error(msg)}
                placeholder="Drag & drop a thumbnail image"
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
              <Label className="text-sm">Banner</Label>
              <DragImageUploader
                value={field.value}
                onUpload={field.onChange}
                onError={(msg) => messageApi.error(msg)}
                placeholder="Drag & drop a banner image"
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
