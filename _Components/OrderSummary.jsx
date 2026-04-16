"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';

export default function OrderSummary({ shippingPrice = 0 }) {
  const { t, isRTL, cart } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedItem = localStorage.getItem('noury_checkout_item');
    if (savedItem) {
      setItems([JSON.parse(savedItem)]);
    } else if (cart && cart.length > 0) {
      setItems(cart);
    } else {
      setItems([]);
    }
    setLoading(false);
  }, [cart]);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const priceStr = item.price ? item.price.toString() : '0';
      const priceNum = parseFloat(priceStr.replace(/[^\d.]/g, '')) || 0;
      return total + (priceNum * item.qty);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + shippingPrice;

  if (loading) return <div className="p-10 text-center text-gray-400">Loading...</div>;

  return (
    <div className="flex flex-col gap-8 md:py-10" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Product List */}
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-20 bg-white border border-gray-200 rounded-sm overflow-hidden shrink-0">
                <img src={item.displayImage || item.image} alt={item.title} className="w-full h-full object-contain" />
                <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} min-w-[20px] h-5 px-1 bg-[#6d1616] text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm`}>
                  {item.qty}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-tight">{item.title}</h3>
                <div className="flex items-center gap-2">
                    {item.selectedColor && (
                        <div 
                            className="w-3 h-3 rounded-full border border-gray-200 shadow-sm" 
                            style={{ backgroundColor: item.selectedColor }}
                        />
                    )}
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.1em]">
                        {item.selectedColor || t('standard')}
                    </p>
                </div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {(item.price ? parseFloat(item.price.toString().replace(/[^\d.]/g, '')) : 0).toFixed(2)} EGP
            </span>
          </div>
        ))}
      </div>

      
      

      {/* Pricing Table */}
      <div className="flex flex-col gap-3 py-6 border-y border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('subtotal')}</span>
          <span className="font-medium text-gray-900">{subtotal.toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('shipping')}</span>
          <span className="font-medium text-gray-900">{shippingPrice.toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-900 mt-2">
          <span>{t('total')}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-normal">EGP</span>
            <span>{total.toFixed(2)} EGP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
