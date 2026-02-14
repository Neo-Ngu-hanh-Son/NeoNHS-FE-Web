import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogStatus } from "@/types/blog";
import { useBlogForm } from "@/contexts/Blog/BlogFormContext";

export default function BlogPublishing() {
  const { formData, handleInputChange } = useBlogForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(val) => handleInputChange("status", val as BlogStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BlogStatus.DRAFT}>Draft</SelectItem>
              <SelectItem value={BlogStatus.PUBLISHED}>Published</SelectItem>
              <SelectItem value={BlogStatus.ARCHIVED}>Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Switch */}
        <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
          <div className="space-y-0.5">
            <Label htmlFor="featured" className="text-base cursor-pointer">
              Featured
            </Label>
            <p className="text-xs text-muted-foreground">
              Pin this blog to the top
            </p>
          </div>
          <Switch
            id="featured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
