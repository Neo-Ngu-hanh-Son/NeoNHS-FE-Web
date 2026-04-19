import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $createTextNode, $getSelection, $isRangeSelection } from "lexical";
import { useCallback, useEffect, useState } from "react";
import { $findMatchingParent } from "@lexical/utils";

/**
 * FloatingLinkEditor — a floating popover that lets users add/edit/remove links.
 */
export default function FloatingLinkEditor() {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUrl, setEditUrl] = useState("");

  const updateLink = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      const linkNode = $isLinkNode(parent)
        ? parent
        : $isLinkNode(node)
          ? node
          : $findMatchingParent(node, $isLinkNode);

      if (linkNode) {
        setIsLink(true);
        setLinkUrl(linkNode.getURL());
      } else {
        setIsLink(false);
        setLinkUrl("");
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateLink();
      });
    });
  }, [editor, updateLink]);

  const handleInsertLink = useCallback(() => {
    if (!isLink) {
      setIsEditMode(true);
      setEditUrl("https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const handleConfirmLink = useCallback(() => {
    const url = editUrl.trim();
    if (!url) return;

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);

      const updatedSelection = $getSelection();
      if (!$isRangeSelection(updatedSelection)) return;

      const node = updatedSelection.anchor.getNode();
      const linkNode = $isLinkNode(node) ? node : node.getParent();

      if (linkNode && $isLinkNode(linkNode)) {
        //console.log("[FloatingLinkEditor] Adding a trailing space to link:", linkNode.getURL());
        const spaceNode = $createTextNode(" ");
        linkNode.insertAfter(spaceNode);
        spaceNode.selectNext();
      }
    });

    setIsEditMode(false);
    setEditUrl("");
  }, [editor, editUrl]);

  const handleCancelLink = useCallback(() => {
    setIsEditMode(false);
    setEditUrl("");
  }, []);

  return {
    isLink,
    linkUrl,
    isEditMode,
    editUrl,
    setEditUrl,
    handleInsertLink,
    handleConfirmLink,
    handleCancelLink,
  };
}
