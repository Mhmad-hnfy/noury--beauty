"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import CartDrawer from './CartDrawer';

export default function Hedar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { language, toggleLanguage, t, searchQuery, setSearchQuery, isRTL, wishlist, cart, isCartOpen, setIsCartOpen } = useStore();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm font-sans">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-20 md:h-28 flex items-center justify-between relative">
        
        {/* Search Overlay (Shows only when isSearchOpen is true) */}
        {isSearchOpen && (
          <div className="absolute inset-0 bg-white z-[70] flex items-center px-4 md:px-20 animate-in fade-in slide-in-from-top duration-300">
            <div className="w-full max-w-5xl mx-auto relative flex items-center gap-4">
              <div className="flex-1 relative">
                <input 
                  autoFocus
                  type="text" 
                  placeholder={t('search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 md:h-14 text-lg border-b border-black bg-transparent focus:outline-none placeholder:text-gray-300"
                />
                <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center text-black`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* Mobile: Left (Burger) | Desktop: Hidden */}
        <div className="lg:hidden flex-1 flex justify-start">
          <button 
            className="hover:text-[#6d1616] transition-colors p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {/* Logo Section */}
        <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
          <Link 
            href="/"
            className={`text-2xl md:text-4xl font-serif text-[#6d1616] tracking-tight leading-tight cursor-pointer whitespace-nowrap ${isRTL ? 'ml-8' : 'mr-8'}`}
          >
            Noury Beauty
          </Link>
        </div>

        {/* Center: Navigation (Desktop Only - RESTORED TO PREVIOUS DUAL ROW) */}
        <nav className="hidden lg:flex flex-col items-center gap-4 flex-1 justify-center">
          {/* Top Row */}
          <div className="flex gap-8 text-[11px] font-semibold tracking-[0.15em] text-gray-900 uppercase">
            <Link href="/#products" className="hover:text-[#6d1616] transition-colors border-b border-transparent hover:border-[#6d1616]">{t('shop_all')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] transition-colors border-b border-transparent hover:border-[#6d1616]">{t('face_makeup')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] transition-colors border-b border-transparent hover:border-[#6d1616]">{t('body_care')}</Link>
          </div>
          {/* Bottom Row */}
          <div className="flex gap-8 text-[11px] font-semibold tracking-[0.15em] text-gray-900 uppercase">
            <Link href="/#products" className="hover:text-[#6d1616] transition-colors border-b border-transparent hover:border-[#6d1616]">{t('lips')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] transition-colors border-b border-transparent hover:border-[#6d1616]">{t('bundles')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] transition-colors border-b border-transparent hover:border-[#6d1616]">{t('about')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] transition-colors border-b border-transparent hover:border-[#6d1616]">{t('contact')}</Link>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex-1 flex items-center justify-end gap-2 md:gap-6">
          {/* Language Selector Dropdown */}
          <div className="hidden md:block relative">
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-700 hover:text-black transition-colors"
            >
              <span>{language === 'en' ? 'English' : 'العربية'}</span>
              <svg className={`transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            {isLangDropdownOpen && (
              <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-32 bg-white border border-gray-100 shadow-xl rounded-md overflow-hidden z-[60]`}>
                <button 
                  onClick={() => { toggleLanguage('en'); setIsLangDropdownOpen(false); }}
                  className={`w-full px-4 py-2 text-left text-xs font-medium hover:bg-gray-50 transition-colors ${language === 'en' ? 'text-[#6d1616] bg-gray-50' : 'text-gray-700'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => { toggleLanguage('ar'); setIsLangDropdownOpen(false); }}
                  className={`w-full px-4 py-2 text-right text-xs font-medium hover:bg-gray-50 transition-colors ${language === 'ar' ? 'text-[#6d1616] bg-gray-50' : 'text-gray-700'}`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>

          {/* Icons Group */}
          <div className="flex items-center gap-1 md:gap-4 text-gray-800">
            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-[#6d1616] transition-colors" 
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <button className="hidden lg:block p-2 hover:text-[#6d1616]" aria-label="User">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <Link href="/wishlist" className="relative p-2 hover:text-[#6d1616]" aria-label="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#6d1616] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-[#6d1616]" 
              aria-label="Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cart.reduce((total, item) => total + item.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl z-40 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col py-6 px-6 gap-4 font-semibold text-sm tracking-widest uppercase">
             <div className="flex gap-4 border-b border-gray-100 pb-4 mb-2">
                <button onClick={() => toggleLanguage('en')} className={`text-[10px] ${language === 'en' ? 'text-black' : 'text-gray-400'}`}>ENGLISH</button>
                <div className="w-px h-3 bg-gray-200" />
                <button onClick={() => toggleLanguage('ar')} className={`text-[10px] ${language === 'ar' ? 'text-black' : 'text-gray-400'}`}>العربية</button>
             </div>
            <Link href="/#products" className="hover:text-[#6d1616] py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>{t('shop_all')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>{t('face_makeup')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>{t('body_care')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>{t('lips')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>{t('bundles')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] py-2 border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>{t('about')}</Link>
            <Link href="/#products" className="hover:text-[#6d1616] py-2 border-b border-gray-50 font-serif lowercase tracking-normal" onClick={() => setIsMenuOpen(false)}>{t('contact')}</Link>
          </nav>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}