import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useEffect, useState } from "react";
import type { JSX } from "react";

export default function DomExportDebugPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [exportedHtml, setExportedHtml] = useState("");

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        setExportedHtml(html);
      });
    });
  }, [editor]);

  return (
    <section className="blog-editor-debug-export" aria-label="DOM export debug panel">
      <div className="blog-editor-debug-export-title">Exported DOM (HTML)</div>
      <pre className="blog-editor-debug-export-content">{exportedHtml || "<empty>"}</pre>
    </section>
  );
}
