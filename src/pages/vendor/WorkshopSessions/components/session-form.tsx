import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { workshopSessionSchema, type WorkshopSessionFormData, type WorkshopSessionResponse } from "../types"
import { WorkshopTemplateResponse } from "../../WorkshopTemplates/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { TemplateSelector } from "./template-selector"
import { DateTimePicker } from "./date-time-picker"
import { formatDuration } from "../../WorkshopTemplates/utils/formatters"
import { formatPrice } from "../utils/formatters"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface SessionFormProps {
  defaultValues?: WorkshopSessionResponse
  preselectedDate?: Date
  onSubmit: (data: WorkshopSessionFormData) => void
  onCancel: () => void
  isEditing?: boolean
  submitting?: boolean
}

export function SessionForm({
  defaultValues,
  preselectedDate,
  onSubmit,
  onCancel,
  isEditing = false,
  submitting = false,
}: SessionFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkshopTemplateResponse | undefined>()
  
  const form = useForm<WorkshopSessionFormData>({
    resolver: zodResolver(workshopSessionSchema),
    defaultValues: defaultValues
      ? {
          workshopTemplateId: defaultValues.workshopTemplate.id,
          startTime: new Date(defaultValues.startTime),
          endTime: new Date(defaultValues.endTime),
          price: defaultValues.price,
          maxParticipants: defaultValues.maxParticipants,
        }
      : {
          workshopTemplateId: "",
          startTime: preselectedDate || new Date(),
          endTime: preselectedDate ? new Date(preselectedDate.getTime() + 60 * 60 * 1000) : new Date(), // +1 hour default
          price: undefined,
          maxParticipants: undefined,
        },
  })

  // Auto-calculate end time when template is selected or start time changes
  useEffect(() => {
    if (selectedTemplate && !isEditing) {
      const startTime = form.getValues("startTime")
      if (startTime) {
        const endTime = new Date(startTime.getTime() + selectedTemplate.estimatedDuration * 60 * 1000)
        form.setValue("endTime", endTime)
      }
    }
  }, [selectedTemplate, form.watch("startTime"), isEditing])

  // Auto-fill price and maxParticipants from template
  const handleTemplateChange = (templateId: string, template: WorkshopTemplateResponse | undefined) => {
    form.setValue("workshopTemplateId", templateId)
    setSelectedTemplate(template)
    
    if (template && !isEditing) {
      // Auto-fill if not editing
      form.setValue("price", template.defaultPrice)
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
                    {selectedTemplate && `Recommended: ${formatDuration(selectedTemplate.estimatedDuration)}`}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="45.00"
                      {...field}
                      value={field.value || ''}
                      onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    {selectedTemplate && `Default: ${formatPrice(selectedTemplate.defaultPrice)}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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
                      placeholder="20"
                      {...field}
                      value={field.value || ''}
                      onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    {selectedTemplate && `Default: ${selectedTemplate.maxParticipants}`}
                    {isEditing && currentEnrollments > 0 && ` | Current enrollments: ${currentEnrollments}`}
                  </FormDescription>
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
          <Button type="submit" disabled={submitting}>
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
