import { Plus, Pin, Upload, Eye, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Destination, Point } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PointManagementProps {
    currentDestination: Destination | null;
    loading: boolean;
    onAddPoint: () => void;
    onEditPoint: (point: Point) => void;
    onDeletePoint: (id: string) => void;
    onFocus: (lat: number, lng: number) => void;
    onViewPoint: (point: Point) => void;
    onImportPoints: (file: File) => void;
}

export function PointManagement({
    currentDestination,
    loading,
    onAddPoint,
    onEditPoint,
    onDeletePoint,
    onFocus,
    onViewPoint,
    onImportPoints,
}: PointManagementProps) {
    if (!currentDestination) {
        return (
            <Card className="shadow-sm border-none bg-emerald-50/10 h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                    <Pin className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium">Select a Destination</p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                        Click the <span className="font-bold text-indigo-500">Points</span> button on a destination to manage its points of interest
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm border-none bg-emerald-50/20 h-full">
            <CardHeader className="pb-3 px-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Pin className="w-5 h-5 text-emerald-600" />
                    POI Management
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="bg-white p-4 rounded-xl border border-emerald-100 border-l-4 border-l-emerald-500 shadow-sm mb-4">
                    <h3 className="font-bold text-base text-gray-800 leading-tight">{currentDestination.name}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3" />
                        {currentDestination.address}
                    </p>

                    <Separator className="my-3 opacity-50" />

                    <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold tracking-wider border-none">
                            {currentDestination.points?.length || 0} POIs
                        </Badge>
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 px-2 py-1 bg-white border rounded hover:bg-gray-50 cursor-pointer text-[11px] font-medium transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Import</span>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onImportPoints(file);
                                    }}
                                />
                            </label>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" onClick={onAddPoint}>
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                Add Point
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-white/50 overflow-hidden">
                    <Table className="text-xs">
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="w-[40px] px-2 text-center">#</TableHead>
                                <TableHead className="px-2">Name</TableHead>
                                <TableHead className="w-[60px] px-2 text-center">Time</TableHead>
                                <TableHead className="w-[100px] px-2 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">Loading points...</TableCell>
                                </TableRow>
                            ) : !currentDestination.points || currentDestination.points.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">No points added yet</TableCell>
                                </TableRow>
                            ) : (
                                currentDestination.points.map((p) => (
                                    <TableRow key={p.id} className="hover:bg-emerald-50/50">
                                        <TableCell className="text-center font-bold text-muted-foreground px-2">{p.orderIndex}</TableCell>
                                        <TableCell className="font-medium px-2">
                                            <div className="truncate max-w-[120px]" title={p.name}>{p.name}</div>
                                        </TableCell>
                                        <TableCell className="text-center px-2">{p.estTimeSpent ? `${p.estTimeSpent}m` : '-'}</TableCell>
                                        <TableCell className="text-right px-2">
                                            <div className="flex items-center justify-end">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onViewPoint(p)}>
                                                                <Eye className="h-3.5 h-3.5 text-blue-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px]">View</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onFocus(p.latitude, p.longitude)}>
                                                                <MapPin className="h-3.5 h-3.5 text-emerald-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px]">Focus</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditPoint(p)}>
                                                                <Edit className="h-3.5 h-3.5 text-amber-500" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px]">Edit</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeletePoint(p.id)}>
                                                                <Trash2 className="h-3.5 h-3.5 text-destructive" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px]">Delete</TooltipContent>
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
