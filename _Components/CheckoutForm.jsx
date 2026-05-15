"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const InputField = ({ label, placeholder, type = "text", value, onChange, required = false }) => (
  <div className={`flex flex-col gap-1.5 w-full`}>
    <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</label>
    <input 
      type={type} 
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#c19a2e] focus:ring-1 focus:ring-[#c19a2e] transition-all text-sm"
    />
  </div>
);

export default function CheckoutForm({ onShippingChange }) {
  const { t, isRTL, shippingRates, cart, clearCart } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identity: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    governorate: '',
    postalCode: '',
    phone: '',
    phone2: '',
    paymentMethod: 'instapay'
  });
  const [mounted, setMounted] = useState(false);
  const [walletPhone, setWalletPhone] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGovernateChange = (val) => {
    setFormData({...formData, governorate: val});
    const selectedRate = shippingRates.find(r => r.name_ar === val || r.name_en === val);
    if (onShippingChange) {
        onShippingChange(selectedRate ? selectedRate.price : 0);
    }
  };

  // Calculate totals reactively
  const subtotal = (() => {
    if (!mounted) return 0;
    
    let items = [];
    if (typeof window !== 'undefined') {
        const singleItem = JSON.parse(localStorage.getItem('noury_checkout_item')) || null;
        if (singleItem) {
            items = [singleItem];
        } else if (cart && cart.length > 0) {
            items = cart;
        }
    }
    
    return items.reduce((total, item) => {
      const priceStr = item.price ? item.price.toString() : '0';
      const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      return total + (price * item.qty);
    }, 0);
  })();
  
  const shippingRate = shippingRates.find(r => r.name_ar === formData.governorate || r.name_en === formData.governorate);
  const shippingPrice = shippingRate ? shippingRate.price : 0;
  const finalTotal = subtotal + shippingPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let itemsToOrder = [];
        const singleItem = JSON.parse(localStorage.getItem('noury_checkout_item')) || null;
        
        if (singleItem) {
          itemsToOrder = [singleItem];
        } else if (cart && cart.length > 0) {
          itemsToOrder = cart;
        }

        if (itemsToOrder.length === 0) throw new Error("No products in checkout. Please select a product first.");

        // Get shipping price for total calculation
        const rate = shippingRates.find(r => r.name_ar === formData.governorate || r.name_en === formData.governorate);
        const shippingPrice = rate ? rate.price : 0;
        
        const subtotalLocal = itemsToOrder.reduce((total, item) => {
          const priceStr = item.price ? item.price.toString() : '0';
          const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
          return total + (price * item.qty);
        }, 0);
        
        const finalTotalLocal = subtotalLocal + shippingPrice;

        if (!supabase) {
            console.log("Order details (Demo Mode):", {
                customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
                customer_phone: `${formData.phone} / ${formData.phone2}`,
                total_amount: finalTotalLocal,
                shipping_address: `${formData.address}, ${formData.governorate}`
            });
        }

        // 1. Create order in DB
        const { data: orderData, error: dbError } = await supabase
            .from('orders')
            .insert([{
                customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
                customer_email: formData.identity,
                total_amount: finalTotalLocal,
                deposit_paid: 0, 
                deposit_required: 0,
                status: 'pending',
                items: itemsToOrder,
                customer_phone: `${formData.phone} / ${formData.phone2}`,
                governorate: formData.governorate,
                payment_method: 'Cash on Delivery',
                shipping_address: `${formData.address}, ${formData.apartment}, ${formData.city}, ${formData.governorate}`
            }])
            .select()
            .single();

        if (dbError) throw dbError;
        
        // 1.5 Decrement Stock in DB
        for (const item of itemsToOrder) {
            try {
                const { data: prod } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.id)
                    .single();
                
                if (prod && prod.stock !== undefined) {
                    const newStock = Math.max(0, (prod.stock || 0) - item.qty);
                    await supabase
                        .from('products')
                        .update({ stock: newStock })
                        .eq('id', item.id);
                }
            } catch (err) {
                console.error("Failed to update stock for item:", item.id, err);
            }
        }

        // 2. Redirect
        localStorage.removeItem('noury_checkout_item');
        clearCart();
        
        // Pass order details to success page
        router.push(`/payment-success?success=true&id=${orderData.id}&amount=${finalTotalLocal}`);

    } catch (err) {
        alert("عذراً، حدث خطأ أثناء إتمام الطلب: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 py-10" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Contact Section */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-medium text-gray-900">{t('checkout_contact')}</h2>
          {!supabase && (
            <span className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
                Demo Mode (No DB)
            </span>
          )}
        </div>
        <InputField 
            label={isRTL ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"} 
            placeholder={isRTL ? "البريد الإلكتروني" : "Email Address"} 
            value={formData.identity}
            onChange={(v) => setFormData({...formData, identity: v})}
        />
      </section>

      {/* Delivery Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-medium text-gray-900">{t('checkout_delivery')}</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
                label={isRTL ? "الاسم الأول" : "First name"} 
                placeholder={isRTL ? "الاسم الأول" : "First name"} 
                value={formData.firstName}
                onChange={(v) => setFormData({...formData, firstName: v})}
                required
            />
            <InputField 
                label={isRTL ? "اسم العائلة" : "Last name"} 
                placeholder={isRTL ? "اسم العائلة" : "Last name"} 
                value={formData.lastName}
                onChange={(v) => setFormData({...formData, lastName: v})}
                required
            />
          </div>
          
          {/* Governorate Selection */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                {isRTL ? "المحافظة" : "Governorate"}
            </label>
            <select 
                required
                value={formData.governorate}
                onChange={(e) => handleGovernateChange(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#c19a2e] focus:ring-1 focus:ring-[#c19a2e] transition-all text-sm bg-white"
            >
                <option value="">{isRTL ? "اختر المحافظة" : "Select Governorate"}</option>
                {shippingRates.map(rate => (
                    <option key={rate.id} value={isRTL ? rate.name_ar : rate.name_en}>
                        {isRTL ? rate.name_ar : rate.name_en} (+{rate.price} EGP)
                    </option>
                ))}
            </select>
          </div>

          <InputField 
            label={isRTL ? "العنوان" : "Address"} 
            placeholder={isRTL ? "العنوان بالتفصيل" : "Address"} 
            value={formData.address}
            onChange={(v) => setFormData({...formData, address: v})}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
                label={isRTL ? "رقم الهاتف الأول" : "Primary Phone Number"} 
                placeholder="01xxxxxxxxx" 
                value={formData.phone}
                onChange={(v) => setFormData({...formData, phone: v})}
                required
            />
            <InputField 
                label={isRTL ? "رقم الهاتف الثاني (إجباري)" : "Secondary Phone Number (Required)"} 
                placeholder="01xxxxxxxxx" 
                value={formData.phone2}
                onChange={(v) => setFormData({...formData, phone2: v})}
                required
            />
          </div>
        </div>
      </section>

      {/* Order Summary Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-medium text-gray-900">{isRTL ? "ملخص الطلب" : "Order Summary"}</h2>
        <div className="flex flex-col gap-3 p-6 bg-gray-50 border border-gray-100 rounded-md shadow-sm">
           <div className="flex justify-between items-center text-sm text-gray-500">
             <span>{isRTL ? "المجموع الفرعي" : "Subtotal"}</span>
             <span>{subtotal.toFixed(2)} EGP</span>
           </div>
           <div className="flex justify-between items-center text-sm text-gray-500">
             <span>{isRTL ? "تكلفة الشحن" : "Shipping"}</span>
             <span>{shippingPrice.toFixed(2)} EGP</span>
           </div>
           <div className="h-px bg-gray-200 my-2" />
           <div className="flex justify-between items-center text-black font-serif italic">
             <span className="text-base">{isRTL ? "الإجمالي الكلي" : "Total Amount"}</span>
             <span className="text-xl tracking-tight font-bold">{finalTotal.toFixed(2)} EGP</span>
           </div>
        </div>
      </section>

      <button 
        type="submit"
        disabled={loading}
        className="w-full h-16 bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.2em] rounded-md hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
      >
        {loading ? (isRTL ? "جاري المعالجة..." : "Processing...") : t('complete_order')}
      </button>
    </form>
  );
}
