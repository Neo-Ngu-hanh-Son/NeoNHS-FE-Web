import { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from '@/components';
import { message } from 'antd';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { MultiQuickCreateValues, multiQuickCreateSchema } from './schemas/QuickCreateFormSchema';
import z from 'zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import { getQuickCreateLanguageOptions } from './quickCreateLanguageUtils';
import { ArrowRight, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import 'flag-icons/css/flag-icons.min.css';
import { cn } from '@/lib/utils';

interface PreviewLanguageTranslationCardProps {
  form: UseFormReturn<z.infer<typeof multiQuickCreateSchema>>;
  onProceed?: (values: MultiQuickCreateValues) => void;
  isGenerating?: boolean; // Prop to trigger the magic effect
}

export default function PreviewLanguageTranslationCard({
  form,
  onProceed,
  isGenerating = false,
}: PreviewLanguageTranslationCardProps) {
  const entries = form.watch('entries');
  const languageOptions = getQuickCreateLanguageOptions();

  // State to track active tab (default to first entry)
  const [activeTab, setActiveTab] = useState<string>(entries[0]?.metadata.language || '');

  const handleProceed = async () => {
    const isValid = await form.trigger('entries');
    if (!isValid) {
      message.warning('Vui lòng kiểm tra lại thông tin bản dịch trước khi tiếp tục');
      return;
    }
    onProceed?.(form.getValues());
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>3. Xem trước và Hiệu chỉnh bản dịch</CardTitle>
            <CardDescription>Tùy chỉnh nội dung đã được Gemini dịch sang các ngôn ngữ khác nhau.</CardDescription>
          </div>
          {entries.length > 0 && (
            <div className="hidden md:block">
              <span className="section-badge-light">
                <Info className="h-4 w-4" />
                {entries.length} bản dịch sẵn sàng
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {!entries.length ? (
          <div className="p-12 text-center text-muted-foreground">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Info className="h-6 w-6" />
            </div>
            <p>Chưa có dữ liệu bản dịch. Hãy hoàn thành bước 2.</p>
          </div>
        ) : (
          <Tabs
            value={activeTab || entries[0]?.metadata.language}
            onValueChange={setActiveTab}
            orientation="vertical"
            className="flex flex-col md:flex-row"
          >
            {/* LEFT SIDEBAR: Tabs List */}
            <TabsList className="flex h-auto w-full flex-row justify-start rounded-none border-b bg-muted/30 p-0 md:w-64 md:flex-col md:border-b-0 md:border-r">
              {entries.map((entry, index) => {
                const langOpt = languageOptions.find((o) => o.code === entry.metadata.language);
                const hasError = !!form.formState.errors.entries?.[index];

                return (
                  <TabsTrigger
                    key={`${entry.metadata.language}-${index}`}
                    value={entry.metadata.language}
                    className="relative flex w-full items-center justify-start gap-3 rounded-none border-b-2 border-transparent px-6 py-4 text-left data-[state=active]:border-primary data-[state=active]:bg-background md:border-b-0 md:border-r-2"
                  >
                    <span className={`fi fi-${langOpt?.countryCode} shrink-0 shadow-sm`} />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold uppercase">{langOpt?.label}</span>
                      <span className="truncate text-xs text-muted-foreground">{entry.metadata.voiceName}</span>
                    </div>
                    {hasError && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* RIGHT SIDE: Content Area */}
            <div className="flex-1 p-6">
              {entries.map((entry, index) => (
                <TabsContent
                  key={entry.metadata.language}
                  value={entry.metadata.language}
                  className="m-0 focus-visible:ring-0"
                >
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between border-b pb-4">
                      <h4 className="text-lg font-bold text-primary">
                        Biên tập: {languageOptions.find((o) => o.code === entry.metadata.language)?.label}
                      </h4>
                    </div>

                    <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Controller
                        control={form.control}
                        name={`entries.${index}.title` as const}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Tiêu đề ({entry.metadata.language})</FieldLabel>
                            <Input {...field} placeholder="Nhập tiêu đề đã dịch" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name={`entries.${index}.artist` as const}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Tác giả hiển thị</FieldLabel>
                            <Input {...field} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </FieldGroup>

                    <Controller
                      control={form.control}
                      name={`entries.${index}.script` as const}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Kịch bản</FieldLabel>
                          <InputGroup>
                            <InputGroupTextarea {...field} rows={10} className="min-h-[250px] resize-none" />
                            <InputGroupAddon align="block-end">
                              <InputGroupText className="tabular-nums">{field.value.length}/2000 kí tự</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/10 p-6">
        <p className="text-xs text-muted-foreground italic">
          Mẹo: Kiểm tra kỹ các từ mượn hoặc tên riêng sau khi AI dịch.
        </p>
        <Button
          type="button"
          onClick={handleProceed}
          disabled={!entries.length || isGenerating}
          className={cn({ isGenerating: 'btn-shimmer' })}
        >
          Xác nhận và Tạo Audio
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
