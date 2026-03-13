// DestinationTable.tsx
import { Search, MapPin, Clock, Eye, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Destination } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DestinationTableProps {
    destinations: Destination[];
    loading: boolean;
    searchText: string;
    onSearchChange: (value: string) => void;
    onManagePoints: (dest: Destination | null) => void;
    onFocus: (lat: number, lng: number) => void;
    onViewDetails: (dest: Destination) => void;
}

export function DestinationTable({
    destinations,
    loading,
    searchText,
    onSearchChange,
    onManagePoints,
    onFocus,
    onViewDetails,
}: DestinationTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-emerald-500 hover:bg-emerald-600';
            case 'CLOSED':
            case 'TEMPORARILY_CLOSED': return 'bg-destructive/80 hover:bg-destructive';
            case 'MAINTENANCE': return 'bg-amber-500 hover:bg-amber-600';
            default: return 'bg-blue-500 hover:bg-blue-600';
        }
    };

    return (
        <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm overflow-hidden ring-1 ring-black/5 h-full">
            <CardHeader className="pb-4 pt-6 px-6 bg-gray-50/50 border-b shrink-0 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800">Destinations</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary font-bold px-2 py-0.5 border-none">
                        {destinations.length} TOTAL
                    </Badge>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-bold text-primary hover:bg-primary/10"
                    onClick={() => onManagePoints(null)}
                >
                    Show All Points
                </Button>
            </CardHeader>
            <CardContent className="px-6 py-6 h-[calc(100%-80px)] overflow-hidden flex flex-col">
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground opacity-50" />
                    <Input
                        placeholder="Filter by name, address or description..."
                        className="pl-10 h-10 bg-white shadow-sm border-gray-200 focus:border-primary/50"
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="rounded-xl border bg-white overflow-hidden flex-1 flex flex-col shadow-sm">
                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        <Table className="text-sm">
                            <TableHeader className="bg-gray-50/50 sticky top-0 z-10">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[280px] font-bold">General Information</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="font-bold">Volume</TableHead>
                                    <TableHead className="text-right font-bold pr-6">Quick Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                <p className="text-muted-foreground font-medium">Loading catalog...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : destinations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center">
                                            <p className="text-muted-foreground italic">No destinations matching your search.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    destinations.map((dest) => (
                                        <TableRow key={dest.id} className="group hover:bg-primary/5 transition-colors duration-200 cursor-pointer" onClick={() => onManagePoints(dest)}>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border bg-gray-100 shrink-0 shadow-sm border-gray-200 group-hover:border-primary/30 transition-all">
                                                        {dest.thumbnailUrl ? (
                                                            <img src={dest.thumbnailUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <MapPin className="w-5 h-5 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-bold text-gray-800 group-hover:text-primary transition-colors truncate max-w-[200px]" title={dest.name}>
                                                            {dest.name}
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate max-w-[200px]" title={dest.address}>
                                                            <Clock className="w-3 h-3 flex-shrink-0" />
                                                            {dest.openHour || '--:--'} - {dest.closeHour || '--:--'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusColor(dest.status)} text-white border-none text-[10px] uppercase font-bold px-2 py-0.5`}>
                                                    {dest.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-700">{dest.points?.length || 0} POIs</span>
                                                    <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-500"
                                                            style={{ width: `${Math.min((dest.points?.length || 0) * 10, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 rounded-full" onClick={() => onViewDetails(dest)}>
                                                                    <Eye className="h-4.5 w-4.5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>View Details</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-emerald-50 hover:text-emerald-600 rounded-full" onClick={() => onFocus(dest.latitude, dest.longitude)}>
                                                                    <MapPin className="h-4.5 w-4.5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Show on Map</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-full" onClick={() => onManagePoints(dest)}>
                                                                    <Pin className="h-4.5 w-4.5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Manage Points</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
