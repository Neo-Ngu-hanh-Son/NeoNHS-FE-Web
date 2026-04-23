interface BlogContentProps {
  html: string | undefined;
}

export default function BlogContent({ html }: BlogContentProps) {
  if (!html) {
    return (
      <p className="text-muted-foreground italic py-12 text-center">
        Bài viết chưa có nội dung.
      </p>
    );
  }

  return (
    <article
      className="prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:tracking-tight
        prose-a:text-primary prose-a:underline-offset-2
        prose-img:rounded-lg prose-img:shadow-sm
        prose-blockquote:border-l-primary/50
        prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
