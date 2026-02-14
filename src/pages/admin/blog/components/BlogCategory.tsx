import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogForm } from "@/contexts/Blog/BlogFormContext";

export default function BlogCategory() {
  const { formData, handleInputChange, categories, loadingCategories, errors } = useBlogForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category" className={errors.categoryId ? "text-destructive" : ""}>
            Blog Category
          </Label>
          <Select
            value={formData.categoryId}
            onValueChange={(val) => handleInputChange("categoryId", val)}
          >
            <SelectTrigger
              id="category"
              className={errors.categoryId ? "border-destructive focus-visible:ring-destructive" : ""}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {loadingCategories ? (
                <div className="p-2 text-sm text-center text-muted-foreground">
                  Loading...
                </div>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-center text-muted-foreground">
                  No categories found
                </div>
              )}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
