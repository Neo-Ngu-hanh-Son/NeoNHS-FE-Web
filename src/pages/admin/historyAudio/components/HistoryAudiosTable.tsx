import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import type { HistoryAudioResponse } from "@/types/historyAudio";

interface HistoryAudiosTableProps {
  audios: HistoryAudioResponse[];
  activeAudioId: string | null;
  hasAudio: boolean;
  text: string;
  onNewAudio: () => void;
  onSelectAudio: (id: string) => void;
}

export default function HistoryAudiosTable({
  audios,
  activeAudioId,
  hasAudio,
  text,
  onNewAudio,
  onSelectAudio,
}: HistoryAudiosTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Audio Entries</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={onNewAudio}
            disabled={!activeAudioId && !text && !hasAudio}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Audio
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {audios.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            No history audios yet. Use the form below to create one.
          </p>
        ) : (
          <div className="max-h-[220px] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead className="w-[90px]">Cover</TableHead>
                  <TableHead className="w-[180px]">Title</TableHead>
                  <TableHead className="w-[160px]">Artist</TableHead>
                  <TableHead>Text Preview</TableHead>
                  <TableHead className="w-[100px]">Language</TableHead>
                  <TableHead className="w-[90px]">Source</TableHead>
                  <TableHead className="w-[70px]">Audio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audios.map((entry, idx) => {
                  const isSelected = entry.id === activeAudioId;
                  const lang = entry.metadata?.language?.toUpperCase() ?? "-";
                  const source = entry.metadata?.mode ?? "-";
                  const hasEntryAudio = Boolean(entry.audioUrl);
                  const coverImage = entry.metadata?.coverImage ?? "";
                  const title = entry.metadata?.title ?? "-";
                  const artist = entry.metadata?.artist ?? "-";
                  const preview = entry.historyText
                    ? entry.historyText.length > 60
                      ? `${entry.historyText.slice(0, 60)}...`
                      : entry.historyText
                    : "-";

                  return (
                    <TableRow
                      key={entry.id}
                      className={`cursor-pointer transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-muted/50"}`}
                      onClick={() => onSelectAudio(entry.id)}
                    >
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={title !== "-" ? `${title} cover` : "Cover image"}
                            className="h-10 w-10 rounded object-cover border"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{title}</TableCell>
                      <TableCell className="text-sm">{artist}</TableCell>
                      <TableCell className="text-sm">{preview}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs capitalize text-muted-foreground">
                        {source}
                      </TableCell>
                      <TableCell>
                        {hasEntryAudio ? (
                          <Badge variant="default" className="text-xs">
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            No
                          </Badge>
                        )}
                      </TableCell>
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
