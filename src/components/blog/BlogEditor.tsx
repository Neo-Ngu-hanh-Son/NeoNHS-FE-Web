import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

import { TRANSFORMERS } from "@lexical/markdown";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";

import { editorTheme, ImageNode, ToolbarPlugin } from "./editor";
import type { ImageUploadHandler } from "./editor";

import "./editor/styles/BlogEditor.css";
import TableCellResizerPlugin from "./editor/TableCellResizerPlugin/TableCellResizerPlugin";
import TableActionMenuPlugin from "./editor/TableActionMenuPlugin";
import ToolbarModal from "./editor/ToolbarElements/ToolbarModal";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import ClickableLinkPlugin from "./editor/ClickableLinkPlugin";
import { BlogEditorRef, EditorSaveResult } from "./type";
import { $getRoot, LexicalEditor } from "lexical";
import EditorRefPlugin from "./editor/EditorRefPlugin";
import { $generateHtmlFromNodes } from "@lexical/html";

// --- Props ---
type BlogEditorProps = {
  /** Optional callback to handle image uploads. Returns the URL of the uploaded image. */
  onImageUpload?: ImageUploadHandler;
  /** Optional initial editor state as JSON string. */
  initialEditorState?: string;
  /** Optional callback called when editor state changes. */
  onChange?: (editorStateJSON: string) => void;
  /** Optional callback called when editor state is saved. */
  onSave: (editorStateJSON: EditorSaveResult) => void;
};

// --- Lexical node registration ---
const EDITOR_NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode,
  ImageNode,
  TableNode,
  TableCellNode,
  TableRowNode,
];

// --- Link validation ---
function validateUrl(url: string): boolean {
  return /^https?:\/\//.test(url) || url.startsWith("/") || url.startsWith("mailto:");
}

// --- Editor error handler ---
function onError(error: Error) {
  console.error("[BlogEditor] Lexical error:", error);
}

// --- Placeholder component ---
function EditorPlaceholder() {
  return <div className="blog-editor-placeholder">Start writing your blog post…</div>;
}
import CharacterCountPlugin from "./editor/CharacterCountPlugin";

const BlogEditor = forwardRef<BlogEditorRef, BlogEditorProps>(
  ({ onSave, onImageUpload, initialEditorState, onChange }, ref) => {
    const editorRef = useRef<LexicalEditor | null>(null);
    const [open, setOpen] = useState(false);
    const initialConfig = {
      namespace: "BlogEditor",
      theme: editorTheme,
      nodes: EDITOR_NODES,
      onError,
      ...(initialEditorState ? { editorState: initialEditorState } : {}),
    };

    useImperativeHandle(ref, () => ({
      save() {
        if (!editorRef.current) return;
        const editor = editorRef.current;
        if (!editor) return;

        editor.read(() => {
          const lexicalJSON = JSON.stringify(editor.getEditorState().toJSON());
          const html = $generateHtmlFromNodes(editor);
          const textContent = $getRoot().getTextContent();
          const charCount = textContent.trim().length;
          onSave({ lexicalJSON, html, charCount });
        });
      },

      getJSON() {
        if (!editorRef.current) return "";
        return JSON.stringify(editorRef.current.getEditorState().toJSON());
      },
    }));

    return (
      <div className="blog-editor-container">
        <LexicalComposer initialConfig={initialConfig}>
          <EditorRefPlugin onReady={(editor) => (editorRef.current = editor)} />

          <ToolbarPlugin onImageUpload={onImageUpload} modalOpen={open} setModalOpen={setOpen} />

          <div className="blog-editor-content-wrapper">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="blog-editor-content" spellCheck={false} />
              }
              placeholder={<EditorPlaceholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>

          {/* Core plugins */}
          <HistoryPlugin />
          <TablePlugin />
          <TableActionMenuPlugin />
          <TableCellResizerPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin validateUrl={validateUrl} />
          <ClickableLinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <CharacterCountPlugin />
          <ToolbarModal open={open} onOpenChange={setOpen} />
        </LexicalComposer>
      </div>
    );
  },
);

export default BlogEditor;
