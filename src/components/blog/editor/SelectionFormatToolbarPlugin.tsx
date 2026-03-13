import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";

type FloatingPosition = {
  top: number;
  left: number;
};

export default function SelectionFormatToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<FloatingPosition>({ top: 0, left: 0 });
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const hideToolbar = useCallback(() => {
    setIsVisible(false);
  }, []);

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        hideToolbar();
        return;
      }

      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) {
        hideToolbar();
        return;
      }

      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) {
        hideToolbar();
        return;
      }

      setPosition({
        top: Math.max(8, rect.top - 46),
        left: rect.left + rect.width / 2,
      });
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsVisible(true);
    });
  }, [editor, hideToolbar]);

  useEffect(() => {
    const onViewportChange = () => {
      if (isVisible) {
        updateToolbar();
      }
    };

    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);

    return () => {
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [isVisible, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updateToolbar();
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        1,
      ),
    );
  }, [editor, updateToolbar]);

  const handleTextFormat = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    requestAnimationFrame(() => editor.focus());
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="blog-selection-toolbar"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={(event) => event.preventDefault()}
    >
      <button
        type="button"
        className={`blog-selection-toolbar-btn ${isBold ? "active" : ""}`}
        onClick={() => handleTextFormat("bold")}
        aria-label="Bold"
      >
        <Bold className="size-4" />
      </button>
      <button
        type="button"
        className={`blog-selection-toolbar-btn ${isItalic ? "active" : ""}`}
        onClick={() => handleTextFormat("italic")}
        aria-label="Italic"
      >
        <Italic className="size-4" />
      </button>
      <button
        type="button"
        className={`blog-selection-toolbar-btn ${isUnderline ? "active" : ""}`}
        onClick={() => handleTextFormat("underline")}
        aria-label="Underline"
      >
        <Underline className="size-4" />
      </button>
      <button
        type="button"
        className={`blog-selection-toolbar-btn ${isStrikethrough ? "active" : ""}`}
        onClick={() => handleTextFormat("strikethrough")}
        aria-label="Strikethrough"
      >
        <Strikethrough className="size-4" />
      </button>
    </div>
  );
}
