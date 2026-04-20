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
    <section className="blog-editor-debug-export" aria-label="Bảng gỡ lỗi xuất DOM">
      <div className="blog-editor-debug-export-title">DOM đã xuất (HTML)</div>
      <pre className="blog-editor-debug-export-content">{exportedHtml || "<trống>"}</pre>
    </section>
  );
}
