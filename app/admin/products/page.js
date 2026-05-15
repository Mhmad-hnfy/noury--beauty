"use client";

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';

export default function ProductsManager() {
    const { products, isLoading, t, isRTL, deleteProduct } = useStore();

    const handleDelete = async (id) => {
        if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) return;

        try {
            if (supabase) {
                const { error } = await supabase.from('products').delete().eq('id', id);
                if (error) throw error;
            }
            await deleteProduct(id);
            alert(isRTL ? 'تم الحذف بنجاح' : 'Product deleted successfully');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-serif text-black">{t('admin_products')}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{products.length} {t('admin_products')}</p>
                </div>
                <a 
                    href="/admin/products/new" 
                    className="h-12 px-8 bg-[#6d1616] text-white flex items-center justify-center font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg rounded-sm w-full sm:w-auto"
                >
                    {t('admin_add_product')}
                </a>
            </div>

            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-20 flex justify-center">
                            <div className="w-8 h-8 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <table className="w-full text-left text-sm min-w-[700px]">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <tr>
                                    <th className="px-6 py-4 w-20"></th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_product_title')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_product_price')}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'المخزون' : 'Stock'}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('admin_product_actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
                                                <img 
                                                    src={product.images?.[0] || product.image} 
                                                    alt="" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{product.title}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.price} EGP</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${product.stock > 10 ? 'bg-green-50 text-green-600' : product.stock > 0 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                                                {product.stock || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <a 
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="text-blue-400 hover:text-blue-700 font-bold text-[10px] uppercase tracking-widest transition-colors"
                                                >
                                                    {t('admin_edit')}
                                                </a>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-400 hover:text-red-700 font-bold text-[10px] uppercase tracking-widest transition-colors"
                                                >
                                                    {t('admin_delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center text-gray-400 font-medium italic">
                            No products found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
