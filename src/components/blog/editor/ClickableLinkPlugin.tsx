import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, $getNearestNodeFromDOMNode } from "lexical";
import { $isLinkNode } from "@lexical/link";
import { useEffect } from "react";

export default function ClickableLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerRootListener((root) => {
      if (!root) return;

      const onClick = (e: MouseEvent) => {
        // only open if Ctrl+Click
        if (!e.ctrlKey) return;

        const target = e.target as HTMLElement;

        editor.read(() => {
          const node = $getNearestNodeFromDOMNode(target);
          if (!node) return;

          const linkNode = $isLinkNode(node) ? node : $findMatchingParent(node, $isLinkNode);

          if (linkNode) {
            window.open(linkNode.getURL(), "_blank");
          }
        });
      };

      root.addEventListener("click", onClick);

      return () => {
        root.removeEventListener("click", onClick);
      };
    });
  }, [editor]);

  return null;
}
