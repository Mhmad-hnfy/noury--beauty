"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';

function ToastItem({ toast, onRemove }) {
    const { isRTL } = useStore();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => onRemove(toast.id), 350);
    };

    return (
        <div
            style={{
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                opacity: visible ? 1 : 0,
                transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
            }}
            className="relative flex items-center gap-3 bg-white border border-gray-100 shadow-2xl rounded-sm px-4 py-3.5 min-w-[280px] max-w-[360px] pointer-events-auto overflow-hidden"
        >
            {/* Icon */}
            <div className="w-9 h-9 bg-[#6d1616] rounded-sm flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                    <path d="M3 6h18"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                    {isRTL ? 'تمت الإضافة للسلة' : 'Added to cart'}
                </p>
                <p className="text-[13px] font-semibold text-black truncate leading-snug">
                    {toast.message}
                </p>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-100 rounded-b-sm overflow-hidden">
                <div
                    className="h-full bg-[#6d1616]"
                    style={{
                        animation: 'toast-progress 3.5s linear forwards',
                    }}
                />
            </div>

            {/* Close */}
            <button
                onClick={handleClose}
                className="p-1 text-gray-300 hover:text-gray-600 transition-colors shrink-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
            </button>

            <style>{`
                @keyframes toast-progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}

export default function Toast() {
    const { toasts, removeToast, isRTL } = useStore();

    console.log("Toast Component Rendered. toasts length:", toasts.length, "toasts:", toasts);

    if (toasts.length === 0) return null;

    return (
        <div
            className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-[9999] flex flex-col gap-3 pointer-events-none`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
}
