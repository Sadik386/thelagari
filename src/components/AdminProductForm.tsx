import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "./ImageUpload";
import { toast } from "sonner";
import { X, Plus, Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminProductFormProps {
  product?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const AdminProductForm = ({ product, onCancel, onSuccess }: AdminProductFormProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    base_price: product?.base_price || 0,
    category_id: product?.category_id || "",
    short_description: product?.short_description || "",
    long_description: product?.long_description || "",
    is_featured: product?.is_featured || false,
    activity: product?.activity || [],
    product_images: product?.product_images || [],
    product_variants: product?.product_variants || [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSlugify = () => {
    setFormData(prev => ({ 
      ...prev, 
      slug: prev.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") 
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      product_images: [...prev.product_images, { url, alt_text: prev.name, display_order: prev.product_images.length }]
    }));
  };

  const handleMultipleImageUpload = (urls: string[]) => {
    const newImages = urls.map((url, i) => ({
      url,
      alt_text: formData.name,
      display_order: formData.product_images.length + i
    }));
    setFormData(prev => ({
      ...prev,
      product_images: [...prev.product_images, ...newImages]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      product_images: prev.product_images.filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      product_variants: [...prev.product_variants, { variant_name: "", price_modifier: 0, sku: "", stock_level: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      product_variants: prev.product_variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.product_variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, product_variants: newVariants }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const method = product ? "PUT" : "POST";
      const url = product ? `${apiUrl}/products/${product.id}` : `${apiUrl}/products`;

      // Prepare data for submission
      const submitData = {
        ...formData,
        // Convert empty category_id to null/undefined instead of empty string
        category_id: formData.category_id || undefined,
        // Filter out variants with empty variant_name (required field)
        product_variants: formData.product_variants.filter(
          (v: any) => v.variant_name && v.variant_name.trim() !== ""
        ),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save product");
      }

      toast.success(`Product ${product ? "updated" : "created"} successfully`);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center">
        <Button type="button" variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Cancel
        </Button>
        <Button type="submit" disabled={loading} className="gap-2">
          <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Product"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <div className="flex gap-2">
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  <Button type="button" variant="secondary" onClick={handleSlugify}>Auto Slug</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_price">Base Price (€)</Label>
                  <Input id="base_price" name="base_price" type="number" step="0.01" value={formData.base_price} onChange={(e) => setFormData(p => ({ ...p, base_price: parseFloat(e.target.value) }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category_id} onValueChange={(val) => setFormData(p => ({ ...p, category_id: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Switch 
                  id="is_featured" 
                  checked={formData.is_featured} 
                  onCheckedChange={(val) => setFormData(p => ({ ...p, is_featured: val }))} 
                />
                <Label htmlFor="is_featured">Featured Product</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader><CardTitle className="text-lg">Descriptions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input id="short_description" name="short_description" value={formData.short_description} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea id="long_description" name="long_description" value={formData.long_description} onChange={handleInputChange} rows={5} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass">
            <CardHeader><CardTitle className="text-lg">Product Images</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload 
                onUploadComplete={handleImageUpload} 
                onMultipleUploadComplete={handleMultipleImageUpload}
                currentImages={formData.product_images.map((img: any) => img.url)}
                onDeleteImage={(url) => setFormData(p => ({ ...p, product_images: p.product_images.filter((img: any) => img.url !== url) }))}
                maxImages={10}
              />
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Variants (Sizes, Colors, etc.)</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="gap-1">
                <Plus className="w-3 h-3" /> Add Variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.product_variants.map((variant: any, index: number) => (
                <div key={index} className="grid grid-cols-4 gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="col-span-1 space-y-1">
                    <Label className="text-[10px] uppercase">Name</Label>
                    <Input placeholder="S, M, L..." value={variant.variant_name} onChange={(e) => updateVariant(index, "variant_name", e.target.value)} />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <Label className="text-[10px] uppercase">SKU</Label>
                    <Input placeholder="SKU" value={variant.sku} onChange={(e) => updateVariant(index, "sku", e.target.value)} />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <Label className="text-[10px] uppercase">Stock</Label>
                    <Input type="number" value={variant.stock_level} onChange={(e) => updateVariant(index, "stock_level", parseInt(e.target.value))} />
                  </div>
                  <div className="flex items-end justify-end">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)} className="text-destructive h-9">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {formData.product_variants.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No variants added yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default AdminProductForm;
