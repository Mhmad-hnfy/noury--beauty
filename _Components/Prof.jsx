"use client";

import React from 'react'
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';

function Prof() {
  const { t } = useStore();

  return (
    <section className="pt-2 pb-20 px-6 md:px-16 bg-white flex justify-center w-full overflow-hidden font-sans">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start text-left">
        
        {/* Left Column: Square Image */}
        <div className="w-full lg:w-[32%] flex-shrink-0">
          <div className="relative aspect-square overflow-hidden rounded-sm">
            <Image 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop" 
              alt="Noury Beauty Profile"
              fill
              sizes="(max-width: 1024px) 100vw, 32vw"
              className="object-cover shadow-sm transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex-1 flex flex-col items-start gap-6 lg:mt-6">
          <h2 className="text-4xl md:text-5xl font-serif text-black tracking-tight leading-tight">
            {t('discover_title')}
          </h2>
          
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-sans max-w-[550px]">
            {t('prof_desc')}
          </p>

          <div className="mt-2">
            <button className="px-8 py-2.5 border border-black text-black font-semibold text-[10px] hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-widest">
              {t('learn_more')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Prof