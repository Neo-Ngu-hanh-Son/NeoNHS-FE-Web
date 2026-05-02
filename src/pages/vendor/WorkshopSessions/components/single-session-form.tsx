import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { workshopSessionSchema, type WorkshopSessionFormData, type WorkshopSessionResponse } from "../types"
import { WorkshopTemplateResponse } from "../../WorkshopTemplates/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { TemplateSelector } from "./template-selector"
import { DateTimePicker } from "./date-time-picker"
import { formatDuration } from "../../WorkshopTemplates/utils/formatters"
import { formatVndCommaAmount, parseSessionInstant } from "../utils/formatters"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, TriangleAlert } from "lucide-react"

interface SingleSessionFormProps {
  defaultValues?: WorkshopSessionResponse
  preselectedDate?: Date
  onSubmit: (data: WorkshopSessionFormData) => void
  onCancel: () => void
  isEditing?: boolean
  submitting?: boolean
  template?: WorkshopTemplateResponse
  externalTemplateId?: string
}

export function SingleSessionForm({
  defaultValues,
  preselectedDate,
  onSubmit,
  onCancel,
  isEditing = false,
  submitting = false,
  template: externalTemplate,
  externalTemplateId,
}: SingleSessionFormProps) {
  const [priceFieldFocused, setPriceFieldFocused] = useState(false)
  const [priceInputDraft, setPriceInputDraft] = useState("")

  const form = useForm<WorkshopSessionFormData>({
    resolver: zodResolver(workshopSessionSchema),
    defaultValues: defaultValues
      ? {
        workshopTemplateId: defaultValues.workshopTemplate.id,
        startTime: parseSessionInstant(defaultValues.startTime),
        endTime: parseSessionInstant(defaultValues.endTime),
        price: defaultValues.price || 0,
        maxParticipants: defaultValues.maxParticipants,
      }
      : (() => {
        const start = preselectedDate || new Date(Date.now() + 60 * 60 * 1000);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        return {
          workshopTemplateId: "",
          startTime: start,
          endTime: end,
          price: undefined,
          maxParticipants: undefined,
        };
      })(),
  })

  const activeTemplate = externalTemplate
  const watchedStartTime = form.watch("startTime")
  const watchedEndTime = form.watch("endTime")
  const isFree = activeTemplate?.defaultPrice === 0

  useEffect(() => {
    if (externalTemplateId) {
      form.setValue("workshopTemplateId", externalTemplateId, { shouldValidate: true })
    }
  }, [externalTemplateId, form])

  // Calculate duration discrepancy for warning
  const durationDiffMins = watchedStartTime && watchedEndTime
    ? Math.round((watchedEndTime.getTime() - watchedStartTime.getTime()) / 60000)
    : 0
  const durationMismatch = activeTemplate && Math.abs(durationDiffMins - activeTemplate.estimatedDuration) > 5

  // Auto-calculate single end time when template is loaded or startTime changes
  useEffect(() => {
    if (!activeTemplate || !watchedStartTime) return
    const endTime = new Date(watchedStartTime.getTime() + activeTemplate.estimatedDuration * 60 * 1000)
    form.setValue("endTime", endTime, { shouldValidate: true })
  }, [activeTemplate, watchedStartTime, form])

  // Listen for template changes to default maxParticipants and price
  useEffect(() => {
    if (activeTemplate && !isEditing) {
      form.setValue("price", activeTemplate.defaultPrice || 0)
      if (priceFieldFocused) {
        setPriceInputDraft(String(Math.trunc(activeTemplate.defaultPrice || 0)))
      }
      form.setValue("maxParticipants", activeTemplate.maxParticipants)

      const startTime = form.getValues("startTime")
      if (startTime) {
        const endTime = new Date(startTime.getTime() + activeTemplate.estimatedDuration * 60 * 1000)
        form.setValue("endTime", endTime, { shouldValidate: true })
      }
    }
  }, [activeTemplate, isEditing, form])

  const handleCustomSubmit = (data: WorkshopSessionFormData) => {
    const finalPrice = isFree ? 0 : data.price
    console.log("Submitting Single Session Data:", { ...data, price: finalPrice })
    onSubmit({
      ...data,
      price: finalPrice
    })
  }

  const currentEnrollments = defaultValues?.currentEnrollments || 0
  const minDate = new Date()

  const watchedPrice = form.watch("price")
  const watchedMaxParticipants = form.watch("maxParticipants")

  const priceExceedsTemplate = activeTemplate && !isFree && watchedPrice != null && watchedPrice > activeTemplate.defaultPrice
  const participantsExceedsTemplate = activeTemplate && watchedMaxParticipants != null && watchedMaxParticipants > activeTemplate.maxParticipants

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCustomSubmit, (errors) => console.log('Single Session Form Errors:', errors))} className="space-y-6">
        {isEditing && defaultValues && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Mẫu Workshop:</strong> {defaultValues.workshopTemplate.name} (đã khóa - không thể thay đổi)
            </AlertDescription>
          </Alert>
        )}

        {/* Date and Time Section */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Lịch Trình Đơn (Một Phiên)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      label="Ngày & Giờ Bắt Đầu"
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.startTime?.message}
                      minDate={minDate}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      label="Ngày & Giờ Kết Thúc"
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.endTime?.message}
                      minDate={form.watch("startTime")}
                      required
                    />
                  </FormControl>
                  <FormDescription>
                    {activeTemplate && `Thời lượng mẫu gốc: ${formatDuration(activeTemplate.estimatedDuration)}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {durationMismatch && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 py-2">
              <AlertDescription className="text-amber-800 dark:text-amber-300 font-medium text-xs">
                <p>
                  <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium">Lưu ý:</span> Thời lượng phiên này ({formatDuration(durationDiffMins)}) đang chênh lệch so với thời lượng tiêu chuẩn ({formatDuration(activeTemplate.estimatedDuration)}).
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Pricing and Capacity Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 text-slate-800 dark:text-slate-200">Giá & Số lượng</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isFree && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => {
                  const blurredValue = field.value != null && !Number.isNaN(field.value as number)
                    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(field.value as number)
                    : ""

                  return (
                    <FormItem>
                      <FormLabel>Giá Phiên (VNĐ)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            placeholder="1,000"
                            disabled={submitting}
                            className="pr-14"
                            name={field.name}
                            ref={field.ref}
                            value={priceFieldFocused ? priceInputDraft : blurredValue}
                            onFocus={() => {
                              setPriceFieldFocused(true)
                              const v = form.getValues("price")
                              setPriceInputDraft(v != null && !Number.isNaN(v) ? String(Math.trunc(v)) : "")
                            }}
                            onBlur={() => {
                              setPriceFieldFocused(false)
                              field.onBlur()
                            }}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, "")
                              setPriceInputDraft(digits)
                              if (digits === "") {
                                field.onChange(undefined)
                                return
                              }
                              const n = parseInt(digits, 10)
                              if (!Number.isNaN(n)) field.onChange(n)
                            }}
                          />
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">VND</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {activeTemplate && `Mặc định theo mẫu gốc: ${formatVndCommaAmount(activeTemplate.defaultPrice)}`}
                      </FormDescription>
                      {priceExceedsTemplate && (
                        <p className="text-sm font-medium text-amber-600 flex items-center gap-1.5 mt-1">
                          <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                          Lưu ý: Giá cao hơn mẫu gốc ({formatVndCommaAmount(activeTemplate!.defaultPrice)})
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            )}

            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng người tham gia tối đa</FormLabel>
                  <FormControl>
                    <Input
                      type={field.value === 999999 ? "text" : "number"}
                      min={field.value === 999999 ? undefined : (isEditing ? currentEnrollments : 1)}
                      placeholder="1"
                      {...field}
                      readOnly={field.value === 999999}
                      className={field.value === 999999 ? "bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed" : ""}
                      value={field.value === 999999 ? "Không giới hạn" : (field.value || '')}
                      onChange={e => {
                        if (field.value === 999999) return;
                        field.onChange(parseInt(e.target.value) || undefined);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {activeTemplate && `Mặc định theo mẫu gốc: ${activeTemplate.maxParticipants === 999999 ? 'Không giới hạn' : activeTemplate.maxParticipants}`}
                    {isEditing && currentEnrollments > 0 && ` | Đã tham gia thực tế: ${currentEnrollments}`}
                  </FormDescription>
                  {participantsExceedsTemplate && activeTemplate?.maxParticipants !== 999999 && (
                    <p className="text-sm font-medium text-amber-600 flex items-center gap-1.5 mt-1">
                      <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                      Lưu ý: Vượt giới hạn mẫu gốc ({activeTemplate!.maxParticipants} người)
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditing && currentEnrollments > 0 && (
            <Alert className="border-amber-200 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                ⚠️ Phiên này đã có {currentEnrollments} người đăng ký. Bạn không thể giảm số lượng tối đa thấp hơn mức này.
              </AlertDescription>
            </Alert>
          )}

          {isFree && (
            <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 py-3 px-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-emerald-600 shrink-0" />
                <AlertDescription className="text-emerald-800 font-medium text-sm m-0">
                  Đã chọn Workshop Miễn Phí.
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" disabled={submitting || priceExceedsTemplate || participantsExceedsTemplate}>
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? "Đang lưu..." : "Đang tạo..."}
              </>
            ) : (
              isEditing ? "Lưu Thay Đổi" : "Tạo Mới 1 Phiên"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
