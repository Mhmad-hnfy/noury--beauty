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

    const totalItems = cart.reduce((t, item) => t + item.qty, 0);

    return (
        <div className="min-h-screen bg-white font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
            <Hedar />

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-16">

                {/* Page Header */}
                <div className="flex items-end justify-between mb-8 md:mb-14 border-b border-gray-100 pb-6 md:pb-10">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-serif text-[#6d1616] leading-tight">
                            {t('cart_title')}
                        </h1>
                        {cart.length > 0 && (
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">
                                {totalItems} {isRTL ? 'منتج' : totalItems === 1 ? 'item' : 'items'}
                            </p>
                        )}
                    </div>
                    <Link
                        href="/"
                        className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors group"
                    >
                        <svg className="group-hover:-translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        {t('cart_continue')}
                    </Link>
                </div>

                {cart.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 md:py-32">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </div>
                        <p className="text-lg text-gray-400 italic mb-8">{t('cart_empty')}</p>
                        <Link
                            href="/"
                            className="h-14 px-10 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center hover:bg-[#6d1616] transition-all duration-300"
                        >
                            {t('cart_continue')}
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col xl:flex-row gap-8 xl:gap-16">

                        {/* ─── Cart Items ─── */}
                        <div className="flex-1 min-w-0">
                            {/* Desktop Table Header */}
                            <div className="hidden md:grid grid-cols-12 border-b border-gray-100 pb-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <div className="col-span-6">{t('cart_product')}</div>
                                <div className="col-span-2 text-center">{t('cart_price')}</div>
                                <div className="col-span-2 text-center">{t('cart_qty')}</div>
                                <div className="col-span-2 text-right">{t('cart_total')}</div>
                            </div>

                            {/* Items List */}
                            <div className="flex flex-col divide-y divide-gray-50">
                                {cart.map((item) => {
                                    const unitPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                                    const lineTotal = unitPrice * item.qty;
                                    return (
                                        <div key={item.cartItemId} className="py-5 md:py-7">
                                            {/* ── MOBILE LAYOUT ── */}
                                            <div className="flex gap-4 md:hidden">
                                                {/* Image */}
                                                <div className="w-24 h-28 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden shrink-0 relative">
                                                    <Image
                                                        src={item.image || item.displayImage}
                                                        alt={item.title}
                                                        fill
                                                        sizes="96px"
                                                        className="object-contain p-1"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                                    <div>
                                                        <div className="flex justify-between items-start gap-2">
                                                            <h3 className="text-[12px] font-bold uppercase text-black tracking-tight leading-snug line-clamp-2 flex-1">{item.title}</h3>
                                                            <button
                                                                onClick={() => removeFromCart(item.cartItemId)}
                                                                className="text-gray-300 hover:text-red-500 transition-colors shrink-0 p-1"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                                            </button>
                                                        </div>

                                                        {item.selectedSize && (
                                                            <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-widest bg-[#6d1616]/10 text-[#6d1616] border border-[#6d1616]/20 px-2 py-0.5 rounded-sm">
                                                                {isRTL ? 'المقاس:' : 'Size:'} {item.selectedSize}
                                                            </span>
                                                        )}
                                                        <p className="text-[10px] text-gray-400 font-bold mt-1">
                                                            {unitPrice.toFixed(2)} EGP
                                                        </p>
                                                    </div>

                                                    {/* Mobile: Qty + Total in one row */}
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center border border-gray-200 rounded-sm bg-white">
                                                            <button
                                                                onClick={() => updateCartQty(item.cartItemId, item.qty - 1)}
                                                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black transition-colors text-lg"
                                                            >−</button>
                                                            <span className="w-9 text-center text-xs font-bold">{item.qty}</span>
                                                            <button
                                                                onClick={() => updateCartQty(item.cartItemId, item.qty + 1)}
                                                                disabled={item.qty >= (item.stock || 99)}
                                                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black transition-colors disabled:opacity-20 text-lg"
                                                            >+</button>
                                                        </div>
                                                        <span className="font-bold text-black text-sm">{lineTotal.toFixed(2)} EGP</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ── DESKTOP LAYOUT ── */}
                                            <div className="hidden md:grid grid-cols-12 gap-6 items-center">
                                                {/* Product Info */}
                                                <div className="col-span-6 flex gap-6">
                                                    <div className="w-28 h-36 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden shrink-0 relative">
                                                        <Image
                                                            src={item.image || item.displayImage}
                                                            alt={item.title}
                                                            fill
                                                            sizes="112px"
                                                            className="object-contain p-2"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center gap-2">
                                                        <h3 className="text-[13px] font-bold uppercase text-black tracking-tight leading-snug">{item.title}</h3>

                                                        {item.selectedSize && (
                                                            <span className="inline-flex items-center gap-1.5 w-fit text-[9px] font-bold uppercase tracking-widest bg-[#6d1616]/10 text-[#6d1616] border border-[#6d1616]/20 px-2 py-0.5 rounded-sm">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                                                                {isRTL ? 'المقاس:' : 'Size:'} {item.selectedSize}
                                                            </span>
                                                        )}

                                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${item.stock > 0 ? 'text-gray-400' : 'text-red-500'}`}>
                                                            {item.stock > 0 ? `${t('stock_available')}: ${item.stock}` : t('out_of_stock')}
                                                        </span>

                                                        <button
                                                            onClick={() => removeFromCart(item.cartItemId)}
                                                            className="w-fit text-[10px] font-bold uppercase tracking-widest text-red-400/70 hover:text-red-600 transition-colors underline mt-1"
                                                        >
                                                            {t('cart_remove')}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="col-span-2 flex flex-col items-center gap-1">
                                                    <span className="font-medium text-gray-600">{unitPrice.toFixed(2)} EGP</span>
                                                    {item.selectedSize && (
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#6d1616] bg-[#6d1616]/10 border border-[#6d1616]/20 px-2 py-0.5 rounded-sm">{item.selectedSize}</span>
                                                    )}
                                                </div>

                                                {/* Quantity */}
                                                <div className="col-span-2 flex items-center justify-center">
                                                    <div className="flex items-center border border-gray-200 rounded-sm bg-white">
                                                        <button
                                                            onClick={() => updateCartQty(item.cartItemId, item.qty - 1)}
                                                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                                        >−</button>
                                                        <span className="w-9 text-center text-xs font-bold">{item.qty}</span>
                                                        <button
                                                            onClick={() => updateCartQty(item.cartItemId, item.qty + 1)}
                                                            disabled={item.qty >= (item.stock || 99)}
                                                            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black transition-colors disabled:opacity-20"
                                                        >+</button>
                                                    </div>
                                                </div>

                                                {/* Line Total */}
                                                <div className="col-span-2 flex items-center justify-end font-bold text-black">
                                                    {lineTotal.toFixed(2)} EGP
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Continue shopping — mobile */}
                            <div className="mt-6 md:hidden">
                                <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline">
                                    {t('cart_continue')}
                                </Link>
                            </div>
                        </div>

                        {/* ─── Order Summary ─── */}
                        <div className="w-full xl:w-[380px] shrink-0">
                            <div className="bg-gray-50 border border-gray-100 p-7 md:p-10 rounded-sm flex flex-col gap-7 xl:sticky xl:top-36">

                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6d1616] border-b border-gray-200 pb-5">
                                    {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                                </h2>

                                {/* Items list mini */}
                                <div className="flex flex-col gap-3">
                                    {cart.map(item => {
                                        const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                                        return (
                                            <div key={item.cartItemId} className="flex items-center justify-between text-sm gap-3">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="w-5 h-5 bg-[#6d1616] text-white text-[9px] font-bold flex items-center justify-center rounded-full shrink-0">
                                                        {item.qty}
                                                    </span>
                                                    <span className="text-[12px] text-gray-600 truncate">{item.title}</span>
                                                </div>
                                                <span className="text-[12px] font-bold text-black shrink-0">{(price * item.qty).toFixed(2)} EGP</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200" />

                                {/* Subtotal */}
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{t('cart_subtotal')}</span>
                                    <span className="font-bold text-2xl text-black">{subtotal.toFixed(2)} EGP</span>
                                </div>

                                <p className="text-[11px] text-gray-400 italic leading-relaxed -mt-4">
                                    {t('cart_shipping_at_checkout')}
                                </p>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    className="w-full h-16 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center hover:bg-[#6d1616] transition-all duration-300 shadow-xl shadow-black/10 rounded-sm"
                                >
                                    {t('cart_checkout')}
                                    <svg className={`${isRTL ? 'mr-3 rotate-180' : 'ml-3'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
