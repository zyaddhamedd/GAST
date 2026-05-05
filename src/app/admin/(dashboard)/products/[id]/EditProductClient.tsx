"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, ImagePlus, Plus, Trash2, ChevronDown } from 'lucide-react';
import { normalizeImagePath } from '@/lib/utils';
import SafeImage from '@/components/SafeImage';


interface UploadedImage {
  id?: number;
  url: string;
  preview: string;
}

interface SpecRow {
  key: string;
  value: string;
}

interface EditProductClientProps {
  initialProduct: any;
  categories: any[];
}

export function EditProductClient({ initialProduct, categories }: EditProductClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [images, setImages] = useState<UploadedImage[]>(
    initialProduct.images.map((img: any) => ({
      id: img.id,
      url: img.url,
      preview: normalizeImagePath(img.url)
    }))
  );

  const [specs, setSpecs] = useState<SpecRow[]>(
    Array.isArray(initialProduct.specs) && initialProduct.specs.length > 0
      ? (initialProduct.specs as SpecRow[])
      : [{ key: '', value: '' }]
  );

  const [formData, setFormData] = useState({
    name: initialProduct.name,
    description: initialProduct.description || '',
    price: initialProduct.price.toString(),
    categoryId: initialProduct.categoryId.toString(),
    inStock: initialProduct.inStock,
    power: initialProduct.power?.toString() || '',
    voltage: initialProduct.voltage || '',
  });

  const addSpecRow = () => setSpecs((prev) => [...prev, { key: '', value: '' }]);
  const removeSpecRow = (i: number) => setSpecs((prev) => prev.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) =>
    setSpecs((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'products');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) { alert((await res.json()).error ?? 'Upload failed'); return null; }
    return (await res.json()).url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // Check for large files (> 5MB)
    const largeFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (largeFiles.length > 0) {
      const proceed = confirm(`تحذير: أنت تحاول رفع ${largeFiles.length} صور بحجم كبير (أكبر من 5 ميجابايت). هذا قد يستغرق وقتاً طويلاً ويؤثر على استقرار الموقع. هل تريد الاستمرار؟`);
      if (!proceed) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    setUploading(true);
    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const url = await uploadFile(file);
          if (!url) return null;
          return { url, preview: URL.createObjectURL(file) } as UploadedImage;
        })
      );
      setImages((prev) => [...prev, ...(results.filter(Boolean) as UploadedImage[])]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const img = prev[index];
      if (img.preview.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { alert('Please upload at least one image.'); return; }

    setLoading(true);
    const cleanSpecs = specs.filter((s) => s.key.trim() && s.value.trim());

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
      images: images.map((img) => ({ url: img.url })),
      specs: cleanSpecs.length > 0 ? cleanSpecs : undefined,
    };

    try {
      const res = await fetch(`/api/admin/products/${initialProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update product');
      }
      
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-0">
      <div className="flex items-center justify-between px-4 md:px-0">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Edit <span className="text-blue-500">Product</span></h1>
        <button onClick={() => router.back()} className="hidden md:block text-sm text-gray-500 hover:text-white transition-colors">Back to list</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111111] p-4 md:p-8 rounded-2xl border border-white/5 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-blue-500/50">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Product Name</label>
              <input
                required type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
              <textarea
                required rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price (EGP)</label>
                <input
                  required type="number" step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <div className="relative">
                  <select
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="" className="bg-[#111111]">Select Category</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id} className="bg-[#111111]">{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Power (HP)</label>
                <input
                  type="number" step="0.5" placeholder="e.g. 1.5"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  value={formData.power}
                  onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Voltage</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
                    value={formData.voltage}
                    onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                  >
                    <option value="" className="bg-[#111111]">Select Voltage</option>
                    <option value="220V" className="bg-[#111111]">220V</option>
                    <option value="380V" className="bg-[#111111]">380V</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Images + Specs */}
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-blue-500/50">Media & Specs</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Product Images</label>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/5 group">
                    <SafeImage src={img.preview} alt={`preview-${i}`} fill className="object-cover opacity-80 group-hover:opacity-100 transition-all" sizes="150px" />

                    <button
                      type="button" onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-lg p-1.5 shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-red-700 active:scale-90"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <label className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all text-gray-500 hover:text-blue-500">
                    <ImagePlus size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} disabled={uploading} />
                  </label>
                )}
              </div>
              {uploading && (
                <div className="flex items-center gap-2 text-xs text-blue-500 font-bold animate-pulse px-2">
                  <Upload size={14} className="animate-bounce" /> Uploading assets...
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-400">Specifications</label>
                <button
                  type="button" onClick={addSpecRow}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors p-2 -m-2"
                >
                  + Add Row
                </button>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/5 divide-y divide-white/5">
                {specs.map((row, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <input
                      type="text" placeholder="Key" value={row.key}
                      onChange={(e) => updateSpec(i, 'key', e.target.value)}
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-700"
                    />
                    <div className="w-[1px] h-4 bg-white/10" />
                    <input
                      type="text" placeholder="Value" value={row.value}
                      onChange={(e) => updateSpec(i, 'value', e.target.value)}
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-700"
                    />
                    <button
                      type="button" onClick={() => removeSpecRow(i)}
                      disabled={specs.length === 1}
                      className="text-gray-600 hover:text-red-500 transition-colors disabled:opacity-0 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors ${formData.inStock ? 'bg-blue-600' : 'bg-gray-800'}`} />
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${formData.inStock ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Product is in stock</span>
              </label>
            </div>
          </div>
        </div>

        {/* Desktop Submit Bar */}
        <div className="hidden md:flex pt-8 border-t border-white/5 justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-10 py-3 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>

        {/* Mobile Sticky Submit Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/10 flex gap-3 z-50">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-3 text-sm font-bold text-gray-400 bg-white/5 rounded-xl border border-white/5 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-[2] bg-blue-600 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>

  );
}
