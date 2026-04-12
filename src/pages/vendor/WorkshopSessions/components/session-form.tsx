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

interface SessionFormProps {
  defaultValues?: WorkshopSessionResponse
  preselectedDate?: Date
  onSubmit: (data: WorkshopSessionFormData) => void
  onCancel: () => void
  isEditing?: boolean
  submitting?: boolean
  template?: WorkshopTemplateResponse
}

export function SessionForm({
  defaultValues,
  preselectedDate,
  onSubmit,
  onCancel,
  isEditing = false,
  submitting = false,
  template: externalTemplate,
}: SessionFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkshopTemplateResponse | undefined>()
  const [priceFieldFocused, setPriceFieldFocused] = useState(false)
  const [priceInputDraft, setPriceInputDraft] = useState("")
  
  const form = useForm<WorkshopSessionFormData>({
    resolver: zodResolver(workshopSessionSchema),
    defaultValues: defaultValues
      ? {
          workshopTemplateId: defaultValues.workshopTemplate.id,
          startTime: parseSessionInstant(defaultValues.startTime),
          endTime: parseSessionInstant(defaultValues.endTime),
          price: defaultValues.price,
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

  const activeTemplate = selectedTemplate ?? externalTemplate
  const watchedStartTime = form.watch("startTime")

  // Auto-calculate end from template duration when start changes (create + edit)
  useEffect(() => {
    if (!activeTemplate || !watchedStartTime) return
    const endTime = new Date(
      watchedStartTime.getTime() + activeTemplate.estimatedDuration * 60 * 1000,
    )
    form.setValue("endTime", endTime)
  }, [activeTemplate, watchedStartTime, form])

  // Auto-fill price and maxParticipants from template
  const handleTemplateChange = (templateId: string, template: WorkshopTemplateResponse | undefined) => {
    form.setValue("workshopTemplateId", templateId)
    setSelectedTemplate(template)
    
    if (template && !isEditing) {
      // Auto-fill if not editing
      form.setValue("price", template.defaultPrice)
      if (priceFieldFocused) {
        setPriceInputDraft(String(Math.trunc(template.defaultPrice)))
      }
      form.setValue("maxParticipants", template.maxParticipants)
      
      // Auto-calculate end time
      const startTime = form.getValues("startTime")
      if (startTime) {
        const endTime = new Date(startTime.getTime() + template.estimatedDuration * 60 * 1000)
        form.setValue("endTime", endTime)
      }
    }
  }

  const currentEnrollments = defaultValues?.currentEnrollments || 0
  const minDate = new Date() // Future dates only

  const watchedPrice = form.watch("price")
  const watchedMaxParticipants = form.watch("maxParticipants")

  const priceExceedsTemplate =
    activeTemplate && watchedPrice != null && watchedPrice > activeTemplate.defaultPrice
  const participantsExceedsTemplate =
    activeTemplate && watchedMaxParticipants != null && watchedMaxParticipants > activeTemplate.maxParticipants

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Template Selector */}
        {!isEditing && (
          <FormField
            control={form.control}
            name="workshopTemplateId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TemplateSelector
                    value={field.value}
                    onChange={handleTemplateChange}
                    error={form.formState.errors.workshopTemplateId?.message}
                    disabled={isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Info for editing - cannot change template */}
        {isEditing && defaultValues && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Template:</strong> {defaultValues.workshopTemplate.name} (locked - cannot be changed)
            </AlertDescription>
          </Alert>
        )}

        {/* Date and Time Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      label="Start Date & Time"
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

            {/* End Time */}
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateTimePicker
                      label="End Date & Time"
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.endTime?.message}
                      minDate={form.watch("startTime")}
                      required
                    />
                  </FormControl>
                  <FormDescription>
                    {activeTemplate && `Recommended: ${formatDuration(activeTemplate.estimatedDuration)}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Pricing and Capacity Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Pricing & Capacity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => {
                const blurredValue =
                  field.value != null &&
                  !Number.isNaN(field.value as number)
                    ? new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 0,
                      }).format(field.value as number)
                    : ""

                return (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
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
                          value={
                            priceFieldFocused
                              ? priceInputDraft
                              : blurredValue
                          }
                          onFocus={() => {
                            setPriceFieldFocused(true)
                            const v = form.getValues("price")
                            setPriceInputDraft(
                              v != null && !Number.isNaN(v)
                                ? String(Math.trunc(v))
                                : "",
                            )
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
                            if (!Number.isNaN(n)) {
                              field.onChange(n)
                            }
                          }}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          VND
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {activeTemplate &&
                        `Default: ${formatVndCommaAmount(activeTemplate.defaultPrice)}`}
                    </FormDescription>
                    {priceExceedsTemplate && (
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                        Price exceeds template default (
                        {formatVndCommaAmount(activeTemplate!.defaultPrice)})
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            {/* Max Participants */}
            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Participants</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={isEditing ? currentEnrollments : 1}
                      placeholder="1"
                      {...field}
                      value={field.value || ''}
                      onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    {activeTemplate && `Default: ${activeTemplate.maxParticipants}`}
                    {isEditing && currentEnrollments > 0 && ` | Current enrollments: ${currentEnrollments}`}
                  </FormDescription>
                  {participantsExceedsTemplate && (
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                      Exceeds template max ({activeTemplate!.maxParticipants} participants)
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Warning for editing with enrollments */}
          {isEditing && currentEnrollments > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
              <Info className="h-4 w-4" />
              <AlertDescription>
                ⚠️ This session has {currentEnrollments} enrolled participant{currentEnrollments !== 1 ? 's' : ''}. 
                You cannot reduce max participants below this number.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || priceExceedsTemplate || participantsExceedsTemplate}>
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? "Saving..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Save Changes" : "Create Session"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
