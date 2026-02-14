import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogForm } from "@/contexts/Blog/BlogFormContext";

export default function BlogTags() {
  const { formData, handleInputChange } = useBlogForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="Travel, Guides, Tips"
            value={formData.tags}
            onChange={(e) => handleInputChange("tags", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Comma separated tags.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
