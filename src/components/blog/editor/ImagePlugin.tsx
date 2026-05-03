import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, $insertNodes } from 'lexical';
import { useCallback, useRef } from 'react';
import { createImageNode, ImageNode } from './ImageComponents/ImageNode';

export type ImageUploadHandler = (file: File) => Promise<string>;

export function useImageInsert(onUpload?: ImageUploadHandler) {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Insert a placeholder image immediately (preview or loading)
   * and return the nodeKey so we can update it later.
   */
  const insertImagePlaceholder = useCallback(
    (src: string, altText: string) => {
      let nodeKey: string | null = null;

      editor.update(() => {
        const imageNode = createImageNode({
          src,
          altText,
          width: 400, // Smaller initial size for user to scale by themselves
          style: {
            filter: 'blur(10px)',
            opacity: '0.6',
            transition: 'all 0.2s ease',
          },
        });

        $insertNodes([imageNode]);
        nodeKey = imageNode.getKey();
      });

      return nodeKey;
    },
    [editor],
  );

  /**
   * Update an existing ImageNode by key (replace placeholder with real URL)
   */
  const updateImageNodeSrc = useCallback(
    (nodeKey: string, newSrc: string, newAltText: string) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);

        if (node instanceof ImageNode) {
          node.setSrc(newSrc);
          node.setAltText(newAltText);
          node.setStyle({
            filter: 'blur(0px)',
            opacity: '1',
            transition: 'all 0.2s ease',
          });
        }
      });
    },
    [editor],
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const file = files[0];

      const previewSrc = await readFileAsDataURL(file);
      const nodeKey = insertImagePlaceholder(previewSrc, 'Đang tải lên...');

      try {
        let finalSrc: string;

        if (onUpload) {
          finalSrc = await onUpload(file);
        } else {
          finalSrc = previewSrc;
          finalSrc = previewSrc;
        }

        if (nodeKey && finalSrc) {
          updateImageNodeSrc(nodeKey, finalSrc, file.name);
        } else {
          if (nodeKey) {
            editor.update(() => {
              const node = $getNodeByKey(nodeKey);
              node?.remove();
            });
          }
        }
      } catch (error) {
        console.error('Image upload failed:', error);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [editor, onUpload, insertImagePlaceholder, updateImageNodeSrc],
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    handleFileChange,
    triggerFileInput,
  };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
