import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Pin, Info } from 'lucide-react';
import { Destination } from '../types';

interface DestinationDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    destination: Destination | null;
}

export function DestinationDetailModal({
    open,
    onOpenChange,
    destination,
}: DestinationDetailModalProps) {
    if (!destination) return null;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'OPEN': return 'default';
            case 'CLOSED':
            case 'TEMPORARILY_CLOSED': return 'destructive';
            case 'MAINTENANCE': return 'outline';
            default: return 'secondary';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Destination Details</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-2">
                    {destination.thumbnailUrl && (
                        <div className="w-full h-64 overflow-hidden rounded-xl shadow-md">
                            <img src={destination.thumbnailUrl} alt={destination.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{destination.name}</h2>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {destination.address || 'No address provided'}
                                </p>
                            </div>
                            <Badge variant={getStatusVariant(destination.status) as any} className="uppercase tracking-wider px-3 py-1">
                                {destination.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/40 p-4 rounded-xl border border-border/50">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-widest flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> Operating Hours
                            </span>
                            <p className="text-sm font-semibold">{destination.openHour} - {destination.closeHour}</p>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-xl border border-border/50">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-widest flex items-center gap-1.5">
                                <Pin className="w-3.5 h-3.5 text-indigo-500" /> Points of Interest
                            </span>
                            <p className="text-sm font-semibold">{destination.points?.length || 0} locations</p>
                        </div>
                    </div>

                    {destination.description && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" />
                                Description
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed bg-muted/20 p-4 rounded-lg border">
                                {destination.description}
                            </p>
                        </div>
                    )}

                    <div className="bg-blue-50/50 p-3 rounded-lg flex items-center gap-2 border border-blue-100/50">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-blue-700 text-xs font-semibold">Coordinates: {destination.latitude}, {destination.longitude}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
