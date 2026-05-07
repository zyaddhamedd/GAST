"use client";

import { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, ImagePlus, Upload } from 'lucide-react';
import { normalizeImagePath } from '@/lib/utils';
import SafeImage from '@/components/SafeImage';


export default function CategoriesPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
   const [uploading, setUploading] = useState(false);
  const isSubmitting = useRef(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', image: '' });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check for large files (> 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('تحذير: هذه الصورة حجمها كبير جداً (أكبر من 5 ميجابايت). يرجى اختيار صورة أصغر للحفاظ على أداء الموقع.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'categories');

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? 'Upload failed');
        return;
      }
      const { url } = await res.json();
      setFormData((prev) => ({ ...prev, image: url }));
      setImagePreview(URL.createObjectURL(file));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? This will delete all products in this category.'))
      return;
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

   const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current || uploading) return;
    if (!formData.image) {
      alert('Please upload a category image.');
      return;
    }
    isSubmitting.current = true;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to save category');
        return;
      }

      setShowAdd(false);
      setFormData({ name: '', slug: '', image: '' });
      setImagePreview(null);
      fetchCategories();
     } catch (error) {
      console.error(error);
      alert('An error occurred while saving the category');
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-4 md:px-0">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Categories</h1>
        <button
          onClick={() => {
            setShowAdd(!showAdd);
            setFormData({ name: '', slug: '', image: '' });
            setImagePreview(null);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl transition-all font-bold text-xs shadow-lg shadow-red-600/20 active:scale-95"
        >
          <Plus size={18} />
          {showAdd ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500 font-medium animate-pulse">
          Loading categories...
        </div>
      ) : (
        <>
          {showAdd && (
            <form
              onSubmit={handleAdd}
              className="bg-[#111111] p-4 md:p-6 rounded-2xl border border-white/5 shadow-2xl space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    placeholder="e.g. Air Conditioners"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Slug
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    placeholder="e.g. air-conditioners"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Category Image
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
                  {/* Preview */}
                  {imagePreview && (
                    <div className="relative w-full sm:w-24 aspect-video sm:aspect-square rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <SafeImage
                        src={imagePreview}
                        alt="preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 96px"
                      />
                    </div>
                  )}

                  {/* Upload zone */}
                  <label className="flex-1 flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-red-500 hover:bg-white/5 transition-all">
                    {uploading ? (
                      <span className="text-xs text-red-500 font-bold flex items-center gap-2 animate-pulse">
                        <Upload size={16} className="animate-bounce" />
                        Uploading assets...
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                        <ImagePlus size={18} />
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </span>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-10 py-3 rounded-xl font-bold transition-all shadow-xl shadow-red-600/20 active:scale-95"
                >
                  Save Category
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="bg-[#111111] rounded-2xl border border-white/5 shadow-sm overflow-hidden flex flex-col hover:border-white/10 transition-all group"
              >
                <div className="h-40 bg-white/5 relative overflow-hidden">
                  <SafeImage
                    src={normalizeImagePath(cat.image)}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 right-2 opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="bg-black/60 backdrop-blur-md text-white hover:text-red-500 p-2 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">{cat.name}</h3>
                    <p className="text-xs text-gray-500 truncate">/{cat.slug}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="md:hidden text-gray-500 hover:bg-red-500/10 hover:text-red-500 p-2 rounded-lg transition-colors active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
