import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BadgeCheck, Plus } from 'lucide-react';
import type { PointPanoramaResponse } from '@/types';

interface PanoramaListProps {
  panoramas: PointPanoramaResponse[];
  selectedPanoramaId: string | null;
  onSelectPanorama: (panoramaId: string) => void;
  onCreatePanorama: () => void;
  disabled?: boolean;
}

export default function PanoramaList({
  panoramas,
  selectedPanoramaId,
  onSelectPanorama,
  onCreatePanorama,
  disabled = false,
}: PanoramaListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Danh sách panorama</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={onCreatePanorama} disabled={disabled}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Thêm panorama mới
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {panoramas.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">Chưa có panorama nào. Bấm "Thêm panorama mới" để tạo.</p>
        ) : (
          <div className="max-h-[260px] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead className="w-[100px]">Ảnh</TableHead>
                  <TableHead className="w-[120px]">Mặc định</TableHead>
                  <TableHead className="w-[120px]">Hotspots</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {panoramas.map((panorama, idx) => {
                  const isSelected = panorama.id === selectedPanoramaId;

                  return (
                    <TableRow
                      key={panorama.id}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                      onClick={() => onSelectPanorama(panorama.id)}
                    >
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="max-w-[220px] truncate text-sm font-medium">{panorama.title}</TableCell>
                      <TableCell>
                        <img
                          src={panorama.panoramaImageUrl}
                          alt={panorama.title || `Panorama #${idx + 1}`}
                          className="h-10 w-16 rounded object-cover border"
                        />
                      </TableCell>
                      <TableCell>{panorama.isDefault ? <BadgeCheck className="text-primary" /> : null}</TableCell>
                      <TableCell>{panorama.hotSpots.length}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
