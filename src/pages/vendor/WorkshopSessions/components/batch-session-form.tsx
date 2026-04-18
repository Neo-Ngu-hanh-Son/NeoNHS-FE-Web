import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { workshopSessionSchema, type WorkshopSessionFormData, type CreateWorkshopSessionRequest } from "../types"
import { WorkshopTemplateResponse } from "../../WorkshopTemplates/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { TemplateSelector } from "./template-selector"
import { DateTimePicker } from "./date-time-picker"
import { formatVndCommaAmount, formatDateForApi } from "../utils/formatters"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, TriangleAlert, PlusCircle, Coffee, Trash2 } from "lucide-react"

interface BatchSessionFormProps {
  preselectedDate?: Date
  onBatchSubmit: (data: CreateWorkshopSessionRequest[]) => void
  onCancel: () => void
  submitting?: boolean
  template?: WorkshopTemplateResponse
  externalTemplateId?: string
}

interface TimeBlock {
  id: string
  startTime: Date
  endTime: Date
}

export function BatchSessionForm({
  preselectedDate,
  onBatchSubmit,
  onCancel,
  submitting = false,
  template: externalTemplate,
  externalTemplateId,
}: BatchSessionFormProps) {
  const [priceFieldFocused, setPriceFieldFocused] = useState(false)
  const [priceInputDraft, setPriceInputDraft] = useState("")

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([])
  const [breakMins, setBreakMins] = useState(30)

  const defaultStart = preselectedDate || new Date(Date.now() + 60 * 60 * 1000)
  const form = useForm<WorkshopSessionFormData>({
    resolver: zodResolver(workshopSessionSchema),
    defaultValues: {
      workshopTemplateId: "",
      startTime: defaultStart,
      endTime: new Date(defaultStart.getTime() + 60 * 60 * 1000), // temp
      price: undefined,
      maxParticipants: undefined,
    },
  })

  const activeTemplate = externalTemplate
  const isFree = activeTemplate?.defaultPrice === 0
  const watchedStartTime = form.watch("startTime")

  useEffect(() => {
    if (externalTemplateId) {
      form.setValue("workshopTemplateId", externalTemplateId, { shouldValidate: true })
    }
  }, [externalTemplateId, form])

  // Listen for template changes to default maxParticipants, price, and init blocks
  useEffect(() => {
    if (activeTemplate) {
      form.setValue("price", activeTemplate.defaultPrice || 0)
      if (priceFieldFocused) {
        setPriceInputDraft(String(Math.trunc(activeTemplate.defaultPrice || 0)))
      }
      form.setValue("maxParticipants", activeTemplate.maxParticipants)

      // Initialize the first block when template is chosen
      if (timeBlocks.length === 0) {
        const nextStart = watchedStartTime || defaultStart
        const nextEnd = new Date(nextStart.getTime() + activeTemplate.estimatedDuration * 60000)
        setTimeBlocks([{ id: Math.random().toString(), startTime: nextStart, endTime: nextEnd }])
      }
    }
  }, [activeTemplate, form])

  // Ensure first block offsets if the base start time picker changes
  const handleBaseStartTimeChange = (date: Date | undefined) => {
    if (!date) return
    form.setValue("startTime", date)
    if (timeBlocks.length > 0 && activeTemplate) {
      const diff = date.getTime() - timeBlocks[0].startTime.getTime()
      if (diff !== 0) {
        setTimeBlocks(prev => prev.map(b => ({
          ...b,
          startTime: new Date(b.startTime.getTime() + diff),
          endTime: new Date(b.endTime.getTime() + diff)
        })))
      }
    }
  }

  const addNextBlock = () => {
    if (!activeTemplate || timeBlocks.length === 0) return
    const lastBlock = timeBlocks[timeBlocks.length - 1]
    const nextStart = new Date(lastBlock.endTime)
    const nextEnd = new Date(nextStart.getTime() + activeTemplate.estimatedDuration * 60000)
    setTimeBlocks([...timeBlocks, { id: Math.random().toString(), startTime: nextStart, endTime: nextEnd }])
  }

  const addBreak = () => {
    if (!activeTemplate || timeBlocks.length === 0) return
    const lastBlock = timeBlocks[timeBlocks.length - 1]
    const nextStart = new Date(lastBlock.endTime.getTime() + breakMins * 60000)
    const nextEnd = new Date(nextStart.getTime() + activeTemplate.estimatedDuration * 60000)
    setTimeBlocks([...timeBlocks, { id: Math.random().toString(), startTime: nextStart, endTime: nextEnd }])
  }

  const removeBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter(b => b.id !== id))
  }

  const handleCustomSubmit = () => {
    // We bypass react-hook-form handleSubmit because Batch mode drives purely off `timeBlocks`
    // and ghost fields like `endTime` might fail Zod's internal validation silently.

    // Check required template explicitly
    const templateId = form.getValues("workshopTemplateId") || externalTemplateId
    if (!templateId) {
      form.setError("workshopTemplateId", { type: "manual", message: "Vui lòng chọn mẫu Workshop" })
      return
    }

    if (timeBlocks.length === 0) return

    const rawPrice = form.getValues("price")
    const finalPrice = isFree ? 0 : rawPrice

    const maxParts = form.getValues("maxParticipants")

    const batchData: CreateWorkshopSessionRequest[] = timeBlocks.map(block => ({
      workshopTemplateId: templateId,
      startTime: formatDateForApi(block.startTime),
      endTime: formatDateForApi(block.endTime),
      price: finalPrice,
      maxParticipants: maxParts
    }))
    onBatchSubmit(batchData)
  }

  const minDate = new Date()
  const watchedPrice = form.watch("price")
  const watchedMaxParticipants = form.watch("maxParticipants")

  const priceExceedsTemplate = activeTemplate && !isFree && watchedPrice != null && watchedPrice > activeTemplate.defaultPrice
  const participantsExceedsTemplate = activeTemplate && watchedMaxParticipants != null && watchedMaxParticipants > activeTemplate.maxParticipants

  return (
    <Form {...form}>
      <form onSubmit={(e) => { e.preventDefault(); handleCustomSubmit(); }} className="space-y-6">
        {/* Date and Time Section */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Chuỗi Lịch Trình (Nhiều Phiên)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      label="Thời Gian Bắt Đầu Chuỗi"
                      value={field.value}
                      onChange={handleBaseStartTimeChange}
                      error={form.formState.errors.startTime?.message}
                      minDate={minDate}
                      required
                    />
                  </FormControl>
                  <FormDescription>Đổi thời gian này sẽ dịch chuyển toàn bộ chuỗi phiên bên dưới.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <Alert className="bg-indigo-50 border-indigo-100 text-indigo-800 py-3">
              <Info className="w-4 h-4 text-indigo-600" />
              <AlertDescription className="text-xs">
                Chế độ này giúp bạn tạo nhanh nhiều phiên liên tiếp. Thời lượng cho mỗi phiên luôn bám sát theo cấu hình ({activeTemplate?.estimatedDuration || '...'} phút).
              </AlertDescription>
            </Alert>

            <div className="space-y-3 mt-4 overflow-y-auto max-h-[30vh] custom-scrollbar pr-2">
              {timeBlocks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 bg-slate-50 border border-dashed rounded-lg">
                  Vui lòng chọn Mẫu Workshop để khởi tạo lịch trình
                </p>
              )}
              {timeBlocks.map((block, index) => (
                <div key={block.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3 pr-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bắt đầu</p>
                      <p className="font-medium text-sm">{block.startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {block.startTime.toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Kết thúc</p>
                      <p className="font-medium text-sm">{block.endTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {block.endTime.toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeBlock(block.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 flex-col sm:flex-row">
              <Button type="button" variant="outline" className="gap-2 flex-1 border-dashed" onClick={addNextBlock} disabled={!activeTemplate || timeBlocks.length === 0}>
                <PlusCircle className="w-4 h-4" /> Thêm phiên nối tiếp
              </Button>
              <div className="flex gap-1 flex-1">
                <Input
                  type="number"
                  value={breakMins}
                  onChange={(e) => setBreakMins(Number(e.target.value) || 0)}
                  className="w-16 h-full text-center"
                  min={5}
                  placeholder="Phút"
                  disabled={!activeTemplate || timeBlocks.length === 0}
                />
                <Button type="button" variant="outline" className="gap-2 flex-1 border-dashed text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200" onClick={addBreak} disabled={!activeTemplate || timeBlocks.length === 0}>
                  <Coffee className="w-4 h-4" /> Thêm khoảng nghỉ
                </Button>
              </div>
            </div>
          </div>
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
                  <FormLabel>Số người tham gia tối đa</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="1"
                      {...field}
                      value={field.value || ''}
                      onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    {activeTemplate && `Mặc định theo mẫu gốc: ${activeTemplate.maxParticipants}`}
                  </FormDescription>
                  {participantsExceedsTemplate && (
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

          {isFree && (
            <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 py-2">
              <Info className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800 font-medium text-sm">
                Đã chọn Workshop Miễn Phí. Tất cả các phiên sinh ra sẽ có giá 0đ.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" disabled={submitting || priceExceedsTemplate || participantsExceedsTemplate || timeBlocks.length === 0}>
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              `Tạo ${timeBlocks.length} Phiên Mới`
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
