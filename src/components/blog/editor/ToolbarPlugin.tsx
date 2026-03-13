import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $isHeadingNode, $createHeadingNode } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";

import { $isCodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import { $createQuoteNode, $isQuoteNode } from "@lexical/rich-text";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { useCallback, useEffect, useState } from "react";

import { useImageInsert, type ImageUploadHandler } from "./ImagePlugin";
import FloatingLinkEditor from "./FloatingLinkEditor";
import { BlockType } from "../type";
import { TooltipProvider } from "@/components/ui/tooltip";
import ToolbarButton from "./ToolbarElements/ToolbarButton";
import ToolbarDivider from "./ToolbarElements/ToolbarDivider";
import BlockTypeDropdown from "./ToolbarElements/ToolbarBlockTypeDropdown";
import LinkInlineEditor from "./ToolbarElements/ToolbarLinkInlineButton";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ImagePlus,
  Italic,
  Link,
  Strikethrough,
  Table,
  Underline,
} from "lucide-react";

// --- Main Toolbar Plugin ---
type ToolbarPluginProps = {
  onImageUpload?: ImageUploadHandler;
  modalOpen?: boolean;
  setModalOpen?: (open: boolean) => void;
};

export default function ToolbarPlugin({
  onImageUpload,
  // modalOpen,
  setModalOpen,
}: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [, setCanUndo] = useState(false);
  const [, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [align, setAlign] = useState<"left" | "center" | "right" | "justify">("left");

  // Image insert helper
  const { fileInputRef, handleFileChange, triggerFileInput } = useImageInsert(onImageUpload);

  // Link editor hook
  const {
    isLink,
    isEditMode,
    editUrl,
    setEditUrl,
    handleInsertLink,
    handleConfirmLink,
    handleCancelLink,
  } = FloatingLinkEditor();

  // --- Update toolbar state from selection ---
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && parent.getKey() === "root";
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      if ($isElementNode(element)) {
        const format = element.getFormatType();
        setAlign(format as "left" | "center" | "right" | "justify");
      }

      if ($isHeadingNode(element)) {
        const tag = element.getTag();
        setBlockType(tag as BlockType);
      } else if ($isListNode(element)) {
        const listType = (element as ListNode).getListType();
        setBlockType(listType === "bullet" ? "bullet" : "number");
      } else if ($isQuoteNode(element)) {
        setBlockType("quote");
      } else if ($isCodeNode(element)) {
        setBlockType("paragraph");
      } else {
        setBlockType("paragraph");
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        1, // COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        1,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        1,
      ),
    );
  }, [editor, updateToolbar]);

  // --- Block type actions ---
  const handleBlockTypeChange = useCallback(
    (type: BlockType) => {
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
          case "bullet":
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            break;
          case "number":
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            break;
        }
      });

      requestAnimationFrame(() => {
        editor.focus();
      });
    },
    [editor],
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="blog-toolbar">
        {/* Undo / Redo */}
        {/* <ToolbarButton
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="size-4" />
        </ToolbarButton>

        <ToolbarDivider /> */}

        {/* Block type selector */}
        <BlockTypeDropdown blockType={blockType} onChange={handleBlockTypeChange} />

        <ToolbarDivider />

        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          isActive={isBold}
          title="Bold (Ctrl+B)"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
          isActive={isItalic}
          title="Italic (Ctrl+I)"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
          isActive={isUnderline}
          title="Underline (Ctrl+U)"
        >
          <Underline className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
          isActive={isStrikethrough}
          title="Strikethrough"
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>
        {/* <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          isActive={isCode}
          title="Inline Code"
        >
          <Code className='size-4' />
        </ToolbarButton> */}

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton
          onClick={handleInsertLink}
          isActive={isLink}
          title={isLink ? "Remove Link" : "Insert Link"}
        >
          <Link className="size-4" />
        </ToolbarButton>

        {/* Image upload */}
        <ToolbarButton onClick={triggerFileInput} title="Insert Image">
          <ImagePlus className="size-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <ToolbarDivider />

        {/* Text alignment */}
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
          title="Align Left"
          isActive={align === "left"}
        >
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
          title="Align Center"
          isActive={align === "center"}
        >
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
          title="Align Right"
          isActive={align === "right"}
        >
          <AlignRight className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
          title="Justify"
          isActive={align === "justify"}
        >
          <AlignJustify className="size-4" />
        </ToolbarButton>

        <ToolbarDivider />
        <ToolbarButton
          onClick={() => {
            if (setModalOpen) {
              setModalOpen(true);
            }
          }}
          title="Insert Table"
        >
          <Table className="size-4" />
        </ToolbarButton>

        {/* Link inline editor (shown below toolbar when editing a link) */}
        <LinkInlineEditor
          isEditMode={isEditMode}
          editUrl={editUrl}
          setEditUrl={setEditUrl}
          onConfirm={handleConfirmLink}
          onCancel={handleCancelLink}
        />
      </div>
    </TooltipProvider>
  );
}
