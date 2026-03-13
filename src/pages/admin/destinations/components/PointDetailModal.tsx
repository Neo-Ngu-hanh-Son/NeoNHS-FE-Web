import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, History, AudioLines, Info } from 'lucide-react';
import { Point } from '../types';

interface PointDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    point: Point | null;
}

export function PointDetailModal({
    open,
    onOpenChange,
    point,
}: PointDetailModalProps) {
    if (!point) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Point of Interest Details</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-2">
                    {point.thumbnailUrl && (
                        <div className="w-full h-56 overflow-hidden rounded-xl shadow-md">
                            <img src={point.thumbnailUrl} alt={point.name} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{point.name}</h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">Order: {point.orderIndex}</Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {point.estTimeSpent} mins
                                    </span>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 uppercase text-[10px]">
                                {point.type}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {point.description && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-700">
                                <Info className="w-4 h-4 text-primary" />
                                Description
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {point.description}
                            </p>
                        </div>
                    )}

                    {point.history && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-gray-700">
                                <History className="w-4 h-4 text-emerald-500" />
                                Historical Context
                            </h3>
                            <div className="bg-muted/30 p-4 rounded-lg border italic text-sm text-gray-700">
                                {point.history}
                            </div>
                        </div>
                    )}

                    {point.historyAudioUrl && (
                        <div className="mt-2 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 shadow-sm">
                            <div className="text-[10px] font-bold uppercase text-emerald-600 mb-2 tracking-widest flex items-center gap-2">
                                <AudioLines className="w-4 h-4" /> Audio History Guide
                            </div>
                            <audio key={point.id} controls className="w-full h-10 mt-1">
                                <source src={point.historyAudioUrl} />
                            </audio>
                        </div>
                    )}

                    <div className="bg-blue-50/50 p-3 rounded-lg flex items-center gap-2 border border-blue-100/50">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-700 text-xs font-semibold">Coordinates: {point.latitude}, {point.longitude}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
