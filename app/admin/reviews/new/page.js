"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';
import imageCompression from 'browser-image-compression';

export default function NewReview() {
    const router = useRouter();
    const { addReview, fetchReviews, t } = useStore();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        stars: 5,
        date: 'Just now',
        title: '',
        content: '',
        product: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = preview;

            if (supabase && imageFile) {
                // Compress Image
                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1200,
                    useWebWorker: true,
                    fileType: "image/webp"
                };
                const compressedFile = await imageCompression(imageFile, options);

                const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.webp`;
                const filePath = `reviews/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, compressedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);
                
                finalImageUrl = publicUrl;
            }

            if (!supabase) {
                const newReview = {
                    id: 'mock-rev-' + Date.now(),
                    ...formData,
                    image: preview || "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800",
                    created_at: new Date().toISOString()
                };
                await addReview(newReview);
                alert("Review saved in Demo Mode");
                router.push('/admin/reviews');
                return;
            }

            const { error } = await supabase
                .from('reviews')
                .insert([{
                    name: formData.name,
                    stars: parseInt(formData.stars),
                    date: formData.date,
                    title: formData.title,
                    content: formData.content,
                    product: formData.product,
                    image: finalImageUrl
                }]);

            if (error) throw error;

            await fetchReviews();
            router.push('/admin/reviews');
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl flex flex-col gap-10">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-serif text-black">Add New Review</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Create a customer saying for the carousel</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-6">
                    <InputGroup label="Customer Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} placeholder="e.g. Mona Bakr" required />
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rating (1-5 Stars)</label>
                        <select 
                            value={formData.stars}
                            onChange={(e) => setFormData({...formData, stars: e.target.value})}
                            className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] text-sm font-medium transition-all"
                        >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                        </select>
                    </div>

                    <InputGroup label="Date Reference" value={formData.date} onChange={(v) => setFormData({...formData, date: v})} placeholder="e.g. 1 year ago" />
                    <InputGroup label="Related Product" value={formData.product} onChange={(v) => setFormData({...formData, product: v})} placeholder="e.g. Compact Powder" />
                </div>

                <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-6">
                    <InputGroup label="Review Headline" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} placeholder="e.g. Very shiny!" />
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Review Content</label>
                        <textarea 
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            placeholder="Type the customer feedback here..."
                            className="w-full h-32 p-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] text-sm font-medium transition-all resize-none"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Image (Upload)</label>
                        <div className="relative h-40 border-2 border-dashed border-gray-100 rounded-sm flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Click to upload image</span>
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                   
                    <div className="flex gap-4 mt-4">
                        <button 
                            type="button" 
                            onClick={() => router.back()}
                            className="flex-1 h-14 border border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={loading}
                            type="submit"
                            className="flex-1 h-14 bg-[#6d1616] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-xl disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Review'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function InputGroup({ label, placeholder, type="text", value, onChange, required=false }) {
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
