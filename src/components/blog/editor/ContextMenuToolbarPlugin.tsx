import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Point = {
  x: number;
  y: number;
};

export default function ContextMenuToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) {
      return;
    }

    const handleContextMenu = (event: MouseEvent) => {
      if (!rootElement.contains(event.target as Node)) {
        return;
      }

      event.preventDefault();
      setPosition({ x: event.clientX, y: event.clientY });
      setOpen(true);
    };

    rootElement.addEventListener("contextmenu", handleContextMenu);

    return () => {
      rootElement.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [editor]);

  const applyTextFormat = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    requestAnimationFrame(() => editor.focus());
  };

  const applyBlockType = (type: "paragraph" | "h1" | "h2" | "h3" | "h4" | "quote") => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      switch (type) {
        case "paragraph":
          $setBlocksType(selection, () => $createParagraphNode());
          break;
        case "h1":
        case "h2":
        case "h3":
        case "h4":
          $setBlocksType(selection, () => $createHeadingNode(type));
          break;
        case "quote":
          $setBlocksType(selection, () => $createQuoteNode());
          break;
      }
    });

    requestAnimationFrame(() => editor.focus());
  };

  const applyAlignment = (align: "left" | "center" | "right" | "justify") => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
    requestAnimationFrame(() => editor.focus());
  };

  const applyList = (type: "bullet" | "number") => {
    if (type === "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
    requestAnimationFrame(() => editor.focus());
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="blog-context-trigger"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          aria-hidden="true"
          tabIndex={-1}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={6} className="blog-context-menu-vertical">
        <DropdownMenuLabel>Text</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => applyTextFormat("bold")}>Bold</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => applyTextFormat("italic")}>Italic</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => applyTextFormat("underline")}>Underline</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => applyTextFormat("strikethrough")}>Strikethrough</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Block</DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Heading</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => applyBlockType("h1")}>Heading 1</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => applyBlockType("h2")}>Heading 2</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => applyBlockType("h3")}>Heading 3</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => applyBlockType("h4")}>Heading 4</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onSelect={() => applyBlockType("paragraph")}>Paragraph</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => applyBlockType("quote")}>Quote</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => applyList("bullet")}>Bullet List</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => applyList("number")}>Numbered List</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Align</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => applyAlignment("left")}>Left</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => applyAlignment("center")}>Center</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => applyAlignment("right")}>Right</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => applyAlignment("justify")}>Justify</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
