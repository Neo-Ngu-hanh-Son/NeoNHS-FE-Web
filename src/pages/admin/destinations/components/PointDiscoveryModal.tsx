import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { GooglePlacesAutocomplete } from './GooglePlacesAutocomplete';
import { MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiscoveryResult {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    googlePlaceId: string;
    photoUrl?: string;
}

interface PointDiscoveryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (result: DiscoveryResult) => void;
}

export function PointDiscoveryModal({
    open,
    onOpenChange,
    onSelect
}: PointDiscoveryModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl bg-white">
                <DialogHeader className="p-8 bg-slate-50 border-b">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black tracking-tight text-slate-800">
                                Discover Point
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                Search Google Maps to import location data
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                            Step 1: Find on Google
                        </label>
                        <GooglePlacesAutocomplete
                            onPlaceSelect={(place) => onSelect(place)}
                            className="w-full"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 italic text-[11px] text-slate-400 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        We'll automatically fetch coordinates and details for you
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t flex justify-end">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-bold text-slate-500 hover:text-slate-800">
                        Cancel Discovery
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
