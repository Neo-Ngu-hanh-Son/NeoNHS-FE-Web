import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

import { $applyNodeReplacement, $getNodeByKey, DecoratorNode } from "lexical";
import React, { Suspense, useCallback, useRef, useState } from "react";
import ImageComponent from "./ImageComponent";
// --- Serialized shape ---
export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    maxWidth: number;
    src: string;
    width?: number;
    style?: React.CSSProperties;
  },
  SerializedLexicalNode
>;

// --- Conversion helpers ---
function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode;
    const node = createImageNode({ altText, src, width, height });
    return { node };
  }
  return null;
}

// --- ImageNode class ---
export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __altText: string;
  __width: "inherit" | number;
  __height: "inherit" | number;
  __maxWidth: number;
  __style?: React.CSSProperties;


  static getType(): string {
    return "image";
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src, style } = serializedNode;
    return createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
      style,
    });
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__maxWidth, node.__width, node.__height, node.__style, node.getKey());
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number = 800,
    width?: "inherit" | number,
    height?: "inherit" | number,
    style?: React.CSSProperties,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__style = style;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    element.setAttribute("width", this.__width.toString());
    element.setAttribute("height", this.__height.toString());
    // Don't export style to DOM
    element.className = "blog-editor-image";
    return { element };
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
      style: this.__style,
    };
  }

  setWidthAndHeight(width: "inherit" | number, height: "inherit" | number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  setSrc(src: string): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  setStyle(style: React.CSSProperties): void {
    const writable = this.getWritable();
    writable.__style = style;
  }


  decorate(_editor: LexicalEditor): React.JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
      />
    );
  }
}

// --- Helper functions ---
export function createImageNode({
  altText,
  height,
  maxWidth = 800,
  src,
  width,
  key,
  style,
}: {
  altText: string;
  height?: "inherit" | number;
  maxWidth?: number;
  src: string;
  width?: "inherit" | number;
  key?: NodeKey;
  style?: React.CSSProperties;
}): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText, maxWidth, width, height, style, key));
}
