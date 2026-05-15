"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';
import imageCompression from 'browser-image-compression';

export default function NewProduct() {
    const router = useRouter();
    const { fetchProducts, addProduct } = useStore();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        oldPrice: '',
        stock: '0',
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const handleAddImages = (files) => {
        const newFiles = Array.from(files);
        const newPreviews = newFiles.map(f => URL.createObjectURL(f));
        setImageFiles([...imageFiles, ...newFiles]);
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index));
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
            const allImages = [];

            if (!supabase) {
                // Demo Mode
                const dummyImages = previews.length > 0 ? previews : ["https://images.unsplash.com/photo-1599733594230-6b823276abcc?q=80&w=800"];
                
                const newProduct = {
                    id: 'mock-' + Date.now(),
                    ...formData,
                    images: dummyImages,
                    image: dummyImages[0],
                    created_at: new Date().toISOString()
                };
                await addProduct(newProduct);
                alert("Product saved in Demo Mode");
                router.push('/admin/products');
                return;
            }

            // Upload images to Supabase Storage
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

                allImages.push(publicUrl);
            }

            // Save to DB
            const { error } = await supabase
                .from('products')
                .insert([{
                    title: formData.title,
                    price: parseFloat(formData.price),
                    old_price: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
                    stock: parseInt(formData.stock) || 0,
                    images: allImages,
                    colors: [], // empty colors
                    variants: [] // empty variants
                }]);

            if (error) throw error;

            await fetchProducts();
            router.push('/admin/products');
        } catch (err) {
            console.error("Error:", err.message);
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl flex flex-col gap-10 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-serif text-black">Add New Product</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Upload product images</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">

                {/* Basic Info */}
                <div className="bg-white p-10 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6d1616] border-b border-gray-50 pb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InputGroup label="Product Title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} placeholder="e.g. Matte Lipstick" required />
                        <InputGroup label="Price (EGP)" type="number" value={formData.price} onChange={(v) => setFormData({...formData, price: v})} placeholder="0.00" required />
                        <InputGroup label="Old Price (Optional)" type="number" value={formData.oldPrice} onChange={(v) => setFormData({...formData, oldPrice: v})} placeholder="0.00" />
                        <InputGroup label="Stock Quantity" type="number" value={formData.stock} onChange={(v) => setFormData({...formData, stock: v})} placeholder="0" required />
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
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                <div className="flex justify-end gap-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="h-14 px-10 border border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all"
                    >
                        Back to List
                    </button>
                    <button
                        disabled={loading || previews.length === 0}
                        type="submit"
                        className="h-14 px-12 bg-[#6d1616] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-xl disabled:opacity-50"
                    >
                        {loading ? 'Uploading...' : 'Create Product'}
                    </button>
                </div>

            </form>
        </div>
    );
}

function InputGroup({ label, placeholder, type = "text", value, onChange, required = false }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
            <input
                type={type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] text-sm font-medium transition-all"
            />
        </div>
    );
}
