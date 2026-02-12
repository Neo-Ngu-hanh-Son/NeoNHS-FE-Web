// DestinationTable.tsx
import { Search, Plus, MapPin, Clock, Eye, Edit, Trash2, Pin, Upload } from 'lucide-react';
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
    onAddDestination: () => void;
    onEditDestination: (dest: Destination) => void;
    onDeleteDestination: (id: string) => void;
    onManagePoints: (dest: Destination) => void;
    onFocus: (lat: number, lng: number) => void;
    onViewDetails: (dest: Destination) => void;
    onImportExcel: (file: File) => void;
}

export function DestinationTable({
    destinations,
    loading,
    searchText,
    onSearchChange,
    onAddDestination,
    onEditDestination,
    onDeleteDestination,
    onManagePoints,
    onFocus,
    onViewDetails,
    onImportExcel,
}: DestinationTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-green-500 hover:bg-green-600';
            case 'CLOSED':
            case 'TEMPORARILY_CLOSED': return 'bg-red-500 hover:bg-red-600';
            case 'MAINTENANCE': return 'bg-orange-500 hover:bg-orange-600';
            default: return 'bg-blue-500 hover:bg-blue-600';
        }
    };

    return (
        <Card className="shadow-sm border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">Destinations</CardTitle>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {destinations.length}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 mr-2">
                        <label className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-50 transition-colors text-sm font-medium">
                            <Upload className="w-4 h-4" />
                            <span>Import Excel</span>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) onImportExcel(file);
                                }}
                            />
                        </label>
                    </div>
                    <Button onClick={onAddDestination} className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Destination
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 relative max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search name, address or description..."
                        className="pl-9"
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[300px]">Info</TableHead>
                                <TableHead>Hours</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Points</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Loading destinations...
                                    </TableCell>
                                </TableRow>
                            ) : destinations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No destinations found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                destinations.map((dest) => (
                                    <TableRow key={dest.id} className="hover:bg-muted/20">
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-primary truncate max-w-[250px]" title={dest.name}>
                                                    {dest.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[250px]" title={dest.address}>
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    {dest.address || 'No address'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span className="font-medium">{dest.openHour || '--:--'} - {dest.closeHour || '--:--'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(dest.status)} text-white border-none text-[10px] px-1.5 py-0`}>
                                                {dest.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-cyan-600 border-cyan-200 bg-cyan-50">
                                                {dest.points?.length || 0} POIs
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onViewDetails(dest)}>
                                                                <Eye className="h-4 w-4 text-blue-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>View Details</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onFocus(dest.latitude, dest.longitude)}>
                                                                <MapPin className="h-4 w-4 text-emerald-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Focus on map</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditDestination(dest)}>
                                                                <Edit className="h-4 w-4 text-amber-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Edit</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onManagePoints(dest)}>
                                                                <Pin className="h-4 w-4 text-indigo-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Manage Points</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDeleteDestination(dest.id)}>
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Delete</TooltipContent>
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
            </CardContent>
        </Card>
    );
}
