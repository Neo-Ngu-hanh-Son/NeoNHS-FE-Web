import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { workshopTemplateSchema, type WorkshopTemplateFormData, type WorkshopTemplateResponse } from "../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { WTagSelector } from "./wtag-selector"
import { ImageUploader } from "./image-uploader"
import { formatDuration } from "../utils/formatters"
import { useEffect, useState } from "react"

interface WorkshopTemplateFormProps {
  defaultValues?: WorkshopTemplateResponse
  onSubmit: (data: WorkshopTemplateFormData) => void
  onCancel: () => void
  isEditing?: boolean
}

export function WorkshopTemplateForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false,
}: WorkshopTemplateFormProps) {
  const [durationDisplay, setDurationDisplay] = useState("")

  const form = useForm<WorkshopTemplateFormData>({
    resolver: zodResolver(workshopTemplateSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          shortDescription: defaultValues.shortDescription || "",
          fullDescription: defaultValues.fullDescription || "",
          estimatedDuration: defaultValues.estimatedDuration,
          defaultPrice: defaultValues.defaultPrice,
          minParticipants: defaultValues.minParticipants,
          maxParticipants: defaultValues.maxParticipants,
          imageUrls: defaultValues.images.map(img => img.imageUrl),
          thumbnailIndex: defaultValues.images.findIndex(img => img.isThumbnail) || 0,
          tagIds: defaultValues.tags.map(tag => tag.id),
        }
      : {
          name: "",
          shortDescription: "",
          fullDescription: "",
          estimatedDuration: 60,
          defaultPrice: 0,
          minParticipants: 1,
          maxParticipants: 10,
          imageUrls: [],
          thumbnailIndex: 0,
          tagIds: [],
        },
  })

  // Watch duration field to show formatted display
  const watchedDuration = form.watch("estimatedDuration")
  useEffect(() => {
    if (watchedDuration > 0) {
      setDurationDisplay(formatDuration(watchedDuration))
    } else {
      setDurationDisplay("")
    }
  }, [watchedDuration])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section A: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workshop Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Traditional Pottery Workshop" 
                      {...field} 
                      maxLength={255}
                    />
                  </FormControl>
                  <FormDescription>Maximum 255 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short Description */}
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of your workshop (optional)"
                      className="min-h-[80px]"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum 500 characters. This will appear in preview cards.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Description */}
            <FormField
              control={form.control}
              name="fullDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of your workshop, what participants will learn, activities included, etc."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section B: Pricing & Duration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Pricing & Duration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <FormField
              control={form.control}
              name="defaultPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Price ($) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      placeholder="45.00" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Minimum $0.01</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="estimatedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Duration (minutes) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1"
                      placeholder="90" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    {durationDisplay && `≈ ${durationDisplay}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section C: Participants */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Participants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Min Participants */}
            <FormField
              control={form.control}
              name="minParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Participants *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="5" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
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
                  <FormLabel>Maximum Participants *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="20" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>Must be ≥ minimum participants</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Validation message for min/max */}
          {form.watch("maxParticipants") < form.watch("minParticipants") && (
            <p className="text-sm text-red-500 font-medium">
              Maximum participants must be greater than or equal to minimum participants
            </p>
          )}
        </div>

        {/* Section D: Categories/Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Categories</h3>
          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <WTagSelector
                    selectedTagIds={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors.tagIds?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section E: Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Workshop Images</h3>
          <FormField
            control={form.control}
            name="imageUrls"
            render={({ field: imageField }) => (
              <FormField
                control={form.control}
                name="thumbnailIndex"
                render={({ field: thumbnailField }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        imageUrls={imageField.value}
                        thumbnailIndex={thumbnailField.value}
                        onChange={(urls, thumbIdx) => {
                          imageField.onChange(urls)
                          thumbnailField.onChange(thumbIdx)
                        }}
                        error={form.formState.errors.imageUrls?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel} size="lg">
            Cancel
          </Button>
          <Button type="submit" size="lg">
            {isEditing ? "Save Changes" : "Create Template"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
