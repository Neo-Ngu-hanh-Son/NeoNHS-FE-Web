import BlogEditor from "@/components/blog/BlogEditor";
import { BlogEditorRef, EditorSaveResult } from "@/components/blog/type";
import AdminPageContentLayout from "@/components/common/AdminPageContentLayout";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

type Props = {};

export default function BlogPage({ }: Props) {
  const editorRef = useRef<BlogEditorRef>(null);
  const [htmlOutput, setHtmlOutput] = useState<string>("");

  const handleSaveBlog = (editorState: EditorSaveResult) => {
    console.log("Blog saved:", editorState);
    setHtmlOutput(editorState.html);
  };

  return (
    <AdminPageContentLayout>
      <BlogEditor ref={editorRef} onSave={(editorState) => handleSaveBlog(editorState)} />

      <div>
        <h2>Editor JSON Output:</h2>
        <div dangerouslySetInnerHTML={{ __html: htmlOutput }}></div>
      </div>

      {/* Listen to the on save method for the returned value */}
      <Button variant="default" onClick={() => editorRef.current?.save()}>
        Create blog
      </Button>
    </AdminPageContentLayout>
  );
}
