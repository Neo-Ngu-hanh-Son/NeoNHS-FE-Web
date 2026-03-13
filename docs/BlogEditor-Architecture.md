# Blog Editor — Architecture & Component Guide

> **Stack:** React · [Lexical](https://lexical.dev/) rich‑text framework · Vanilla CSS  
> **Location:** `src/components/blog/BlogEditor.tsx` + `src/components/blog/editor/*`

---

## 1. High-Level Overview

The Blog Editor is a **Lexical-based** rich-text editor designed for writing blog posts within the NeoNHS admin web app. It is composed of a **main orchestrator component** (`BlogEditor`) and several **sub-components/plugins** located in the `editor/` folder.

### File Map

```
src/components/blog/
├── BlogEditor.tsx              ← Main entry component (the editor itself)
└── editor/
    ├── index.ts                ← Barrel re-exports for all editor pieces
    ├── EditorTheme.ts          ← Lexical theme class-name map
    ├── BlogEditor.css          ← All editor styles (587 lines)
    ├── ToolbarPlugin.tsx       ← Toolbar UI + formatting commands
    ├── FloatingLinkEditor.tsx  ← Link insert / edit / remove logic (hook)
    ├── ImageNode.tsx           ← Custom Lexical DecoratorNode for images
    └── ImagePlugin.tsx         ← Image insertion hook + optional upload handler
```

---

## 2. Data-Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         BlogEditor (Root)                            │
│                                                                      │
│  Props:                                                              │
│  ┌─────────────────────┬──────────────────────────────────────────┐  │
│  │ onImageUpload?      │ (file: File) => Promise<string>         │  │
│  │ initialEditorState? │ JSON string to hydrate the editor       │  │
│  │ onChange?            │ (editorStateJSON: string) => void       │  │
│  └─────────────────────┴──────────────────────────────────────────┘  │
│                                                                      │
│ ┌─── LexicalComposer ─────────────────────────────────────────────┐  │
│ │  initialConfig = { namespace, theme, nodes, onError, editorState} │
│ │                                                                   │
│ │  ┌───────────────────────────────────────────────────────────┐    │
│ │  │                   ToolbarPlugin                           │    │
│ │  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │    │
│ │  │  │ Undo / Redo  │  │ Block Type   │  │ Text Format    │  │    │
│ │  │  │              │  │ Dropdown     │  │ Bold, Italic …│  │    │
│ │  │  └──────────────┘  └──────────────┘  └────────────────┘  │    │
│ │  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │    │
│ │  │  │ Link Insert  │  │ Image Insert │  │ Alignment      │  │    │
│ │  │  │ (+ inline    │  │ (file input) │  │ L / C / R / J  │  │    │
│ │  │  │  editor)     │  │              │  │                │  │    │
│ │  │  └──────────────┘  └──────────────┘  └────────────────┘  │    │
│ │  └───────────────────────────────────────────────────────────┘    │
│ │                                                                   │
│ │  ┌───────────────────────────────────────────────────────────┐    │
│ │  │                 RichTextPlugin                            │    │
│ │  │   ContentEditable  +  Placeholder                        │    │
│ │  └───────────────────────────────────────────────────────────┘    │
│ │                                                                   │
│ │  ┌─ Core Plugins ───────────────────────────────────────────┐    │
│ │  │ HistoryPlugin · AutoFocusPlugin · ListPlugin            │    │
│ │  │ LinkPlugin · ImagePlugin · MarkdownShortcutPlugin        │    │
│ │  └──────────────────────────────────────────────────────────┘    │
│ └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Flow in Words

1. **`BlogEditor`** creates a `LexicalComposer` with a config that specifies the **namespace**, **theme**, **registered nodes**, and an optional **initial editor state** (for editing existing posts).
2. Inside the composer, the **`ToolbarPlugin`** listens to editor state changes via `editor.registerUpdateListener` and `SELECTION_CHANGE_COMMAND` to keep its button states (bold active?, current block type, etc.) in sync with the cursor position.
3. When the user clicks a toolbar button, the toolbar dispatches a **Lexical command** (e.g. `FORMAT_TEXT_COMMAND`, `UNDO_COMMAND`, `FORMAT_ELEMENT_COMMAND`) or mutates the editor state directly (e.g. `$setBlocksType` for heading/quote changes).
4. The **`RichTextPlugin`** renders the actual editable content area (`ContentEditable`) and a placeholder.
5. Several **core plugins** are mounted as siblings and participate in the Lexical plugin lifecycle:
   - `HistoryPlugin` — undo/redo stack
   - `AutoFocusPlugin` — focuses the editor on mount
   - `ListPlugin` — bullet/numbered list support
   - `LinkPlugin` — link node support with URL validation
   - `ImagePlugin` — registers the image upload/insert pipeline
   - `MarkdownShortcutPlugin` — lets users type markdown shortcuts (e.g., `# ` → H1)

---

## 3. Individual Component Deep-Dives

### 3.1 `BlogEditor.tsx` — Main Entry Point

| Item      | Details                                                     |
| --------- | ----------------------------------------------------------- |
| **File**  | `src/components/blog/BlogEditor.tsx`                        |
| **Lines** | ~109                                                        |
| **Role**  | Orchestrator — glues LexicalComposer, plugins, and toolbar. |

**Key Responsibilities:**

- **Node Registration (`EDITOR_NODES`):** Declares every custom and built-in Lexical node the editor understands:
  - `HeadingNode`, `QuoteNode` — rich-text blocks
  - `ListNode`, `ListItemNode` — bulleted/numbered lists
  - `CodeNode`, `CodeHighlightNode` — code blocks with syntax tokens
  - `LinkNode`, `AutoLinkNode` — hyperlinks
  - `ImageNode` — custom image decorator node
  - `TableNode`, `TableCellNode`, `TableRowNode` — table support
- **URL Validation (`validateUrl`):** Allows `https://`, `http://`, relative paths (`/…`), and `mailto:` links.
- **Error Handler:** Logs Lexical errors to the console.
- **Placeholder:** Renders _"Start writing your blog post…"_ when the editor is empty.
- **Props passthrough:** Forwards `onImageUpload` to both `ToolbarPlugin` and `ImagePlugin`.

---

### 3.2 `ToolbarPlugin.tsx` — Formatting Toolbar

| Item      | Details                                                 |
| --------- | ------------------------------------------------------- |
| **File**  | `src/components/blog/editor/ToolbarPlugin.tsx`          |
| **Lines** | ~479                                                    |
| **Role**  | All toolbar UI, state syncing, and command dispatching. |

#### Sub-components inside the file:

| Sub-component       | Purpose                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `ToolbarDivider`    | Visual `                                                                                          | ` separator between button groups. |
| `ToolbarButton`     | Reusable icon button with `isActive` highlight and `disabled` state.                              |
| `BlockTypeDropdown` | Dropdown selector for block types: Normal, H1–H4, Quote, Bulleted/Numbered List.                  |
| `LinkInlineEditor`  | Inline URL input that appears when the user clicks the link button (Enter confirms, Esc cancels). |

#### Toolbar State Variables:

| State             | Type        | Tracks                                                      |
| ----------------- | ----------- | ----------------------------------------------------------- |
| `canUndo`         | `boolean`   | Whether the undo stack has entries.                         |
| `canRedo`         | `boolean`   | Whether the redo stack has entries.                         |
| `isBold`          | `boolean`   | Whether the current selection has bold formatting.          |
| `isItalic`        | `boolean`   | Whether the current selection has italic formatting.        |
| `isUnderline`     | `boolean`   | Whether the current selection has underline formatting.     |
| `isStrikethrough` | `boolean`   | Whether the current selection has strikethrough formatting. |
| `isCode`          | `boolean`   | Whether the current selection has inline code formatting.   |
| `blockType`       | `BlockType` | The current block type (paragraph, h1–h4, quote, etc.).     |

#### How it syncs with the editor:

```
editor.registerUpdateListener → calls updateToolbar()
editor.registerCommand(SELECTION_CHANGE_COMMAND) → calls updateToolbar()
editor.registerCommand(CAN_UNDO_COMMAND) → sets canUndo
editor.registerCommand(CAN_REDO_COMMAND) → sets canRedo
```

The `updateToolbar()` function reads the current `$getSelection()`, inspects format flags (`hasFormat('bold')`, etc.), and walks up the node tree to determine the current block type.

#### Toolbar Button Groups (in order):

1. **Undo / Redo** — dispatches `UNDO_COMMAND` / `REDO_COMMAND`
2. **Block Type Dropdown** — switches between paragraph, headings (H1–H4), quote, and lists via `$setBlocksType` or list insert commands
3. **Text Formatting** — Bold, Italic, Underline, Strikethrough, Inline Code — dispatches `FORMAT_TEXT_COMMAND`
4. **Link** — toggles link; opens inline URL editor via `FloatingLinkEditor` hook
5. **Image** — triggers hidden `<input type="file">` via `useImageInsert` hook
6. **Alignment** — Left, Center, Right, Justify — dispatches `FORMAT_ELEMENT_COMMAND`

---

### 3.3 `FloatingLinkEditor.tsx` — Link Management Hook

| Item      | Details                                                 |
| --------- | ------------------------------------------------------- |
| **File**  | `src/components/blog/editor/FloatingLinkEditor.tsx`     |
| **Lines** | ~82                                                     |
| **Role**  | Custom hook for inserting, editing, and removing links. |

> **Note:** Despite the name, this is implemented as a **custom hook** (returns an object, not JSX). The actual inline editor UI lives inside `ToolbarPlugin` as `LinkInlineEditor`.

#### Returned API:

| Property            | Type                    | Description                                                 |
| ------------------- | ----------------------- | ----------------------------------------------------------- |
| `isLink`            | `boolean`               | Whether the cursor is inside a link node.                   |
| `linkUrl`           | `string`                | The URL of the currently selected link.                     |
| `isEditMode`        | `boolean`               | Whether the inline link editor is visible.                  |
| `editUrl`           | `string`                | The URL being typed in the inline editor.                   |
| `setEditUrl`        | `(url: string) => void` | Setter for the edit URL.                                    |
| `handleInsertLink`  | `() => void`            | If not in a link → opens editor; if in a link → removes it. |
| `handleConfirmLink` | `() => void`            | Applies the link via `TOGGLE_LINK_COMMAND`.                 |
| `handleCancelLink`  | `() => void`            | Closes the inline editor without applying.                  |

#### Flow:

```
User clicks Link button
  ├─ Cursor NOT in a link → setIsEditMode(true), pre-fill "https://"
  │    └─ User types URL, presses Enter → TOGGLE_LINK_COMMAND(url)
  │    └─ User presses Escape → cancel
  └─ Cursor IS in a link → TOGGLE_LINK_COMMAND(null) → removes link
```

---

### 3.4 `ImageNode.tsx` — Custom Lexical Image Node

| Item      | Details                                                   |
| --------- | --------------------------------------------------------- |
| **File**  | `src/components/blog/editor/ImageNode.tsx`                |
| **Lines** | ~253                                                      |
| **Role**  | Custom `DecoratorNode` that renders images in the editor. |

#### Architecture:

The file contains two main pieces:

1. **`ImageComponent`** — The React component rendered by the decorator node:
   - Shows a **loading spinner** while the image loads.
   - Shows an **error state** (`⚠️ Failed to load image`) on failure.
   - Renders the `<img>` element with click-to-select behavior.
   - Applies a blue outline (`blog-editor-image-selected`) when selected.

2. **`ImageNode` class** — Extends `DecoratorNode<JSX.Element>`:
   - **Properties:** `__src`, `__altText`, `__width`, `__height`, `__maxWidth`
   - **Static type:** `'image'`
   - **JSON serialization:** `importJSON()` / `exportJSON()` for saving/loading editor state.
   - **DOM conversion:** `importDOM()` converts pasted `<img>` elements into `ImageNode` instances; `exportDOM()` outputs an `<img>` element.
   - **`decorate()`:** Returns `<ImageComponent>` — this is how Lexical renders the node in React.

#### Helper functions:

| Function           | Purpose                                                     |
| ------------------ | ----------------------------------------------------------- |
| `$createImageNode` | Factory function that creates and applies node replacement. |
| `$isImageNode`     | Type guard — checks if a node is an `ImageNode`.            |

---

### 3.5 `ImagePlugin.tsx` — Image Insertion Pipeline

| Item      | Details                                                         |
| --------- | --------------------------------------------------------------- |
| **File**  | `src/components/blog/editor/ImagePlugin.tsx`                    |
| **Lines** | ~87                                                             |
| **Role**  | Provides the image upload/insert mechanism via a reusable hook. |

#### `ImagePlugin` Component

Renders **nothing** (`return null`). It exists solely as a Lexical plugin placeholder. All actual logic is in the hook below.

#### `useImageInsert` Hook

**Parameters:** `onUpload?: ImageUploadHandler` where `ImageUploadHandler = (file: File) => Promise<string>`

**Returned API:**

| Property           | Type                                      | Description                                                |
| ------------------ | ----------------------------------------- | ---------------------------------------------------------- |
| `fileInputRef`     | `React.RefObject<HTMLInputElement>`       | Ref to the hidden file input.                              |
| `handleFileChange` | `(event) => void`                         | Processes the selected file (upload or base64 fallback).   |
| `triggerFileInput` | `() => void`                              | Programmatically clicks the hidden file input.             |
| `insertImage`      | `(src: string, altText?: string) => void` | Inserts an `ImageNode` into the editor at cursor position. |

#### Image Insertion Flow:

```
User clicks Image toolbar button
  └─ triggerFileInput() → clicks hidden <input type="file" accept="image/*">
      └─ User selects a file
          └─ handleFileChange() fires
              ├─ onUpload provided? → await onUpload(file) → gets URL
              └─ No onUpload? → readFileAsDataURL(file) → gets base64 string
                  └─ insertImage(src, fileName) → editor.update → $insertNodes([ImageNode])
```

---

### 3.6 `EditorTheme.ts` — Lexical Theme Map

| Item      | Details                                     |
| --------- | ------------------------------------------- |
| **File**  | `src/components/blog/editor/EditorTheme.ts` |
| **Lines** | ~75                                         |
| **Role**  | Maps Lexical node types to CSS class names. |

This is a plain object of type `EditorThemeClasses` that Lexical uses to apply CSS classes to rendered DOM nodes. Key mappings:

| Lexical Element      | CSS Class                                          |
| -------------------- | -------------------------------------------------- |
| Heading H1–H5        | `blog-editor-h1` … `blog-editor-h5`                |
| Paragraph            | `blog-editor-paragraph`                            |
| Quote                | `blog-editor-quote`                                |
| Lists (ol/ul)        | `blog-editor-list-ol` / `-ul`                      |
| List Item            | `blog-editor-listitem`                             |
| Link                 | `blog-editor-link`                                 |
| Image                | `blog-editor-image`                                |
| Bold / Italic / etc. | `blog-editor-text-bold` / `-italic` / etc.         |
| Code block           | `blog-editor-code`                                 |
| Code tokens          | `blog-editor-tokenComment`, `-tokenProperty`, etc. |
| Table / Cell / Row   | `blog-editor-table`, `-table-cell`, etc.           |

---

### 3.7 `BlogEditor.css` — Styles

| Item      | Details                                     |
| --------- | ------------------------------------------- |
| **File**  | `src/components/blog/editor/BlogEditor.css` |
| **Lines** | ~587                                        |
| **Role**  | All visual styles for the editor.           |

#### Style Sections:

| Section                 | Description                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Editor Container**    | Rounded card with subtle shadow; focus-within shows blue border + ring.                                                           |
| **Toolbar**             | Sticky top bar with gradient background; wraps buttons with 2px gap.                                                              |
| **Toolbar Buttons**     | 34×34px icon buttons; transparent bg → light hover bg → blue active bg.                                                           |
| **Block Type Dropdown** | Trigger button + absolute-positioned dropdown menu with fade-in animation (`blog-dropdown-in`).                                   |
| **Link Inline Editor**  | Flex row with URL input + confirm(✓) / cancel(✕) buttons; confirm = blue, cancel = red; slide-in animation (`blog-link-fade-in`). |
| **Content Area**        | 400px min-height, 24px padding, blue caret color.                                                                                 |
| **Text Formatting**     | Bold → 700 weight, italic → font-style, underline/strikethrough → text-decoration, inline code → monospace with pink color.       |
| **Headings (H1–H5)**    | Decreasing sizes from 2em to 1em, decreasing weights.                                                                             |
| **Quote**               | Left blue border, light gradient background, italic.                                                                              |
| **Lists**               | Standard disc/decimal with 28px padding; checked items get a blue ✓ badge.                                                        |
| **Links**               | Blue with underline, darker on hover.                                                                                             |
| **Code Block**          | Dark slate background (#1e293b), monospace font, with syntax highlighting token colors.                                           |
| **Images**              | Centered, rounded corners, hover shadow, selected blue outline with glow; loading spinner and error states.                       |
| **Tables**              | Full-width, collapsed borders, header cells with light background.                                                                |

---

### 3.8 `index.ts` — Barrel Exports

| Item      | Details                                                 |
| --------- | ------------------------------------------------------- |
| **File**  | `src/components/blog/editor/index.ts`                   |
| **Lines** | 7                                                       |
| **Role**  | Re-exports all public pieces from the `editor/` folder. |

Exports:

- `ToolbarPlugin` (default from `ToolbarPlugin.tsx`)
- `ImagePlugin` (default), `useImageInsert` (named) from `ImagePlugin.tsx`
- `ImageUploadHandler` type from `ImagePlugin.tsx`
- `FloatingLinkEditor` (default from `FloatingLinkEditor.tsx`)
- `ImageNode`, `$createImageNode`, `$isImageNode` from `ImageNode.tsx`
- `editorTheme` (default from `EditorTheme.ts`)

---

## 4. Usage Example

```tsx
import BlogEditor from "@/components/blog/BlogEditor";

function CreateBlogPage() {
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const { url } = await res.json();
    return url; // returned URL is set as the image src
  };

  const handleChange = (editorStateJSON: string) => {
    // Save to form state, debounce auto-save, etc.
    console.log("Editor state:", editorStateJSON);
  };

  return (
    <BlogEditor
      onImageUpload={handleImageUpload}
      onChange={handleChange}
      // initialEditorState={existingPost.content} // for editing
    />
  );
}
```

---

## 5. Key Design Decisions

| Decision                               | Rationale                                                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Lexical over Slate/Quill/TipTap**    | Lexical is lightweight, extensible, and React-first with excellent tree-shaking.                                                |
| **Custom `ImageNode` (DecoratorNode)** | Decorator nodes let us render arbitrary React components (loading spinner, error state, selection UI) inside the editor canvas. |
| **`FloatingLinkEditor` as a hook**     | Keeps link logic reusable and testable; the UI itself stays in `ToolbarPlugin` for a unified toolbar layout.                    |
| **Base64 fallback for images**         | Enables local development and demos without requiring a running upload server.                                                  |
| **CSS-only styling (no Tailwind)**     | Follows the project convention; 587 lines of purpose-built CSS gives full control over every editor element.                    |
| **`MarkdownShortcutPlugin`**           | Power users can type `# `, `## `, `> `, `- `, `1. ` etc. and get instant block-type conversion.                                 |
| **Sticky toolbar**                     | The toolbar stays visible when scrolling long posts, improving UX.                                                              |

---

## 6. Potential Enhancements

- [ ] Wire up the `onChange` prop (currently accepted but not connected to `editor.registerUpdateListener`)
- [ ] Add drag-and-drop image support
- [ ] Add table insertion UI in the toolbar
- [ ] Add code block language selector
- [ ] Implement collaborative editing via Lexical's `yjs` binding
- [ ] Add dark mode theme variant
