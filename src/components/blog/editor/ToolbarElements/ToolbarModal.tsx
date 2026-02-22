import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ToolbarModal({ open, onOpenChange }: Props) {
  const [editor] = useLexicalComposerContext();

  const [rows, setRows] = useState("3");
  const [columns, setColumns] = useState("3");

  const handleCreate = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows,
      columns,
    });

    onOpenChange(false);
    editor.focus();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Enter rows and columns</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="rows" className="text-sm font-medium">
              Rows
            </label>
            <Input
              id="rows"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              type="number"
              min={1}
              max={500}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="columns" className="text-sm font-medium">
              Columns
            </label>
            <Input
              id="columns"
              value={columns}
              onChange={(e) => setColumns(e.target.value)}
              type="number"
              min={1}
              max={50}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
