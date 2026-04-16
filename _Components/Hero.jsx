"use client";

import React from 'react'
import Card from './Card'
import Saying from './Saying'
import { useStore } from '@/context/StoreContext';

function Hero() {
  const { t, searchQuery, language, products, isLoading } = useStore();

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-24 px-6 bg-white min-h-fit">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-serif text-black mb-10 text-center tracking-tight leading-tight">
          {t('best_seller')}
        </h2>
        
        <div className="mb-20">
          <a 
            href="#" 
            className="text-lg md:text-xl font-medium text-black border-b-2 border-black pb-1 hover:opacity-60 transition-all duration-300 tracking-wide"
          >
            {t('all_products')}
          </a>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Loading Collection</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-10 md:gap-y-16 w-full">
            {filteredProducts.map(product => (
              <Card 
                key={product.id}
                id={product.id}
                title={product.title}
                price={`${product.price} EGP`}
                oldPrice={product.oldPrice ? `${product.oldPrice} EGP` : null}
                colors={product.colors}
                image={product.images?.[0] || product.image}
                allImages={product.images || [product.image]}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400 font-sans italic">
             {language === 'ar' ? 'لم يتم العثور على منتجات مطابقة للبحث' : 'No products found matching your search.'}
          </div>
        )}

        <Saying />  
        
      </div>
    </section>
  )
}

export default Hero