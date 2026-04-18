import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Trash2, Eye } from 'lucide-react';
import type { PointPanoramaResponse } from '@/types';

interface PanoramaEditorHeaderProps {
  panorama: PointPanoramaResponse | null;
  targetId: string;
  entityLabel: string;
  saving: boolean;
  hasImage: boolean;
  onSave: () => void;
  onDelete: () => void;
}

export default function PanoramaEditorHeader({
  panorama,
  targetId,
  entityLabel,
  saving,
  hasImage,
  onSave,
  onDelete,
}: PanoramaEditorHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-xl font-bold">
            {panorama ? 'Edit' : 'Create'} Panorama for: {panorama?.name && `${panorama.name}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            {entityLabel} · {targetId}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/panorama/${targetId}`, '_blank')}
            className="gap-1"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        )}

        {panorama && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Panorama?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove the panorama image and all hot spots for this {entityLabel.toLowerCase()}
                  . This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive text-white hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <Button onClick={onSave} disabled={saving} size="sm" className="gap-1">
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save Panorama'}
        </Button>
      </div>
    </div>
  );
}
