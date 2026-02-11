import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ImageIcon } from 'lucide-react';
import type { EventImageResponse } from '@/types/event';

interface ImageGalleryProps {
    images: EventImageResponse[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    if (!images || images.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <ImageIcon className="h-10 w-10 mb-2" />
                <p className="text-sm">No images available</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((image) => (
                    <div
                        key={image.id}
                        className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer group"
                        onClick={() => setLightboxImage(image.imageUrl)}
                    >
                        <img
                            src={image.imageUrl}
                            alt="Event"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        {image.isThumbnail && (
                            <Badge className="absolute top-2 left-2 text-[10px] bg-black/60 text-white border-0">
                                Thumbnail
                            </Badge>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                ))}
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
                <DialogContent className="max-w-4xl p-2">
                    {lightboxImage && (
                        <img src={lightboxImage} alt="Full size" className="w-full h-auto rounded-lg" />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
