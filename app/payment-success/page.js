"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Hedar from '@/_Components/Hedar';
import Footer from '@/_Components/Footer';
import { useStore } from '@/context/StoreContext';

const InvoiceItem = ({ label, value, isBold = false }) => (
  <div className={`flex justify-between py-3 border-b border-gray-50 ${isBold ? 'font-bold text-black' : 'text-gray-500 text-sm'}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { t, isRTL } = useStore();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Paymob success callback parameters
    const success = searchParams.get('success');
    const orderId = searchParams.get('id');
    const amountCents = searchParams.get('amount_cents');
    const transactionId = searchParams.get('txn_response_code');

    if (success === 'true') {
      setOrderDetails({
        orderId: orderId,
        paidAmount: (parseFloat(amountCents) / 100).toFixed(2),
        transactionId: transactionId,
        date: new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')
      });
    }
  }, [searchParams, isRTL]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Hedar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 border-4 border-[#c19a2e] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-medium italic">Verifying Payment...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Hedar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center gap-6 mb-16 animate-in slide-in-from-top-4 duration-700">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
           </div>
           <h1 className="text-4xl md:text-5xl font-serif text-black leading-tight">
             {isRTL ? "شكراً لك! تم دفع العربون بنجاح" : "Thank You! Deposit Paid Successfully"}
           </h1>
           <p className="text-gray-500 max-w-md">
             {isRTL 
               ? "تم استلام دفعة الـ 20% لتأكيد طلبك. ستصلك رسالة تأكيد قريباً." 
               : "We've received your 20% deposit to confirm your order. A confirmation email will be sent shortly."}
           </p>
        </div>

        {/* Digital Invoice Section */}
        <div className="bg-gray-50 border border-gray-100 rounded-sm p-8 md:p-12 shadow-sm animate-in fade-in duration-1000">
          <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-200">
            <div className="flex flex-col gap-1">
               <h2 className="text-xl font-serif text-black">{isRTL ? "تفاصيل الفاتورة" : "Payment Summary"}</h2>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Ref: {orderDetails.orderId}</p>
            </div>
            <div className="text-right">
               <p className="text-xs text-gray-400 font-medium">{orderDetails.date}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-10">
            <InvoiceItem label={isRTL ? "رقم العملية" : "Transaction ID"} value={orderDetails.transactionId} />
            <InvoiceItem label={isRTL ? "المبلغ المدفوع (20%)" : "Paid Amount (20%)"} value={`${orderDetails.paidAmount} EGP`} isBold />
            <div className="mt-4 p-4 bg-white border border-dashed border-gray-200 rounded-sm flex justify-between items-center italic">
               <span className="text-xs text-gray-400 font-medium">{isRTL ? "المبلغ المتبقي (عند الاستلام)" : "Remaining Balance (COD)"}</span>
               <span className="text-lg font-bold text-gray-900">{(parseFloat(orderDetails.paidAmount) * 4).toFixed(2)} EGP</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-6">
            <button 
              onClick={() => window.print()}
              className="w-full h-12 border border-black text-black text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M6 9V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>
              {isRTL ? "طباعة الفاتورة" : "Print Invoice"}
            </button>
            <a 
              href="/"
              className="w-full h-12 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#c19a2e] transition-all flex items-center justify-center"
            >
              {isRTL ? "العودة للمتجر" : "Back to Store"}
            </a>
          </div>
        </div>

        <div className="mt-12 text-center text-[10px] text-gray-400 uppercase tracking-widest font-medium">
           Noury Beauty © {new Date().getFullYear()} — Premium Cosmetics
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#c19a2e] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
