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
  const depositAmount = finalTotal * 0.2;

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
        const depositAmountLocal = Math.round(finalTotalLocal * 0.2);

        if (!supabase) {
            console.log("Order details (Demo Mode):", {
                customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
                customer_phone: `${formData.phone} / ${formData.phone2}`,
                total_amount: finalTotalLocal,
                deposit_amount: depositAmountLocal,
                shipping_address: `${formData.address}, ${formData.governorate}`
            });
        }

        // 1. Create order in DB as pending
        const { data: orderData, error: dbError } = await supabase
            .from('orders')
            .insert([{
                customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
                customer_email: formData.identity,
                total_amount: finalTotalLocal,
                deposit_paid: 0, 
                deposit_required: depositAmountLocal,
                status: 'awaiting_payment',
                items: itemsToOrder,
                customer_phone: `${formData.phone} / ${formData.phone2}`,
                governorate: formData.governorate,
                payment_method: 'paymob_deposit',
                shipping_address: `${formData.address}, ${formData.apartment}, ${formData.city}, ${formData.governorate}`
            }])
            .select()
            .single();

        if (dbError) throw dbError;

        // 2. Call our API to get Paymob token
        const payRes = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: depositAmountLocal,
                customer: {
                    ...formData,
                    phone: formData.paymentMethod === 'wallet' ? walletPhone : formData.phone
                },
                items: itemsToOrder,
                paymentMethod: formData.paymentMethod || 'wallet'
            })
        });

        const { token, iframeId, redirectUrl, success, message, paymobOrderId, error: payError } = await payRes.json();

        if (payError) throw new Error(payError);

        // 3. Update Supabase order with Paymob Order ID for tracking
        if (supabase) {
            await supabase
                .from('orders')
                .update({ paymob_order_id: paymobOrderId })
                .eq('id', orderData.id);
        }

        // 4. Redirect
        localStorage.removeItem('noury_checkout_item');
        clearCart();
        
        if (success && message === 'USSD_PUSH_SENT') {
            alert("تم إرسال طلب الدفع إلى محفظتك بنجاح. يرجى فتح هاتفك المحمول الآن والموافقة على العملية بكتابة الرقم السري للمحفظة.");
            router.push('/payment-success'); 
            return;
        }

        if (redirectUrl) {
            // Direct redirect for Wallets
            window.location.href = redirectUrl;
        } else {
            // Iframe redirect for Cards
            window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${token}`;
        }

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
           
           {/* Deposit Amount Highlight */}
           <div className="mt-4 p-4 bg-white border border-dashed border-[#c19a2e]/30 rounded-sm flex flex-col gap-1 items-center animate-in zoom-in-95 duration-700">
             <span className="text-[#c19a2e] text-[10px] font-bold uppercase tracking-[0.2em]">
               {isRTL ? "المبلغ المطلوب دفعه لتأكيد الطلب (20%)" : "Required Deposit to Confirm (20%)"}
             </span>
             <span className="text-2xl font-bold text-black font-serif">
               {depositAmount.toFixed(2)} EGP
             </span>
             <span className="text-[9px] text-gray-400 italic">
                {isRTL ? "سيتم دفع المبلغ المتبقي عند الاستلام" : "Remaining balance will be paid on delivery"}
             </span>
           </div>
        </div>
      </section>

    <section className="flex flex-col gap-6">
        <h2 className="text-xl font-medium text-gray-900">{t('checkout_payment')}</h2>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {/* Mobile Wallet Option */}
           <div className={`p-6 flex flex-col gap-3 border-b border-gray-100 cursor-pointer transition-colors ${formData.paymentMethod === 'wallet' ? 'bg-gray-50' : 'bg-white'}`}
                onClick={() => setFormData({...formData, paymentMethod: 'wallet'})}>
             <div className="flex items-center gap-3">
                 <input 
                     type="radio" name="payment" id="wallet" className="w-4 h-4 accent-[#c19a2e]" 
                     checked={formData.paymentMethod === 'wallet' || !formData.paymentMethod}
                     onChange={() => setFormData({...formData, paymentMethod: 'wallet'})}
                 />
                 <label htmlFor="wallet" className="text-sm font-bold text-gray-900 uppercase tracking-wider cursor-pointer">
                     {isRTL ? "المحافظ الإلكترونية (فودافون كاش / إلخ)" : "Mobile Wallets (Vodafone Cash / etc.)"}
                 </label>
             </div>

             {/* Dynamic Wallet Number Input */}
             {(formData.paymentMethod === 'wallet' || !formData.paymentMethod) && (
               <div className="ml-7 mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-300" onClick={(e) => e.stopPropagation()}>
                 <label className="text-[10px] font-bold text-[#c19a2e] uppercase tracking-wider">
                   {isRTL ? "رقم المحفظة (الذي ستدفع منه)" : "Wallet Number (for payment)"}
                 </label>
                 <input 
                   type="tel"
                   placeholder="01xxxxxxxxx"
                   required={formData.paymentMethod === 'wallet'}
                   value={walletPhone}
                   onChange={(e) => setWalletPhone(e.target.value)}
                   className="w-full h-10 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#c19a2e] text-sm"
                 />
               </div>
             )}

             <p className="text-[10px] text-gray-500 leading-relaxed indent-7">
                 {isRTL 
                   ? "ادفع 20% مقدم عبر أي محفظة إلكترونية لتأكيد طلبك." 
                   : "Pay 20% deposit via any mobile wallet to confirm your order."}
             </p>
           </div>

          {/* Online Card Option */}
          <div className={`p-6 flex flex-col gap-3 cursor-pointer transition-colors ${formData.paymentMethod === 'card' ? 'bg-gray-50' : 'bg-white'}`}
               onClick={() => setFormData({...formData, paymentMethod: 'card'})}>
            <div className="flex items-center gap-3">
                <input 
                    type="radio" name="payment" id="card" className="w-4 h-4 accent-[#c19a2e]" 
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => setFormData({...formData, paymentMethod: 'card'})}
                />
                <label htmlFor="card" className="text-sm font-bold text-gray-900 uppercase tracking-wider cursor-pointer">
                    {isRTL ? "بطاقة بنكية / انستا باي (Visa / Master)" : "Bank Card / Instapay (Visa / Master)"}
                </label>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed indent-7">
                {isRTL 
                  ? "ادفع 20% مقدم عبر بطاقتك البنكية أو انستا باي." 
                  : "Pay 20% deposit via your bank card or Instapay."}
            </p>
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
