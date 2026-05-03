import { useState, useRef, useCallback, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, X, ImageIcon, Star, Trash2, Upload, Loader2, ImagePlus } from 'lucide-react';
import { message } from 'antd';
import { eventService } from '@/services/api/eventService';
import type { EventImageResponse } from '@/types/event';

interface ImageGalleryProps {
  eventId: string;
  images: EventImageResponse[];
  onImagesChange?: () => void;
}

const INITIAL_DISPLAY = 8;

export function ImageGallery({ eventId, images: initialImages, onImagesChange }: ImageGalleryProps) {
  const [images, setImages] = useState<EventImageResponse[]>(initialImages);
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingThumbnailId, setSettingThumbnailId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const refreshImages = useCallback(async () => {
    try {
      const res = await eventService.getEventImages(eventId);
      if (res.success && res.data) {
        setImages(res.data);
      }
      onImagesChange?.();
    } catch {
      // silent
    }
  }, [eventId, onImagesChange]);

  // ─── File Selection (Staging) ───────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const invalid = fileArray.find((f) => !f.type.startsWith('image/'));
    if (invalid) {
      message.error('Chỉ hỗ trợ file hình ảnh');
      return;
    }
    const tooLarge = fileArray.find((f) => f.size > 10 * 1024 * 1024);
    if (tooLarge) {
      message.error('Mỗi ảnh phải dưới 10MB');
      return;
    }

    setStagedFiles((prev) => [...prev, ...fileArray]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeStagedFile = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearStaged = () => {
    setStagedFiles([]);
  };

  // ─── Confirm Upload ────────────────────────────────────────────────
  const handleConfirmUpload = async () => {
    if (stagedFiles.length === 0) return;
    setUploading(true);
    try {
      const res = await eventService.uploadEventImages(eventId, stagedFiles);
      if (res.success) {
        message.success(`Đã tải lên thành công ${stagedFiles.length} ảnh`);
        setStagedFiles([]);
        await refreshImages();
      } else {
        message.error(res.message || 'Lỗi tải ảnh lên');
      }
    } catch {
      message.error('Đã xảy ra lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId);
    try {
      const res = await eventService.deleteEventImage(eventId, imageId);
      if (res.success) {
        message.success('Đã xóa ảnh thành công');
        // Close lightbox if the deleted image was being viewed
        if (lightboxIndex !== null) {
          const idx = images.findIndex((i) => i.id === imageId);
          if (idx === lightboxIndex) setLightboxIndex(null);
          else if (idx < lightboxIndex) setLightboxIndex(lightboxIndex - 1);
        }
        await refreshImages();
      } else {
        message.error(res.message || 'Lỗi khi xóa ảnh');
      }
    } catch {
      message.error('Không thể xóa ảnh này. Có thể đây đang là ảnh đại diện.');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // ─── Set Thumbnail ─────────────────────────────────────────────────
  const handleSetThumbnail = async (imageId: string) => {
    setSettingThumbnailId(imageId);
    try {
      const res = await eventService.setEventThumbnail(eventId, imageId);
      if (res.success) {
        message.success('Đã đặt ảnh đại diện thành công');
        await refreshImages();
      } else {
        message.error(res.message || 'Lỗi khi đặt ảnh đại diện');
      }
    } catch {
      message.error('Đã xảy ra lỗi khi đặt ảnh đại diện');
    } finally {
      setSettingThumbnailId(null);
    }
  };

  // ─── Bulk Actions ──────────────────────────────────────────────────
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const res = await eventService.deleteMultipleEventImages(eventId, selectedIds);
      if (res.success) {
        message.success(`Đã xóa thành công ${selectedIds.length} ảnh`);
        setSelectedIds([]);
        setIsSelectionMode(false);
        await refreshImages();
      } else {
        message.error(res.message || 'Lỗi khi xóa ảnh');
      }
    } catch {
      message.error('Đã xảy ra lỗi. Đảm bảo không có ảnh đại diện nào được chọn.');
    } finally {
      setIsBulkDeleting(null as any); // just resetting
      setIsBulkDeleting(false);
      setConfirmBulkDelete(false);
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  // ─── Lightbox Navigation ───────────────────────────────────────────
  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : images.length - 1);
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex < images.length - 1 ? lightboxIndex + 1 : 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    else if (e.key === 'ArrowRight') handleNext();
    else if (e.key === 'Escape') setLightboxIndex(null);
  };

  const displayedImages = showAll ? images : images.slice(0, INITIAL_DISPLAY);
  const hasMore = images.length > INITIAL_DISPLAY && !showAll;
  const currentLightboxImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <div>
      {/* Upload area */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{images.length} ảnh trong thư viện</p>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex gap-2">
            {images.length > 0 && (
              <Button
                variant={isSelectionMode ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => {
                  if (isSelectionMode) clearSelection();
                  else setIsSelectionMode(true);
                }}
              >
                {isSelectionMode ? 'Hủy chọn' : 'Chọn ảnh'}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <ImagePlus className="h-4 w-4 mr-2" />
              Tải ảnh lên
            </Button>
          </div>
        </div>
      </div>

      {/* Staged files preview */}
      {stagedFiles.length > 0 && (
        <div className="mb-4 p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-primary">Đã chọn {stagedFiles.length} ảnh — Sẵn sàng tải lên</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={clearStaged} disabled={uploading}>
                <X className="h-4 w-4 mr-1" /> Hủy
              </Button>
              <Button size="sm" onClick={handleConfirmUpload} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                {uploading ? 'Đang tải lên...' : 'Xác nhận'}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {stagedFiles.map((file, idx) => (
              <div key={idx} className="relative aspect-square rounded-md overflow-hidden border bg-white group">
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                <button
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeStagedFile(idx)}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1 py-0.5 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex items-center justify-between p-3 bg-slate-100 rounded-lg border border-slate-200 sticky top-0 z-10 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-2 py-1">
              Đã chọn {selectedIds.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="h-8 text-xs">
              Bỏ chọn tất cả
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="h-8"
            onClick={() => setConfirmBulkDelete(true)}
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? (
              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5 mr-2" />
            )}
            Xóa mục đã chọn
          </Button>
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !uploading && (
        <div
          className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">Chưa có ảnh nào được tải lên</p>
          <p className="text-xs mt-1">Nhấp vào đây hoặc nút bên trên để thêm ảnh</p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {displayedImages.map((img, index) => (
            <div
              key={img.id}
              className={`relative aspect-square rounded-lg overflow-hidden group border transition-all bg-slate-50 ${
                selectedIds.includes(img.id) ? 'ring-2 ring-primary border-primary' : 'hover:shadow-md'
              }`}
            >
              {/* Image */}
              <img
                src={img.imageUrl}
                alt={`Ảnh sự kiện ${index + 1}`}
                className={`w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105 ${
                  selectedIds.includes(img.id) ? 'opacity-80' : ''
                }`}
                onClick={() => {
                  if (isSelectionMode && !img.isThumbnail) {
                    toggleSelection(img.id);
                  } else {
                    setLightboxIndex(index);
                  }
                }}
              />

              {/* Selection Checkbox */}
              {!img.isThumbnail && (isSelectionMode || selectedIds.includes(img.id)) && (
                <div
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(img.id);
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded border shadow-sm flex items-center justify-center transition-colors ${
                      selectedIds.includes(img.id)
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white/80 border-slate-400 hover:border-primary'
                    }`}
                  >
                    {selectedIds.includes(img.id) && <X className="h-3.5 w-3.5" />}
                  </div>
                </div>
              )}

              {/* Thumbnail badge */}
              {img.isThumbnail && (
                <Badge className="absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0.5 bg-yellow-500/90 hover:bg-yellow-500/90 pointer-events-none">
                  <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                  Ảnh đại diện
                </Badge>
              )}

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Set as thumbnail */}
                {!img.isThumbnail && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-[11px] px-2 shadow-md bg-white/90 hover:bg-white text-slate-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetThumbnail(img.id);
                    }}
                    disabled={settingThumbnailId === img.id}
                  >
                    {settingThumbnailId === img.id ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Star className="h-3 w-3 mr-1" />
                    )}
                    Đặt làm đại diện
                  </Button>
                )}
                {img.isThumbnail && <span />}

                {/* Delete button (hidden for thumbnail) */}
                {!img.isThumbnail && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 w-7 p-0 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(img.id);
                    }}
                    disabled={deletingId === img.id}
                  >
                    {deletingId === img.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show more / less */}
      {hasMore && (
        <div className="mt-3 text-center">
          <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>
            Hiển thị tất cả {images.length} ảnh
          </Button>
        </div>
      )}
      {showAll && images.length > INITIAL_DISPLAY && (
        <div className="mt-3 text-center">
          <Button variant="ghost" size="sm" onClick={() => setShowAll(false)}>
            Thu gọn
          </Button>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none" onKeyDown={handleKeyDown}>
          {currentLightboxImage && lightboxIndex !== null && (
            <div className="relative flex items-center justify-center min-h-[60vh]">
              <img
                src={currentLightboxImage.imageUrl}
                alt={`Ảnh sự kiện ${lightboxIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />

              {/* Close */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Bottom bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-white/70 text-sm">
                  {lightboxIndex + 1} / {images.length}
                  {currentLightboxImage.isThumbnail && (
                    <Badge className="ml-2 text-[10px] px-1.5 py-0 bg-yellow-500/90 hover:bg-yellow-500/90">
                      <Star className="h-2.5 w-2.5 mr-0.5 fill-current" /> Ảnh đại diện
                    </Badge>
                  )}
                </span>
                <div className="flex gap-2">
                  {!currentLightboxImage.isThumbnail && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs bg-white/15 hover:bg-white/25 text-white border-none"
                        onClick={() => handleSetThumbnail(currentLightboxImage.id)}
                        disabled={settingThumbnailId === currentLightboxImage.id}
                      >
                        {settingThumbnailId === currentLightboxImage.id ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Star className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Đặt làm đại diện
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setConfirmDeleteId(currentLightboxImage.id)}
                        disabled={deletingId === currentLightboxImage.id}
                      >
                        {deletingId === currentLightboxImage.id ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Xóa
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa ảnh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ảnh này? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              disabled={!!deletingId}
            >
              {deletingId ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Bulk Delete confirmation */}
      <AlertDialog open={confirmBulkDelete} onOpenChange={(open) => !open && setConfirmBulkDelete(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa nhiều ảnh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedIds.length} ảnh đã chọn? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Xóa {selectedIds.length} ảnh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
