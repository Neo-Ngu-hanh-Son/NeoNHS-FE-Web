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
import { uploadImageToCloudinary } from "@/utils/cloudinary"
import { message } from "antd"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface WorkshopTemplateFormProps {
  defaultValues?: WorkshopTemplateResponse
  onSubmit: (data: WorkshopTemplateFormData) => Promise<void> | void
  onCancel: () => void
  isEditing?: boolean
  submitting?: boolean
}

export function WorkshopTemplateForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false,
  submitting = false,
}: WorkshopTemplateFormProps) {
  const [durationDisplay, setDurationDisplay] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingData, setPendingData] = useState<WorkshopTemplateFormData | null>(null)

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

  const handleFormSubmit = (data: WorkshopTemplateFormData) => {
    setPendingData(data)
    setShowConfirmModal(true)
  }

  const handleConfirmUploadAndSubmit = async () => {
    if (!pendingData) return

    const data = { ...pendingData }
    const hasFiles = data.imageUrls.some(u => u instanceof File)

    if (hasFiles) {
      setIsUploading(true)
      const hideMsg = message.loading("Uploading images...", 0)
      try {
        const finalUrls: string[] = []
        for (let i = 0; i < data.imageUrls.length; i++) {
          const item = data.imageUrls[i]
          if (item instanceof File) {
            const url = await uploadImageToCloudinary(item)
            if (url) finalUrls.push(url)
          } else {
            finalUrls.push(item as string)
          }
        }
        data.imageUrls = finalUrls
      } catch (error: any) {
        hideMsg()
        message.error("Failed to upload images: " + error.message)
        setIsUploading(false)
        setShowConfirmModal(false)
        return // Stop the submission
      }
      hideMsg()
      setIsUploading(false)
    }

    try {
      await onSubmit(data)
    } catch (error) {
      // Parent should handle error, but we catch to ensure we close modal safely if needed
    }

    if (!submitting) {
      setShowConfirmModal(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
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
                  <FormLabel>Default Price (VND) *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="1,000"
                      value={field.value || field.value === 0 ? (field.value === 0 ? '' : new Intl.NumberFormat('en-US').format(field.value)) : ''}
                      onChange={e => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        field.onChange(rawValue ? parseInt(rawValue, 10) : 0);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Minimum 1,000 VND</FormDescription>
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
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            size="lg"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={submitting || isUploading}
          >
            {(submitting || isUploading) ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? "Saving..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Save Changes" : "Create Template"
            )}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <AlertDialog
        open={showConfirmModal}
        onOpenChange={(open) => {
          if (!isUploading && !submitting) {
            setShowConfirmModal(open)
          }
        }}
      >
        <AlertDialogContent
          onEscapeKeyDown={(e) => {
            if (isUploading || submitting) e.preventDefault()
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditing ? "Save Changes?" : "Create Workshop Template?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                {isEditing
                  ? "Are you sure you want to save these changes to the template?"
                  : "Are you sure you want to create this workshop template?"}
              </p>
              {(isUploading || submitting) && (
                <p className="font-medium text-blue-600 dark:text-blue-500 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-500"></div>
                  Please do not close this window. {isUploading ? "Uploading images to Cloudinary..." : "Storing template data..."}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              disabled={isUploading || submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmUploadAndSubmit}
              disabled={isUploading || submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {(isUploading || submitting) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isUploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  )
}
