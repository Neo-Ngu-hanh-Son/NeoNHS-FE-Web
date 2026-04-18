import { Spinner } from "@/components/ui/spinner";
import { Suspense, useCallback, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { NodeKey } from "node_modules/lexical/LexicalNode";
import { $isImageNode } from "./ImageHelpers";
import { $getNodeByKey } from "lexical";

// --- Image component rendered in the editor ---
export default function ImageComponent({
  src,
  altText,
  width,
  height,
  maxWidth,
  nodeKey,
}: {
  src: string;
  altText: string;
  width: 'inherit' | number;
  height: 'inherit' | number;
  maxWidth: number;
  nodeKey: NodeKey;
}) {
  const [editor] = useLexicalComposerContext();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewSizeRef = useRef<{ width: number; height: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [previewSize, setPreviewSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const onLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const onError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleResizeStart = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement>,
      corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
    ) => {
      event.preventDefault();
      event.stopPropagation();

      const image = imageRef.current;
      if (!image) return;

      const rect = image.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = rect.width;
      const startHeight = rect.height;
      const aspectRatio = startWidth / Math.max(startHeight, 1);
      previewSizeRef.current = {
        width: Math.round(startWidth),
        height: Math.round(startHeight),
      };

      setIsResizing(true);

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        const isFreeResize = moveEvent.shiftKey;

        const horizontalSign =
          corner === 'top-left' || corner === 'bottom-left' ? -1 : 1;
        const verticalSign =
          corner === 'top-left' || corner === 'top-right' ? -1 : 1;

        const rawNextWidth = Math.max(
          80,
          Math.round(startWidth + deltaX * horizontalSign),
        );
        const rawNextHeight = Math.max(
          80,
          Math.round(startHeight + deltaY * verticalSign),
        );

        let nextWidth = rawNextWidth;
        let nextHeight = rawNextHeight;

        if (!isFreeResize) {
          const useHorizontalDelta =
            Math.abs(deltaX) >= Math.abs(deltaY);

          if (useHorizontalDelta) {
            nextHeight = Math.max(80, Math.round(nextWidth / aspectRatio));
          } else {
            nextWidth = Math.max(80, Math.round(nextHeight * aspectRatio));
          }
        }

        setPreviewSize({ width: nextWidth, height: nextHeight });
        previewSizeRef.current = { width: nextWidth, height: nextHeight };
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        setIsResizing(false);

        const finalSize = previewSizeRef.current;
        if (!finalSize) {
          return;
        }

        const finalWidth = finalSize.width;
        const finalHeight = finalSize.height;

        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if (node) {
            if ($isImageNode(node)) {
              node.setWidthAndHeight(finalWidth, finalHeight);
            }
          }
        });

        setPreviewSize(null);
        previewSizeRef.current = null;
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [editor, nodeKey],
  );

  const currentWidth = previewSize
    ? previewSize.width
    : width === 'inherit'
      ? undefined
      : width;
  const currentHeight = previewSize
    ? previewSize.height
    : height === 'inherit'
      ? undefined
      : height;
  const showResizeControls = isHovered || isResizing;

  return (
    <Suspense fallback={<Spinner />}>
      <div
        className="blog-editor-image-wrapper"
        data-node-key={nodeKey}
      >
        {isLoading && (
          <div className="blog-editor-image-placeholder">
            <Spinner />
          </div>
        )}
        {hasError ? (
          <div className="blog-editor-image-error">
            <span>⚠️ Không tải được ảnh</span>
          </div>
        ) : (
          <div
            className="blog-editor-image-frame"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              ref={imageRef}
              src={src}
              alt={altText}
              className={`blog-editor-image ${showResizeControls ? 'blog-editor-image-selected' : ''} ${isResizing ? 'blog-editor-image-resizing' : ''}`}
              style={{
                maxWidth,
                width: currentWidth ?? (width === 'inherit' ? '100%' : width),
                height: currentHeight ?? (height === 'inherit' ? 'auto' : height),
              }}
              onLoad={onLoad}
              onError={onError}
              draggable={false}
            />
            {!hasError && showResizeControls && (
              <>
                <div className="blog-editor-image-hint">
                  Giữ Shift để thay đổi kích thước tự do
                </div>
                <button
                  type="button"
                  className="blog-editor-image-handle top-left"
                  onMouseDown={(event) => handleResizeStart(event, 'top-left')}
                  aria-label="Thay đổi kích thước ảnh từ góc trên trái"
                />
                <button
                  type="button"
                  className="blog-editor-image-handle top-right"
                  onMouseDown={(event) => handleResizeStart(event, 'top-right')}
                  aria-label="Thay đổi kích thước ảnh từ góc trên phải"
                />
                <button
                  type="button"
                  className="blog-editor-image-handle bottom-left"
                  onMouseDown={(event) => handleResizeStart(event, 'bottom-left')}
                  aria-label="Thay đổi kích thước ảnh từ góc dưới trái"
                />
                <button
                  type="button"
                  className="blog-editor-image-handle bottom-right"
                  onMouseDown={(event) => handleResizeStart(event, 'bottom-right')}
                  aria-label="Thay đổi kích thước ảnh từ góc dưới phải"
                />
              </>
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
}