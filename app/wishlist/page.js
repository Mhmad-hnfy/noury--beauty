"use client";

import React from 'react';
import { useStore } from '@/context/StoreContext';
import Card from '@/_Components/Card';
import Hedar from '@/_Components/Hedar';
import Footer from '@/_Components/Footer';

export default function WishlistPage() {
    const { wishlist, t, isRTL, language } = useStore();

    return (
        <main className="min-h-screen bg-white font-sans">
            <Hedar />
            
            <section className="py-24 px-6 md:px-20 min-h-[60vh]">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col gap-4 mb-16 items-center md:items-start">
                        <h1 className="text-4xl md:text-5xl font-serif text-black tracking-tight">
                            {t('wishlist_title')}
                        </h1>
                        <p className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400">
                            {wishlist.length} {language === 'ar' ? 'منتجات محفوظة' : 'Saved Items'}
                        </p>
                    </div>

                    {wishlist.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-10 md:gap-y-16">
                            {wishlist.map(product => (
                                <Card 
                                    key={product.id}
                                    id={product.id}
                                    title={product.title}
                                    price={product.price}
                                    oldPrice={product.oldPrice}
                                    colors={product.colors}
                                    image={product.image}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center gap-8 border-t border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-lg font-medium text-gray-400 italic">{t('empty_wishlist')}</p>
                                <a 
                                    href="/" 
                                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-black border-b-2 border-black pb-1 hover:opacity-60 transition-all"
                                >
                                    {language === 'ar' ? 'العودة للتسوق' : 'Back to Shopping'}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
