"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';

export default function QuickView({ isOpen, onClose, product }) {
    const router = useRouter();
    const { t, isRTL, addToCart } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(null);
    const allImagesList = product?.allImages?.length > 0 ? product.allImages : (product?.image ? [product.image] : []);

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // On open: set initial active image
    useEffect(() => {
        if (product && isOpen) {
            setQuantity(1);
            setActiveImage(allImagesList[0] || null);
        }
    }, [product, isOpen]);

    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Navigation handlers
    const handleNextImage = () => {
        if (allImagesList.length <= 1) return;
        const currentIndex = allImagesList.indexOf(activeImage);
        const nextIndex = (currentIndex + 1) % allImagesList.length;
        setActiveImage(allImagesList[nextIndex]);
    };

    const handlePrevImage = () => {
        if (allImagesList.length <= 1) return;
        const currentIndex = allImagesList.indexOf(activeImage);
        const prevIndex = (currentIndex - 1 + allImagesList.length) % allImagesList.length;
        setActiveImage(allImagesList[prevIndex]);
    };

    // Touch handlers for swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            isRTL ? handlePrevImage() : handleNextImage();
        }
        if (isRightSwipe) {
            isRTL ? handleNextImage() : handlePrevImage();
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl animate-in fade-in zoom-in duration-300 rounded-sm">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-sm border border-gray-100 text-black`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>

                {/* ── LEFT: Images ── */}
                <div className="flex flex-col bg-gray-50 border-r border-gray-100 relative">
                    {/* Main Image */}
                    <div 
                        className="w-full aspect-square relative overflow-hidden flex items-center justify-center p-6 md:p-10 bg-white"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {allImagesList.length > 1 && (
                            <>
                                <button 
                                    onClick={handlePrevImage}
                                    className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 transition-all text-gray-800`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRTL ? "rotate-180" : ""}><path d="m15 18-6-6 6-6"/></svg>
                                </button>
                                <button 
                                    onClick={handleNextImage}
                                    className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 transition-all text-gray-800`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRTL ? "rotate-180" : ""}><path d="m9 18 6-6-6-6"/></svg>
                                </button>
                            </>
                        )}
                        {activeImage && (
                            <Image
                                key={activeImage}
                                src={activeImage}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain p-6 md:p-10 hover:scale-110 transition-transform duration-700"
                            />
                        )}
                    </div>

                    {/* Thumbnails row — only shown if more than 1 image */}
                    {allImagesList.length > 1 && (
                        <div className="flex gap-2 p-3 overflow-x-auto border-t border-gray-100 bg-gray-50">
                            {allImagesList.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(img)}
                                    className={`flex-shrink-0 w-16 h-16 border-2 rounded-sm overflow-hidden transition-all ${
                                        activeImage === img
                                            ? 'border-[#6d1616] shadow-md'
                                            : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <div className="relative w-full h-full">
                                        <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Details ── */}
                <div className="p-8 md:p-12 flex flex-col gap-7 font-sans bg-white">

                    {/* Title + Price */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${product.stock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? `${t('in_stock')} (${product.stock})` : t('out_of_stock')}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-black leading-tight tracking-tight">
                            {product.title}
                        </h2>
                        <div className="flex items-center gap-4 mt-1">
                            <p className={`text-2xl md:text-3xl font-medium ${product.oldPrice ? 'text-[#f95d5d]' : 'text-black'}`}>
                                {product.price}
                            </p>
                            {product.oldPrice && (
                                <p className="text-lg text-gray-400 line-through font-light italic">
                                    {product.oldPrice}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col gap-3">
                        <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">{t('quantity')}</p>
                        <div className="flex items-center justify-between border border-gray-200 bg-gray-50 h-14 px-8 w-full md:w-1/2">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={product.stock <= 0}
                                className="text-xl font-light hover:text-[#6d1616] transition-colors disabled:opacity-30"
                            >−</button>
                            <span className="text-sm font-bold tracking-widest">{product.stock > 0 ? quantity : 0}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(product.stock || 0, q + 1))}
                                disabled={product.stock <= 0 || quantity >= product.stock}
                                className="text-xl font-light hover:text-[#6d1616] transition-colors disabled:opacity-30"
                            >+</button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 mt-2">
                        <button
                            disabled={product.stock <= 0}
                            onClick={() => {
                                addToCart(product, quantity);
                                onClose();
                            }}
                            className="w-full bg-black text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#6d1616] transition-all duration-300 h-16 shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {product.stock > 0 ? t('add_to_cart') : t('out_of_stock')}
                        </button>
                        <button
                            disabled={product.stock <= 0}
                            onClick={() => {
                                const checkoutItem = {
                                    ...product,
                                    qty: quantity,
                                    displayImage: activeImage
                                };
                                localStorage.setItem('noury_checkout_item', JSON.stringify(checkoutItem));
                                router.push('/checkout');
                            }}
                            className="w-full bg-[#6d1616] text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-black transition-all duration-300 h-16 active:scale-[0.98] disabled:opacity-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        >
                            {t('buy_now')}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
