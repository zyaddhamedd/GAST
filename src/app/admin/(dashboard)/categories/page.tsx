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
    if (!formData.image) {
      alert('Please upload a category image.');
      return;
    }
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Categories</h1>
        <button
          onClick={() => {
            setShowAdd(!showAdd);
            setFormData({ name: '', slug: '', image: '' });
            setImagePreview(null);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all font-medium text-sm shadow-lg shadow-red-600/20"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500 font-medium">
          Loading categories...
        </div>
      ) : (
        <>
          {showAdd && (
            <form
              onSubmit={handleAdd}
              className="bg-[#111111] p-6 rounded-2xl border border-white/5 shadow-2xl space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Slug
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category Image
                </label>

                <div className="flex items-start gap-4">
                  {/* Preview */}
                  {imagePreview && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <SafeImage
                        src={imagePreview}
                        alt="preview"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}

                  {/* Upload zone */}
                  <label className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-red-500 hover:bg-white/5 transition-all min-h-[5rem]">
                    {uploading ? (
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <Upload size={16} className="animate-bounce" />
                        Uploading...
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <ImagePlus size={16} />
                        {imagePreview ? 'Change image' : 'Upload image'}
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-lg shadow-red-600/20"
                >
                  Save Category
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col hover:border-white/10 transition-all group"
              >
                <div className="h-40 bg-white/5 relative overflow-hidden">
                  <SafeImage
                    src={normalizeImagePath(cat.image)}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{cat.name}</h3>
                    <p className="text-sm text-gray-500">/{cat.slug}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-gray-500 hover:bg-red-500/10 hover:text-red-500 p-2 rounded-lg transition-colors"
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
