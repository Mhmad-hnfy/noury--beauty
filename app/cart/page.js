"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import Hedar from '@/_Components/Hedar';
import Footer from '@/_Components/Footer';

export default function CartPage() {
    const { cart, removeFromCart, updateCartQty, t, isRTL } = useStore();

    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
        return total + (price * item.qty);
    }, 0);

    return (
        <div className="min-h-screen bg-white font-sans">
            <Hedar />

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-20 animate-in fade-in duration-700">
                <h1 className="text-3xl md:text-5xl font-serif text-[#6d1616] mb-10 md:mb-16">
                    {t('cart_title')}
                </h1>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-y border-gray-100 italic text-gray-400">
                        <p className="text-lg mb-8">{t('cart_empty')}</p>
                        <Link 
                            href="/" 
                            className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-1 hover:text-[#6d1616] hover:border-[#6d1616] transition-colors"
                        >
                            {t('cart_continue')}
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Cart Items List */}
                        <div className="flex-1">
                            {/* Table Header (Desktop Only) */}
                            <div className="hidden md:grid grid-cols-12 border-b border-gray-100 pb-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <div className="col-span-6">{t('cart_product')}</div>
                                <div className="col-span-2 text-center">{t('cart_price')}</div>
                                <div className="col-span-2 text-center">{t('cart_qty')}</div>
                                <div className="col-span-2 text-right">{t('cart_total')}</div>
                            </div>

                            {/* Items */}
                            <div className="flex flex-col divide-y divide-gray-100">
                                {cart.map((item) => (
                                    <div key={item.cartItemId} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-6 md:py-8 items-center">
                                        {/* Product Details (Responsive Flex) */}
                                        <div className="col-span-1 md:col-span-6 flex gap-4 md:gap-6">
                                            <div className="w-28 h-36 md:w-36 md:h-48 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden shrink-0 relative">
                                                <Image src={item.image || item.displayImage} alt={item.title} fill sizes="(max-width: 768px) 112px, 144px" className="object-contain" />
                                            </div>
                                            <div className="flex flex-col justify-center flex-1">
                                                <div className="flex justify-between items-start md:block">
                                                    <h3 className="text-[13px] md:text-sm font-bold uppercase text-black tracking-tight leading-snug">{item.title}</h3>
                                                    {/* Mobile Price */}
                                                    <span className="md:hidden font-bold text-black text-sm">
                                                        {parseFloat(item.price.toString().replace(/[^0-9.]/g, '')).toFixed(2)} EGP
                                                    </span>
                                                </div>
                                                
                                                
                                                <div className="mt-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${item.stock > 0 ? 'text-gray-400' : 'text-red-500'}`}>
                                                        {item.stock > 0 ? `${t('stock_available')}: ${item.stock}` : t('out_of_stock')}
                                                    </span>
                                                </div>

                                                <button 
                                                    onClick={() => removeFromCart(item.cartItemId)}
                                                    className="w-fit text-[10px] font-bold uppercase tracking-widest text-red-400/70 hover:text-red-600 transition-colors mt-3 underline"
                                                >
                                                    {t('cart_remove')}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Desktop Price */}
                                        <div className="col-span-2 hidden md:flex items-center justify-center font-medium text-gray-600">
                                            {item.price}
                                        </div>

                                        {/* Quantity & Item Total (Mobile Stack) */}
                                        <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center mt-2 md:mt-0 px-2 md:px-0">
                                            <span className="md:hidden text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('cart_qty')}</span>
                                            <div className="flex items-center border border-gray-200 rounded-sm bg-white">
                                                <button 
                                                    onClick={() => updateCartQty(item.cartItemId, item.qty - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold">{item.qty}</span>
                                                <button 
                                                    onClick={() => updateCartQty(item.cartItemId, item.qty + 1)}
                                                    disabled={item.qty >= (item.stock || 99)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors disabled:opacity-20"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Desktop Item Total */}
                                        <div className="col-span-1 md:col-span-2 hidden md:flex items-center justify-end font-bold text-black">
                                            {(parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) * item.qty).toFixed(2)} EGP
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="w-full lg:w-[400px]">
                            <div className="bg-gray-50 p-8 md:p-10 rounded-sm flex flex-col gap-8 sticky top-36">
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold uppercase tracking-widest text-[#6d1616]">{t('cart_subtotal')}</span>
                                        <span className="font-bold text-xl">{subtotal.toFixed(2)} EGP</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 italic leading-relaxed">
                                        {t('cart_shipping_at_checkout')}
                                    </p>
                                </div>

                                <Link 
                                    href="/checkout"
                                    className="w-full h-16 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center hover:bg-[#6d1616] transition-all duration-300 shadow-xl shadow-black/5"
                                >
                                    {t('cart_checkout')}
                                </Link>

                                <Link 
                                    href="/"
                                    className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                                >
                                    {t('cart_continue')}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
