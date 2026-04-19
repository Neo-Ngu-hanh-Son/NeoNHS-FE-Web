import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $getRoot } from "lexical";

type Props = {
  onChangeCount?: (count: number) => void;
};

export default function CharacterCountPlugin({ onChangeCount }: Props) {
  const [editor] = useLexicalComposerContext();
  const [count, setCount] = useState(0);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        const charCount = text.length;

        setCount(charCount);
        onChangeCount?.(charCount);
      });
    });
  }, [editor, onChangeCount]);

  return <div className="text-xs text-muted-foreground text-right m-4">{count} ký tự</div>;
}
