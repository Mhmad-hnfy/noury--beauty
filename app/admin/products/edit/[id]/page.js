"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';
import imageCompression from 'browser-image-compression';

export default function EditProduct() {
    const { id } = useParams();
    const router = useRouter();
    const { products, fetchProducts, isLoading, isRTL } = useStore();

    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [formData, setFormData] = useState({ title: '', price: '', oldPrice: '', stock: '0' });

    const [existingImages, setExistingImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (!isLoading) {
            const product = products.find(p => p.id === id);
            if (product) {
                setFormData({
                    title: product.title,
                    price: product.price,
                    oldPrice: product.oldPrice || '',
                    stock: product.stock?.toString() || '0',
                });

                const imgs = product.images || (product.image ? [product.image] : []);
                setExistingImages(imgs);
                setPreviews(imgs);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
        }
    }, [id, products, isLoading]);

    const handleAddImages = (files) => {
        const newFiles = Array.from(files);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setImageFiles([...imageFiles, ...newFiles]);
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const existingCount = existingImages.length;
        if (index < existingCount) {
            setExistingImages(existingImages.filter((_, i) => i !== index));
        } else {
            const fileIndex = index - existingCount;
            setImageFiles(imageFiles.filter((_, i) => i !== fileIndex));
        }
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (previews.length === 0) {
            alert("Please add at least one image");
            return;
        }
        setLoading(true);

        try {
            const uploadedNewImages = [];

            if (supabase) {
                for (const file of imageFiles) {
                    const options = {
                        maxSizeMB: 0.5,
                        maxWidthOrHeight: 1200,
                        useWebWorker: true,
                        fileType: "image/webp"
                    };
                    const compressedFile = await imageCompression(file, options);

                    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.webp`;
                    const filePath = `products/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('product-images')
                        .upload(filePath, compressedFile);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(filePath);

                    uploadedNewImages.push(publicUrl);
                }

                const allImages = [...existingImages, ...uploadedNewImages];

                const { error } = await supabase
                    .from('products')
                    .update({
                        title: formData.title,
                        price: parseFloat(formData.price),
                        old_price: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
                        stock: parseInt(formData.stock) || 0,
                        images: allImages,
                        colors: [],
                        variants: []
                    })
                    .eq('id', id);

                if (error) throw error;
            } else {
                // Demo Mode update placeholder
                alert("Updated in Demo Mode");
            }

            await fetchProducts();
            router.push('/admin/products');
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (notFound) return <div className="p-20 text-center text-gray-400">Product not found.</div>;
    if (isLoading) return <div className="p-20 text-center"><div className="w-8 h-8 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin mx-auto"></div></div>;

    return (
        <div className="max-w-6xl flex flex-col gap-10 pb-20 relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] z-[9999] flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6d1616] animate-pulse">
                        {isRTL ? 'جاري حفظ التعديلات...' : 'Saving Changes...'}
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-serif text-black">Edit: {formData.title}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Upload product images</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">

                {/* Basic Info */}
                <div className="bg-white p-10 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6d1616] border-b border-gray-50 pb-4">Core Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InputGroup label="Product Title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} />
                        <InputGroup label="Price (EGP)" type="number" value={formData.price} onChange={(v) => setFormData({...formData, price: v})} />
                        <InputGroup label="Old Price (Optional)" type="number" value={formData.oldPrice} onChange={(v) => setFormData({...formData, oldPrice: v})} />
                        <InputGroup label="Stock Quantity" type="number" value={formData.stock} onChange={(v) => setFormData({...formData, stock: v})} />
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white p-10 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-8">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6d1616]">Product Images</h4>
                            <p className="text-[9px] text-gray-400 mt-1">First image will be the main display image</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {previews.map((src, idx) => (
                            <div key={idx} className="relative aspect-square bg-gray-50 border border-gray-100 rounded-sm overflow-hidden group">
                                <img src={src} className="w-full h-full object-contain" alt="" />
                                {idx === 0 && (
                                    <div className="absolute top-1 left-1 bg-[#6d1616] text-white text-[7px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-sm">
                                        Main
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const existingCount = existingImages.length;
                                        if (idx < existingCount) {
                                            if (confirm(isRTL ? 'هل أنت متأكد من حذف هذه الصورة؟' : 'Are you sure you want to remove this image?')) {
                                                removeImage(idx);
                                            }
                                        } else {
                                            removeImage(idx);
                                        }
                                    }}
                                    className="absolute top-1 right-1 w-6 h-6 bg-black/80 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all z-10"
                                    title={isRTL ? "حذف الصورة" : "Delete Image"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                        ))}

                        <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#6d1616] hover:bg-[#6d1616]/5 transition-all group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-[#6d1616] transition-colors"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
                            <span className="text-[9px] font-bold text-gray-300 group-hover:text-[#6d1616] uppercase tracking-widest transition-colors">Add Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => handleAddImages(e.target.files)}
                            />
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10">
                    <button 
                        type="button" 
                        onClick={async () => {
                            if (confirm(isRTL ? 'هل أنت متأكد من حذف هذا المنتج نهائياً؟' : 'Are you sure you want to delete this product permanently?')) {
                                try {
                                    setLoading(true);
                                    if (supabase) {
                                        const { error } = await supabase.from('products').delete().eq('id', id);
                                        if (error) throw error;
                                    }
                                    await fetchProducts();
                                    router.push('/admin/products');
                                } catch (err) {
                                    alert(err.message);
                                    setLoading(false);
                                }
                            }
                        }}
                        className="text-red-600 font-bold text-[10px] uppercase tracking-widest hover:underline"
                    >
                        {isRTL ? 'حذف المنتج بالكامل' : 'Delete Entire Product'}
                    </button>

                    <div className="flex gap-4 w-full sm:w-auto">
                        <button type="button" onClick={() => router.back()} className="flex-1 sm:flex-none h-14 px-8 border border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-black hover:border-black transition-all">
                            {isRTL ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 sm:flex-none h-14 px-12 bg-[#6d1616] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-50">
                            {loading ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'تحديث المنتج' : 'Update Product')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function InputGroup({ label, placeholder, type = "text", value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] text-sm font-medium"
            />
        </div>
    );
}
