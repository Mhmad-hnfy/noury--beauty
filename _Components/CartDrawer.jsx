"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';

export default function CartDrawer({ isOpen, onClose }) {
    const { cart, removeFromCart, updateCartQty, t, isRTL } = useStore();

    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
        return total + (price * item.qty);
    }, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} w-full max-w-md bg-white shadow-2xl flex flex-col animate-in ${isRTL ? 'slide-in-from-left' : 'slide-in-from-right'} duration-500`}>
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-serif text-[#6d1616] tracking-tight">{t('cart_title')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
                            <p>{t('cart_empty')}</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.cartItemId} className="flex gap-4 group">
                                <div className="w-24 h-32 md:w-28 md:h-36 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden shrink-0 relative">
                                    <Image src={item.image || item.displayImage} alt={item.title} fill sizes="112px" className="object-contain" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between gap-2">
                                            <h3 className="text-[13px] font-bold uppercase text-black line-clamp-2 leading-tight">{item.title}</h3>
                                            <button 
                                                onClick={() => removeFromCart(item.cartItemId)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                            </button>
                                        </div>
                                        <div className="mt-1">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest ${item.stock > 0 ? 'text-gray-400' : 'text-red-500'}`}>
                                                {item.stock > 0 ? `${t('stock_available')}: ${item.stock}` : t('out_of_stock')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-gray-200 rounded-sm">
                                            <button 
                                                onClick={() => updateCartQty(item.cartItemId, item.qty - 1)}
                                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black transition-colors text-xs"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-[11px] font-bold">{item.qty}</span>
                                            <button 
                                                onClick={() => updateCartQty(item.cartItemId, item.qty + 1)}
                                                disabled={item.qty >= (item.stock || 99)}
                                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black transition-colors text-xs disabled:opacity-20"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-[13px] font-bold text-black">
                                            {(parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) * item.qty).toFixed(2)} EGP
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Summary */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{t('cart_subtotal')}</span>
                        <span className="text-lg font-bold text-[#6d1616]">{subtotal.toFixed(2)} EGP</span>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <Link 
                            href="/checkout"
                            onClick={onClose}
                            className="w-full h-14 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center hover:bg-[#6d1616] transition-all duration-300 shadow-xl"
                        >
                            {t('cart_checkout')}
                        </Link>
                        <Link 
                            href="/cart"
                            onClick={onClose}
                            className="w-full h-14 bg-white border border-gray-200 text-black text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
                        >
                            {isRTL ? "عرض السلة كاملة" : "View Full Cart"}
                        </Link>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 italic text-center mt-4">
                        {t('cart_shipping_at_checkout')}
                    </p>
                </div>
            </div>
        </div>
    );
}
