"use client"
import React, { useState, useEffect } from 'react'

const Star = ({ filled = true }) => (
  <svg 
    className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.97a1 1 0 00-.364-1.118L2.245 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
  </svg>
)

const VerifiedBadge = () => (
  <div className="flex items-center justify-center w-5 h-5 bg-teal-500 rounded-sm">
    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  </div>
)

const Chevron = ({ direction = 'left', onClick }) => (
  <button 
    onClick={onClick}
    className="focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full p-2 transition-all"
  >
    <svg 
      className="w-10 h-10 text-black cursor-pointer hover:opacity-50 transition-opacity" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      {direction === 'left' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
      )}
    </svg>
  </button>
)

const REVIEWS = [
  {
    name: "Mona bakr",
    stars: 5,
    date: "1 year ago",
    title: "Very shiny without any glitter",
    content: "Best highlighter ever 🥺 💗 💗",
    product: "Compact Powder Highlighter",
    image: "https://images.unsplash.com/photo-1599733594230-6b823276abcc?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Sara Ahmed",
    stars: 5,
    date: "6 months ago",
    title: "Amazing Texture!",
    content: "The most natural looking serum I've used. My skin feels so soft.",
    product: "Glow Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Laila Khaled",
    stars: 5,
    date: "2 months ago",
    title: "Perfect Lip Gloss",
    content: "Not sticky at all and the shine is incredible. Highly recommend!",
    product: "LIP GLOSS (LELO)",
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=400&auto=format&fit=crop"
  }
];

import { useStore } from '@/context/StoreContext';
import Image from 'next/image';

function Saying() {
  const { reviews, isReviewsLoading, language } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); 

    return () => clearInterval(interval);
  }, [currentIndex, reviews.length]);

  if (isReviewsLoading) {
      return (
        <div className="py-20 flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
  }

  if (reviews.length === 0) return null;

  return (
    <div className='flex flex-col items-center w-full mt-32 relative pb-20'>
        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-serif text-black mb-4 text-center tracking-tight leading-tight">
          {language === 'ar' ? 'ماذا يقول الناس' : 'What People Are Saying'}
        </h2>

        {/* Rating Summary */}
        <div className="flex flex-col items-center gap-2 mb-20 text-center">
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} />)}
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-800 justify-center">
                <span>{language === 'ar' ? `من ${reviews.length} تقييم` : `from ${reviews.length} reviews`}</span>
                <VerifiedBadge />
            </div>
        </div>

        {/* Carousel Container */}
        <div className="w-full relative flex items-center justify-between px-4 md:px-12">
            {/* Desktop Left Arrow */}
            <div className="hidden md:block">
                <Chevron direction="left" onClick={prevSlide} />
            </div>

            {/* Content Area */}
            <div className="flex-1 max-w-5xl mx-auto overflow-hidden">
                <div 
                    className="flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {reviews.map((rev, idx) => (
                        <div key={idx} className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center bg-white py-4">
                            {/* User Column */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 px-4 border-r-0 md:border-r border-gray-100 last:border-0">
                                <p className="font-bold text-xl md:text-2xl tracking-tight text-black">{rev.name}</p>
                                <div className="flex gap-0.5">
                                    {[...Array(rev.stars)].map((_, i) => <Star key={i} />)}
                                </div>
                                <p className="text-gray-500 text-sm mt-1">{rev.date}</p>
                            </div>

                            {/* Message Column */}
                            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 px-4 border-r-0 md:border-r border-gray-100 last:border-0">
                                <p className="font-bold text-lg md:text-xl text-black leading-tight">
                                    {rev.title}
                                </p>
                                <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">
                                    "{rev.content}"
                                </p>
                            </div>

                            {/* Product Column */}
                            <div className="flex flex-col items-center gap-4 px-4">
                                {rev.image ? (
                                    <div className="relative w-40 h-40 group cursor-pointer">
                                        <Image 
                                            src={rev.image} 
                                            alt={rev.product}
                                            fill
                                            sizes="160px"
                                            className="object-contain transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity" />
                                    </div>
                                ) : (
                                    <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                    </div>
                                )}
                                <p className="text-sm md:text-base font-medium text-gray-900 border-b border-gray-900 pb-0.5">
                                    {rev.product}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Right Arrow */}
            <div className="hidden md:block">
                <Chevron direction="right" onClick={nextSlide} />
            </div>

            {/* Mobile Arrows */}
            <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex gap-10 md:hidden">
                <Chevron direction="left" onClick={prevSlide} />
                <Chevron direction="right" onClick={nextSlide} />
            </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex gap-2 mt-12">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-black w-6' : 'bg-gray-300'}`}
            />
          ))}
        </div>
       
    </div>
  )
}

export default Saying