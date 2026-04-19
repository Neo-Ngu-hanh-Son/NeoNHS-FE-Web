import { useState, useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Search, MapPin, Loader2, Star, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface PlaceResult {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    googlePlaceId: string;
    photoUrl?: string;
}

interface GooglePlacesAutocompleteProps {
    onPlaceSelect: (place: PlaceResult) => void;
    className?: string;
}

export function GooglePlacesAutocomplete({ onPlaceSelect, className }: GooglePlacesAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const autocompleteSuggestion = useRef<any>(null);
    const sessionToken = useRef<any>(null);
    const debounceTimeout = useRef<any>(null);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            setError("Missing API Key");
            return;
        }

        setOptions({
            key: apiKey,
            v: "weekly"
        });

        importLibrary("places").then((lib: any) => {
            autocompleteSuggestion.current = lib.AutocompleteSuggestion;
            sessionToken.current = new lib.AutocompleteSessionToken();
            setError(null);
        }).catch(e => {
            console.error("Google Maps API initialization failed:", e);
            setError("API Load Failed");
        });
    }, []);

    const handleInputChange = (value: string) => {
        setInputValue(value);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!value || value.length < 2 || !autocompleteSuggestion.current) {
            setPredictions([]);
            return;
        }

        setLoading(true);

        debounceTimeout.current = setTimeout(async () => {
            try {
                const { suggestions } = await autocompleteSuggestion.current.fetchAutocompleteSuggestions({
                    input: value,
                    sessionToken: sessionToken.current,
                    locationBias: { lat: 15.9986, lng: 108.2618 }, // Ngu Hanh Son area
                });
                // Map the new suggestion format back to a predictable structure for the UI
                setPredictions(suggestions.map((s: any) => s.placePrediction));
            } catch (err) {
                console.error("Autocomplete fetch failed:", err);
                setPredictions([]);
            } finally {
                setLoading(false);
            }
        }, 800); // 800ms debounce to save API cost
    };

    const handleSelect = async (prediction: any) => {
        setOpen(false);
        setLoading(true);

        try {
            // New API: convert prediction to Place object
            const place = prediction.toPlace();

            // Specify the fields you need (New API format)
            await place.fetchFields({
                fields: ['displayName', 'formattedAddress', 'location', 'id', 'photos']
            });

            const lat = typeof place.location?.lat === 'function' ? place.location.lat() : (place.location as any)?.lat || 0;
            const lng = typeof place.location?.lng === 'function' ? place.location.lng() : (place.location as any)?.lng || 0;

            const photoUrl = place.photos?.[0]
                ? (typeof (place.photos[0] as any).getURI === 'function'
                    ? (place.photos[0] as any).getURI({ maxWidth: 800 })
                    : (typeof (place.photos[0] as any).getUrl === 'function'
                        ? (place.photos[0] as any).getUrl({ maxWidth: 800 })
                        : null))
                : null;

            onPlaceSelect({
                name: place.displayName || '',
                address: place.formattedAddress || '',
                latitude: lat,
                longitude: lng,
                googlePlaceId: place.id || '',
                photoUrl: photoUrl || undefined
            });

            // Refresh session token for next search if library available
            importLibrary("places").then((lib: any) => {
                sessionToken.current = new lib.AutocompleteSessionToken();
            });
        } catch (err) {
            console.error("Place details fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="p-3 border rounded-md bg-yellow-50 text-yellow-700 text-xs flex items-center gap-2">
                <Star className="h-4 w-4" />
                Google Maps API Key is missing. Manual entry only.
            </div>
        );
    }

    return (
        <div className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`w-full justify-start text-left font-normal h-11 ${error ? 'border-red-200 bg-red-50 text-red-600' : ''}`}
                    >
                        {error ? (
                            <>
                                <AlertTriangle className="mr-2 h-4 w-4 shrink-0" />
                                {error === "Missing API Key" ? "API Key Missing (.env)" : "Google Maps API Load Failed"}
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                {loading ? "Tìm kiếm..." : "Tìm kiếm địa điểm trên Google Maps..."}
                            </>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 z-[1100]"
                    align="start"
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Nhập tên địa điểm để tìm kiếm..."
                            value={inputValue}
                            onValueChange={handleInputChange}
                        />
                        <CommandList>
                            {loading && (
                                <div className="p-4 flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    <span className="text-sm text-muted-foreground">Fetching results...</span>
                                </div>
                            )}
                            {!loading && predictions.length === 0 && (
                                <CommandEmpty>Không tìm thấy địa điểm.</CommandEmpty>
                            )}
                            <CommandGroup>
                                {predictions.map((prediction: any) => (
                                    <CommandItem
                                        key={prediction.placeId}
                                        value={prediction.text?.text}
                                        onSelect={() => handleSelect(prediction)}
                                        className="flex items-start gap-2 py-3"
                                    >
                                        <MapPin className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium truncate">{prediction.text?.text}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {prediction.secondaryText?.text}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
