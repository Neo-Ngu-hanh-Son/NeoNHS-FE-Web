import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import HotSpotList from "./HotSpotList";
import HotSpotFormModal from "./HotSpotFormModal";
import type { HotSpotFormValues } from "../schema";

interface HotSpotManagerProps {
  hotSpots: HotSpotFormValues[];
  /** Position captured from a preview click (auto-opens add modal) */
  clickedPosition: { yaw: number; pitch: number } | null;
  onAdd: (data: HotSpotFormValues) => void;
  onUpdate: (index: number, data: HotSpotFormValues) => void;
  onDelete: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onClearClickedPosition: () => void;
}

export default function HotSpotManager({
  hotSpots,
  clickedPosition,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onClearClickedPosition,
}: HotSpotManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Auto-open modal when a preview click position arrives
  if (clickedPosition && !modalOpen) {
    setEditingIndex(null);
    setModalOpen(true);
  }

  const handleAdd = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleSubmit = (data: HotSpotFormValues) => {
    if (editingIndex != null) {
      onUpdate(editingIndex, data);
    } else {
      onAdd(data);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingIndex(null);
    onClearClickedPosition();
  };

  const getInitialData = (): HotSpotFormValues | null => {
    if (editingIndex != null) {
      return hotSpots[editingIndex];
    }
    if (clickedPosition) {
      return {
        yaw: clickedPosition.yaw,
        pitch: clickedPosition.pitch,
        tooltip: "",
        title: "",
        description: "",
        imageUrl: "",
        orderIndex: hotSpots.length,
      };
    }
    return null;
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Hot Spots ({hotSpots.length})</h2>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Hot Spot
        </Button>
      </div>

      <HotSpotList
        hotSpots={hotSpots}
        onEdit={handleEdit}
        onDelete={onDelete}
        onReorder={onReorder}
      />

      <HotSpotFormModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={getInitialData()}
        editIndex={editingIndex}
      />
    </Card>
  );
}
