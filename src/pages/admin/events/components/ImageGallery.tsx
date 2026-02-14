import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ImageIcon, Star } from 'lucide-react';
import type { EventImageResponse } from '@/types/event';

interface ImageGalleryProps {
    images: EventImageResponse[];
}

const INITIAL_DISPLAY = 8;

export function ImageGallery({ images }: ImageGalleryProps) {
    const [showAll, setShowAll] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ImageIcon className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">No images uploaded</p>
            </div>
        );
    }

    const displayedImages = showAll ? images : images.slice(0, INITIAL_DISPLAY);
    const hasMore = images.length > INITIAL_DISPLAY && !showAll;

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

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {displayedImages.map((img, index) => (
                    <div
                        key={img.id}
                        className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer border hover:shadow-md transition-shadow"
                        onClick={() => setLightboxIndex(index)}
                    >
                        <img
                            src={img.imageUrl}
                            alt={`Event image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        {img.isThumbnail && (
                            <Badge className="absolute top-1 left-1 text-[10px] px-1.5 py-0 bg-yellow-500/90">
                                <Star className="h-2.5 w-2.5 mr-0.5" />
                                Thumbnail
                            </Badge>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="mt-3 text-center">
                    <Button variant="outline" size="sm" onClick={() => setShowAll(true)}>
                        Show all {images.length} images
                    </Button>
                </div>
            )}

            {showAll && images.length > INITIAL_DISPLAY && (
                <div className="mt-3 text-center">
                    <Button variant="ghost" size="sm" onClick={() => setShowAll(false)}>
                        Show less
                    </Button>
                </div>
            )}

            {/* Lightbox */}
            <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
                <DialogContent
                    className="max-w-4xl p-0 bg-black/95 border-none"
                    onKeyDown={handleKeyDown}
                >
                    {lightboxIndex !== null && (
                        <div className="relative flex items-center justify-center min-h-[60vh]">
                            <img
                                src={images[lightboxIndex].imageUrl}
                                alt={`Event image ${lightboxIndex + 1}`}
                                className="max-w-full max-h-[80vh] object-contain"
                            />

                            {/* Close button */}
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

                            {/* Counter */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                                {lightboxIndex + 1} / {images.length}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
