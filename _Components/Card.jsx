"use client";

import React, { useState } from 'react';
import QuickView from './QuickView';
import { useStore } from '@/context/StoreContext';

export default function Card({ 
    id,
    title = "LIP GLOSS (LELO)", 
    price = "300.00 EGP", 
    oldPrice = null, 
    image = "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop", 
    colors = ["#ff7dab"],
    allImages = []
}) {
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const { t, wishlist, toggleWishlist } = useStore();

    const isWishlisted = wishlist.some(item => item.id === id);

    const productData = { id, title, price, oldPrice, image: allImages?.[0] || image, colors, allImages };

    return (
        <>
            <div className="flex flex-col bg-white w-full max-w-[400px] font-sans group cursor-pointer relative">
                
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden mb-5">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={image}
                      alt={title} 
                    />

                    {/* Wishlist Icon */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(productData);
                        }}
                        className={`absolute top-2 right-2 md:top-4 md:right-4 bg-white p-1.5 md:p-2.5 rounded-full shadow-sm transition-all z-10 hover:scale-110 active:scale-90 ${isWishlisted ? 'text-[#6d1616]' : 'text-gray-400 hover:text-black'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>

                    {/* Hover Button: Select Options */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center px-4 ">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsQuickViewOpen(true);
                            }}
                            className="w-full bg-white/90 backdrop-blur-sm text-black font-bold text-[10px] uppercase tracking-[0.2em] py-4 hover:bg-[#6d1616] hover:text-white transition-all duration-300 shadow-xl"
                        >
                            {t('select_options')}
                        </button>
                    </div>
                </div>
                
                {/* Info Container */}
                <div className="flex flex-col gap-1.5 px-0.5" onClick={() => setIsQuickViewOpen(true)}>
                    <h3 className="text-sm md:text-base font-normal text-black uppercase tracking-wider leading-tight">
                        {title}
                    </h3>
                    
                    <div className="flex items-center gap-3">
                        <p className={`text-base md:text-lg font-medium ${oldPrice ? 'text-[#f95d5d]' : 'text-black'}`}>
                            {price}
                        </p>
                        {oldPrice && (
                            <p className="text-sm md:text-base font-normal text-gray-400 line-through">
                                {oldPrice}
                            </p>
                        )}
                    </div>
                    
                    {/* Color Swatches */}
                    <div className="mt-2 flex gap-3">
                        {colors.map((color, index) => (
                            <div 
                                key={index}
                                className="w-6 h-6 md:w-8 md:h-8 rounded-full shadow-inner border border-gray-100" 
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            <QuickView 
                isOpen={isQuickViewOpen} 
                onClose={() => setIsQuickViewOpen(false)} 
                product={productData}
            />
        </>
    );
};