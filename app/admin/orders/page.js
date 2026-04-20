"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';

export default function OrdersManager() {
    const { t, isRTL } = useStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            if (!supabase) {
                console.log("Supabase not connected. Using local storage/mock data.");
                const savedOrders = localStorage.getItem('noury_demo_orders');
                if (savedOrders) {
                    setOrders(JSON.parse(savedOrders));
                } else {
                    const mock = [
                        { id: 'mq-1', customer_name: 'Sarah Ahmed', customer_email: 'sarah@example.com', total_amount: 300, status: 'pending', created_at: new Date().toISOString(), shipping_address: 'Cairo, Egypt' },
                        { id: 'mq-2', customer_name: 'Noor Ali', customer_email: 'noor@example.com', total_amount: 450, status: 'shipped', created_at: new Date().toISOString(), shipping_address: 'Alexandria, Egypt' }
                    ];
                    setOrders(mock);
                    localStorage.setItem('noury_demo_orders', JSON.stringify(mock));
                }
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            console.log("Orders fetched from Supabase:", data?.length);
            setOrders(data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            if (supabase) {
                const { error } = await supabase.from('orders').update({ status }).eq('id', id);
                if (error) throw error;
            }
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status });
        } catch (err) {
            alert(err.message);
        }
    };
    
    const handleDeleteOrder = async (id) => {
        if (!confirm(isRTL ? "هل أنت متأكد من حذف هذا الطلب؟" : "Are you sure you want to delete this order?")) return;
        
        try {
            setIsDeleting(true);
            if (supabase) {
                // Perform delete and select to verify row removal
                const { data, error, status } = await supabase
                    .from('orders')
                    .delete()
                    .eq('id', id)
                    .select();
                
                console.log("Delete attempt response:", { data, status });
                
                if (error) throw error;
                
                // If ID exists but nothing returned, it's likely an RLS policy issue
                if (data && data.length === 0) {
                    alert(isRTL 
                        ? "فشل الحذف في قاعدة البيانات! غالباً بسبب سياسة الأمان (RLS). يرجى تشغيل كود SQL الذي أرسلته لك في لوحة تحكم Supabase." 
                        : "Delete failed! This is likely due to Supabase RLS policies. Please run the SQL fix in your Supabase dashboard.");
                    return;
                }
            } else {
                // In Demo Mode: Update localStorage persistence
                const currentOrders = JSON.parse(localStorage.getItem('noury_demo_orders') || '[]');
                const updatedOrders = currentOrders.filter(o => o.id !== id);
                localStorage.setItem('noury_demo_orders', JSON.stringify(updatedOrders));
                console.log("Local Delete Successful");
            }
            // Use functional update to ensure we use latest state
            setOrders(prev => prev.filter(o => o.id !== id));
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
            setSelectedOrder(null);
        } catch (err) {
            console.error("Delete Error:", err);
            alert(isRTL ? `خطأ أثناء الحذف: ${err.message}` : `Delete Error: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(isRTL ? `هل أنت متأكد من حذف ${selectedIds.length} طلب؟` : `Are you sure you want to delete ${selectedIds.length} orders?`)) return;

        try {
            setIsDeleting(true);
            if (supabase) {
                const { data, error, status } = await supabase
                    .from('orders')
                    .delete()
                    .in('id', selectedIds)
                    .select();
                
                console.log("Bulk delete attempt response:", { data, status });
                
                if (error) throw error;

                if (data && data.length === 0) {
                    alert(isRTL 
                        ? "فشل الحذف الجماعي! قد يكون بسبب RLS. يرجى مراجعة لوحة تحكم Supabase." 
                        : "Bulk delete failed! Likely due to RLS policies.");
                    return;
                }
            } else {
                // In Demo Mode: Update localStorage persistence
                const currentOrders = JSON.parse(localStorage.getItem('noury_demo_orders') || '[]');
                const updatedOrders = currentOrders.filter(o => !selectedIds.includes(o.id));
                localStorage.setItem('noury_demo_orders', JSON.stringify(updatedOrders));
                console.log("Local Bulk Delete Successful");
            }
            // Use functional update to ensure we use latest state
            setOrders(prev => prev.filter(o => !selectedIds.includes(o.id)));
            setSelectedIds([]);
        } catch (err) {
            console.error("Bulk Delete Error:", err);
            alert(isRTL ? `خطأ أثناء الحذف الجماعي: ${err.message}` : `Bulk Delete Error: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === orders.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(orders.map(o => o.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const exportToExcel = () => {
        if (!orders || orders.length === 0) return;
        
        const excelData = orders.map(order => {
            const deposit = order.deposit_paid || 0;
            const balance = (order.total_amount || 0) - deposit;
            const itemsSummary = (order.items || []).map(item => 
                `${item.title} (${item.selectedColor || 'Standard'}) x${item.qty}`
            ).join(' | ');

            return {
                'Order ID': order.id,
                'Customer Name': order.customer_name,
                'Email': order.customer_email || 'N/A',
                'Phone': order.customer_phone || 'N/A',
                'Governorate': order.governorate || 'N/A',
                'Shipping Address': order.shipping_address || 'N/A',
                'Products Detail': itemsSummary,
                'Balance Due (EGP)': balance,
                'Date': new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        
        XLSX.writeFile(workbook, "Noury_Beauty_Orders.xlsx");
    };

    const exportToPDF = async () => {
        const activeOrders = selectedIds.length > 0 
            ? orders.filter(o => selectedIds.includes(o.id)) 
            : orders;

        if (activeOrders.length === 0) return;

        try {
            // We use a dedicated hidden div for the invoice layout
            // This ensures perfect Arabic rendering and CSS consistency
            const element = document.createElement('div');
            element.style.padding = '0';
            element.style.background = 'white';
            element.style.width = '800px'; // Optimization for capture
            
            // Generate full HTML content for all invoices
            let fullHtml = `
                <style>
                    .invoice-page { padding: 40px; background: white; font-family: sans-serif; position: relative; color: black; line-height: 1.6; }
                    .header { border-bottom: 2px solid #6d1616; padding-bottom: 20px; text-align: center; margin-bottom: 30px; }
                    .brand { font-size: 28px; color: #6d1616; font-weight: bold; margin-bottom: 5px; }
                    .invoice-title { font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 2px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; direction: rtl; }
                    .info-box { background: #f9f9f9; padding: 20px; border-radius: 4px; }
                    .info-label { font-size: 10px; font-weight: bold; color: #666; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                    .info-value { font-size: 13px; font-weight: bold; }
                    .order-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; direction: rtl; }
                    .order-table th { background: #6d1616; color: white; padding: 12px; font-size: 11px; text-align: right; }
                    .order-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 12px; text-align: right; }
                    .order-table tr:nth-child(even) { background: #fafafa; }
                    .total-box { margin-right: auto; width: 250px; background: #fdfdfd; padding: 20px; border: 1px solid #eee; direction: rtl; }
                    .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; }
                    .total-final { border-top: 2px solid #6d1616; margin-top: 15px; padding-top: 10px; display: flex; justify-content: space-between; color: #6d1616; font-weight: bold; font-size: 16px; }
                    .footer { margin-top: 50px; text-align: center; color: #aaa; font-size: 10px; border-top: 1px solid #eee; padding-top: 20px; }
                    .html2pdf__page-break { page-break-after: always; }
                </style>
                <div class="invoices-container">
            `;

            activeOrders.forEach((order, index) => {
                const deposit = order.deposit_paid || 0;
                const balance = (order.total_amount || 0) - deposit;
                const dateStr = new Date(order.created_at).toLocaleDateString('ar-EG');

                fullHtml += `
                    <div class="invoice-page ${index < activeOrders.length - 1 ? 'html2pdf__page-break' : ''}">
                        <div class="header">
                            <div class="brand">نوري بيوتي - Noury Beauty</div>
                            <div class="invoice-title">فاتورة طلب / Order Invoice</div>
                        </div>

                        <div class="info-grid">
                            <div class="info-box">
                                <div class="info-label">بيانات الطلب</div>
                                <div class="info-value">رقم الطلب: ${order.id}</div>
                                <div class="info-value">التاريخ: ${dateStr}</div>
                            </div>
                            <div class="info-box">
                                <div class="info-label">بيانات العميل</div>
                                <div class="info-value">${order.customer_name}</div>
                                <div class="info-value">الهاتف: ${order.customer_phone || 'N/A'}</div>
                                <div class="info-value">العنوان: ${order.shipping_address}</div>
                            </div>
                        </div>

                        <table class="order-table">
                            <thead>
                                <tr>
                                    <th>المنتج</th>
                                    <th>اللون</th>
                                    <th>السعر</th>
                                    <th>الكمية</th>
                                    <th>الإجمالي</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(order.items || []).map(item => `
                                    <tr>
                                        <td>${item.title}</td>
                                        <td>${item.selectedColor || 'Standard'}</td>
                                        <td>${item.price} EGP</td>
                                        <td>${item.qty}</td>
                                        <td>${item.price * item.qty} EGP</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div style="display: flex; justify-content: flex-end;">
                            <div class="total-box">
                                <div class="total-row"><span>إجمالي الطلب:</span> <span>${order.total_amount} EGP</span></div>
                                <div class="total-row"><span style="color: green">المبلغ المدفوع:</span> <span>${deposit} EGP</span></div>
                                <div class="total-final"><span>المبلغ المتبقي:</span> <span>${balance} EGP</span></div>
                            </div>
                        </div>

                        <div class="footer">شكراً لتعاملكم مع نوري بيوتي - Noury Beauty</div>
                    </div>
                `;
            });

            fullHtml += '</div>';
            element.innerHTML = fullHtml;

            const opt = {
                margin: 0,
                filename: `Noury_Beauty_Invoices_${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().from(element).set(opt).save();
        } catch (err) {
            console.error("PDF Export Error:", err);
            alert(isRTL ? "عذراً، حدث خطأ أثناء إنشاء الملف." : "Sorry, an error occurred while generating the PDF.");
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-serif text-black">{t('admin_orders')}</h3>
                        {!supabase && (
                            <span className="text-[9px] bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
                                Demo Data
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{orders.length} {t('admin_orders')}</p>
                </div>
                
                <div className="flex items-center gap-4">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            {isRTL ? `حذف المختار (${selectedIds.length})` : `Delete Selected (${selectedIds.length})`}
                        </button>
                    )}
                    
                    <button
                        onClick={exportToPDF}
                        disabled={orders.length === 0}
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="16" y1="13" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/><line x1="8" x2="8" y1="13" y2="21"/></svg>
                        {isRTL ? "تحميل PDF" : "Download PDF"}
                    </button>

                    <button
                        onClick={exportToExcel}
                        disabled={orders.length === 0}
                        className="flex items-center gap-2 bg-[#6d1616] text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[#5a1212] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        {isRTL ? "تصدير" : "Export"}
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {error && (
                        <div className="p-10 bg-red-50 text-red-600 text-center text-xs font-bold uppercase tracking-widest border-b border-red-100">
                            Database Error: {error}
                        </div>
                    )}
                    {loading ? (
                        <div className="p-20 flex justify-center">
                            <div className="w-8 h-8 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        <table className="w-full text-left text-sm min-w-[900px]">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <tr>
                                    <th className="px-6 py-4 w-10">
                                        <input 
                                            type="checkbox" 
                                            checked={orders.length > 0 && selectedIds.length === orders.length}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 accent-[#6d1616] rounded border-gray-300 focus:ring-[#6d1616]"
                                        />
                                    </th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_id')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_customer')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "المحافظة" : "Gov."}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "الدفع" : "Payment"}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_total')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "المدفوع" : "Paid"}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? "المتبقي" : "Balance"}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_status')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_table_date')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_product_actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map(order => (
                                    <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(order.id) ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.includes(order.id)}
                                                onChange={() => toggleSelect(order.id)}
                                                className="w-4 h-4 accent-[#6d1616] rounded border-gray-300 focus:ring-[#6d1616]"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs opacity-50">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.customer_name}</span>
                                                <span className="text-[10px] text-gray-400">{order.customer_email || order.customer_phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">{order.governorate || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-gray-100 rounded-sm">
                                                {order.payment_method || 'instapay'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold">{order.total_amount} EGP</td>
                                        <td className="px-6 py-4 text-green-600 font-medium">{order.deposit_paid || 0} EGP</td>
                                        <td className="px-6 py-4 text-red-600 font-bold">{(order.total_amount || 0) - (order.deposit_paid || 0)} EGP</td>
                                        <td className="px-6 py-4">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className={`text-[10px] font-bold uppercase py-1 px-2 rounded-sm border-none focus:ring-0 ${order.status === 'shipped' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-[#6d1616] hover:underline"
                                                >
                                                    {t('view_details')}
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    {isRTL ? "حذف" : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center text-gray-400 font-medium italic">
                            {t('admin_no_orders')}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    ></div>
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-sm shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#6d1616] text-white">
                            <div className="flex flex-col">
                                <h4 className="text-lg font-serif">Order Details #{selectedOrder.id.slice(0, 8)}</h4>
                                <p className="text-[10px] uppercase tracking-widest opacity-70">
                                    {new Date(selectedOrder.created_at).toLocaleString(isRTL ? 'ar-EG' : 'en-US')}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Customer Info */}
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-4">
                                        <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Customer Info</h5>
                                        <div className="flex flex-col gap-3">
                                            <DetailItem label="Full Name" value={selectedOrder.customer_name} />
                                            <DetailItem label="Email" value={selectedOrder.customer_email || 'No email provided'} />
                                            <DetailItem label="Phones" value={selectedOrder.customer_phone} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Shipping Address</h5>
                                        <div className="flex flex-col gap-3">
                                            <DetailItem label="Address" value={selectedOrder.shipping_address} />
                                            <DetailItem label="Governorate" value={selectedOrder.governorate} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Financial Breakdown</h5>
                                        <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-sm border border-gray-100">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500 uppercase font-bold">Total Amount</span>
                                                <span className="font-bold">{selectedOrder.total_amount} EGP</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500 uppercase font-bold">Deposit Paid</span>
                                                <span className="text-green-600 font-bold">{selectedOrder.deposit_paid || 0} EGP</span>
                                            </div>
                                            <div className="h-px bg-gray-200" />
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-red-600 uppercase font-bold">Balance Due</span>
                                                <span className="text-red-600 font-bold underline">{(selectedOrder.total_amount || 0) - (selectedOrder.deposit_paid || 0)} EGP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="flex flex-col gap-6">
                                    <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Order Items</h5>
                                    <div className="flex flex-col gap-4">
                                        {(selectedOrder.items || []).map((item, idx) => (
                                            <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-sm border border-gray-100">
                                                <div className="w-16 h-20 bg-white border border-gray-200 rounded-sm overflow-hidden shrink-0">
                                                    <img src={item.image || item.displayImage} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex flex-col justify-center gap-1">
                                                    <h6 className="text-xs font-bold text-gray-900 uppercase">{item.title}</h6>
                                                    <div className="flex items-center gap-1.5">
                                                        {item.selectedColor && (
                                                            <div 
                                                                className="w-2.5 h-2.5 rounded-full border border-gray-200 shadow-sm"
                                                                style={{ backgroundColor: item.selectedColor }}
                                                            />
                                                        )}
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase">{item.selectedColor || 'Standard'}</p>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-black mt-1">
                                                        {item.qty} × {parseFloat(item.price.toString().replace(/[^0-9.]/g, '')).toFixed(2)} EGP
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Update Order Status</label>
                                            <select 
                                                value={selectedOrder.status}
                                                onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                                className={`w-full h-12 px-4 text-xs font-bold uppercase rounded-sm border border-gray-200 focus:outline-none ${selectedOrder.status === 'shipped' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleDeleteOrder(selectedOrder.id)}
                                            className="w-full h-12 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-colors border border-red-100"
                                        >
                                            Delete This Order Permanentely
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailItem({ label, value, isUpper = false, isBold = false }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
            <span className={`text-sm ${isBold ? 'font-bold' : 'font-medium'} text-gray-900 ${isUpper ? 'uppercase' : ''}`}>{value || '-'}</span>
        </div>
    );
}
