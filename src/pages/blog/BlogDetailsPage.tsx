/**
 * BlogDetailsPage (Visitor / Public)
 *
 * Route: /blog/:id
 * Displays a single published blog post for public visitors.
 */

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogDetail } from "@/hooks/blog/useBlogDetail";
import BlogHeader from "@/components/blog/visitor/BlogHeader";
import BlogContent from "@/components/blog/visitor/BlogContent";

/* ---------- Skeleton loading state ---------- */
function BlogDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4 space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/* ---------- Error state ---------- */
function BlogDetailError({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
          <p className="text-lg font-medium text-destructive">{message}</p>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blog, loading, error } = useBlogDetail(id);

  const goBack = () => navigate("/blog");

  if (loading) return <BlogDetailSkeleton />;

  if (error || !blog) {
    return <BlogDetailError message={error ?? "Blog post not found."} onBack={goBack} />;
  }

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4 space-y-8">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
        onClick={goBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blogs
      </Button>

      {/* Header: title, meta, tags */}
      <BlogHeader blog={blog} />

      {/* Cover / Banner image */}
      {(blog.bannerUrl || blog.thumbnailUrl) && (
        <img
          src={blog.bannerUrl || blog.thumbnailUrl}
          alt={blog.title}
          className="w-full rounded-xl object-cover aspect-[2/1] shadow-sm"
        />
      )}

      <Separator />

      {/* Blog body */}
      <BlogContent html={blog.contentHTML} />

      <Separator />

      {/* Footer / back navigation */}
      <div className="flex justify-start pb-8">
        <Button variant="outline" onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Button>
      </div>
    </div>
  );
}
