import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import type { LexicalEditor } from "lexical";

type Props = {
  onReady: (editor: LexicalEditor) => void;
};

export default function EditorRefPlugin({ onReady }: Props) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    onReady(editor);
  }, [editor, onReady]);

  return null;
}
