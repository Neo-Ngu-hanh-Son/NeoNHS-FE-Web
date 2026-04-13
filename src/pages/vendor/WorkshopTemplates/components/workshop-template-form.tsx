import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { workshopTemplateSchema, type WorkshopTemplateFormData, type WorkshopTemplateResponse } from "../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import {
  FileText,
  DollarSign,
  Users,
  Tags,
  ImageIcon,
  Clock,
  UserMinus,
  UserPlus,
} from "lucide-react"

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
        return
      }
      hideMsg()
      setIsUploading(false)
    }

    try {
      await onSubmit(data)
    } catch {
      // Parent handles error
    }

    if (!submitting) {
      setShowConfirmModal(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>

        {/* ═══ Two-column grid: left = text, right = media + settings ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ──────── LEFT COLUMN (7/12) ──────── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Basic Information</CardTitle>
                    <CardDescription className="text-xs">Name and description of your workshop</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workshop Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Traditional Pottery Workshop"
                          {...field}
                          maxLength={255}
                        />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <FormDescription>A clear, descriptive name</FormDescription>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {field.value?.length ?? 0}/255
                        </span>
                      </div>
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
                          placeholder="A brief summary shown on preview cards (optional)"
                          className="min-h-[80px] resize-none"
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <FormDescription>Appears in cards &amp; search results</FormDescription>
                        <span className="text-[11px] text-muted-foreground tabular-nums">
                          {field.value?.length ?? 0}/500
                        </span>
                      </div>
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
                          placeholder="Detailed description: what participants will learn, activities, materials, etc."
                          className="min-h-[220px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Shown on the workshop detail page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing & Duration */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Pricing & Duration</CardTitle>
                    <CardDescription className="text-xs">Default price and estimated time</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="defaultPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Price <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="e.g. 100,000"
                              className="pl-9 pr-14"
                              value={
                                field.value || field.value === 0
                                  ? field.value === 0
                                    ? ""
                                    : new Intl.NumberFormat("en-US").format(field.value)
                                  : ""
                              }
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\D/g, "")
                                field.onChange(rawValue ? parseInt(rawValue, 10) : 0)
                              }}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                              VND
                            </span>
                          </div>
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
                        <FormLabel>Estimated Duration <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              placeholder="90"
                              className="pl-9 pr-16"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                              min
                            </span>
                          </div>
                        </FormControl>
                        {durationDisplay && (
                          <FormDescription>
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                              <Clock className="w-3 h-3" /> {durationDisplay}
                            </span>
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ──────── RIGHT COLUMN (5/12) ──────── */}
          <div className="lg:col-span-5 space-y-6">

            {/* Images */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Images</CardTitle>
                    <CardDescription className="text-xs">Upload at least one. Mark one as thumbnail.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Participants</CardTitle>
                    <CardDescription className="text-xs">Minimum and maximum group sizes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserMinus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              placeholder="5"
                              className="pl-9"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              placeholder="20"
                              className="pl-9"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("maxParticipants") < form.watch("minParticipants") && (
                  <p className="mt-3 text-sm text-red-500 font-medium">
                    Max must be &ge; min participants
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Categories / Tags */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <Tags className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Categories</CardTitle>
                    <CardDescription className="text-xs">Select at least one tag</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ─── Actions ─── */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-500" />
                  Please do not close this window. {isUploading ? "Uploading images ..." : "Storing template data..."}
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
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
