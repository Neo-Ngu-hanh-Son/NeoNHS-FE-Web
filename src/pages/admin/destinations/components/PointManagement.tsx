import {
  Plus,
  Pin,
  Upload,
  MapPin,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Destination, Point } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PointManagementProps {
  currentDestination: Destination | null;
  allPoints: Point[];
  loading: boolean;
  onAddPoint: () => void;
  onEditPoint: (point: Point) => void;
  onDeletePoint: (id: string) => void;
  onFocus: (lat: number, lng: number) => void;
  onImportPoints: (file: File) => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  searchText: string;
  onSearchChange: (text: string) => void;
  destinations: Destination[];
  onDestinationChange: (dest: Destination | null) => void;
}

export function PointManagement({
  currentDestination,
  allPoints,
  loading,
  onAddPoint,
  onEditPoint,
  onDeletePoint,
  onFocus,
  onImportPoints,
  pagination,
  searchText,
  onSearchChange,
  destinations,
  onDestinationChange,
}: PointManagementProps) {
  const totalPages = Math.ceil(pagination.totalElements / pagination.pageSize);

  return (
    <Card className="shadow-lg border-none bg-white/80 backdrop-blur-sm h-full flex flex-col overflow-hidden ring-1 ring-black/5">
      <CardHeader className="pb-3 px-6 pt-6 shrink-0 bg-gray-50/50 border-b">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Pin className="w-5 h-5 text-primary" />
              </div>
              Management POIs
            </CardTitle>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 hover:border-primary/30 cursor-pointer text-sm font-semibold transition-all">
                <Upload className="w-4 h-4 text-primary" />
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
              <Button className="shadow-md shadow-primary/20 font-bold" onClick={onAddPoint}>
                <Plus className="w-4 h-4 mr-2" />
                Add Point
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or description..."
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <Select
              value={currentDestination?.id || "all"}
              onValueChange={(val) => {
                if (val === "all") onDestinationChange(null);
                else {
                  const dest = destinations.find((d) => d.id === val);
                  if (dest) onDestinationChange(dest);
                }
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Destinations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {destinations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-6 flex-1 overflow-hidden flex flex-col">
        <div className="rounded-xl border bg-white flex-1 overflow-hidden flex flex-col shadow-sm">
          <div className="overflow-y-auto custom-scrollbar flex-1">
            <Table className="text-sm">
              <TableHeader className="bg-gray-50/50 sticky top-0 z-10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[60px] text-center font-bold">#</TableHead>
                  <TableHead className="min-w-[150px] font-bold">Point Name</TableHead>
                  <TableHead className="font-bold">Destination</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="w-[80px] text-center font-bold">Time</TableHead>
                  <TableHead className="w-[140px] text-right font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-muted-foreground font-medium">Synchronizing points...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : allPoints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-60 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 py-10 opacity-60">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <Pin className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-gray-600">
                            No points discovered yet
                          </p>
                          <p className="text-sm text-gray-400">
                            Add your first point of interest to start managing.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  allPoints.map((p, idx) => (
                    <TableRow
                      key={p.id}
                      className="hover:bg-primary/5 transition-colors duration-200 group cursor-pointer"
                      onClick={() => {
                        onFocus(p.latitude, p.longitude);
                        onEditPoint(p);
                      }}
                    >
                      <TableCell className="text-center font-bold text-gray-400 group-hover:text-primary transition-colors">
                        {pagination.currentPage * pagination.pageSize + idx + 1}
                      </TableCell>
                      <TableCell className="font-bold text-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border bg-gray-100 shrink-0">
                            {p.thumbnailUrl ? (
                              <img
                                src={p.thumbnailUrl}
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Pin className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="truncate max-w-[180px]" title={p.name}>
                            {p.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-muted-foreground italic">
                        {(p as any).destinationName || (p as any).attractionName || "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 border-none font-medium px-2 py-0"
                        >
                          {p.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-mono text-gray-500">
                          {p.estTimeSpent ? `${p.estTimeSpent}m` : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-emerald-50 hover:text-emerald-600 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onFocus(p.latitude, p.longitude);
                                  }}
                                >
                                  <MapPin className="h-4.5 w-4.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Locate</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-amber-50 hover:text-amber-600 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditPoint(p);
                                  }}
                                >
                                  <Edit className="h-4.5 w-4.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeletePoint(p.id);
                                  }}
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remove</TooltipContent>
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
          {/* Pagination Controls */}
          <div className="bg-gray-50/50 border-t px-6 py-3 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-700">{allPoints.length}</span> of{" "}
              <span className="font-bold text-slate-700">{pagination.totalElements}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === 0}
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Simple logic for showing pages near current
                  let pageNum = i;
                  if (totalPages > 5 && pagination.currentPage > 2) {
                    pageNum = pagination.currentPage - 2 + i;
                    if (pageNum >= totalPages) pageNum = totalPages - 5 + i;
                  }
                  if (pageNum < 0) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => pagination.onPageChange(pageNum)}
                      className="h-8 w-8 p-0 text-xs font-bold"
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === totalPages - 1 || totalPages === 0}
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
