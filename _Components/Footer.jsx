"use client";

import React, { useState } from 'react'
import { useStore } from '@/context/StoreContext';

function Footer() {
  const { t, isRTL, language, toggleLanguage } = useStore();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  return (
    <footer className="bg-[#6d1616] text-white py-16 px-6 md:px-20 font-sans relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20 mb-20">
          
          {/* Logo Section */}
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tighter leading-none mb-2">
              N B
            </h2>
            <p className="text-[10px] tracking-[0.4em] uppercase opacity-80 whitespace-nowrap">
              NOURY BEAUTY
            </p>
          </div>

          {/* Column 1: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-tight">{t('quick_links')}</h3>
            <ul className="flex flex-col gap-3 text-sm opacity-90">
              <li><a href="#" className="hover:opacity-60 transition-opacity">Search</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Products</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">About Us</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Contact</a></li>
            </ul>
          </div>

          {/* Column 2: Policies */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-tight">{t('policies')}</h3>
            <ul className="flex flex-col gap-3 text-sm opacity-90">
              <li><a href="#" className="hover:opacity-60 transition-opacity">Privacy Policy</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Refund Policy</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Shipping Policy</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 3: Socials */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-tight">{t('keep_touch')}</h3>
            <div className="flex gap-6">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/noury_glossy?igsh=MWJpcm9mbTEwd3AxaA%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/share/181CWJCxTa/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* WhatsApp */}
              <a 
                href="https://wa.me/201070504728" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.411.001 12.046c0 2.121.554 4.189 1.605 6.006L0 24l6.149-1.613a11.782 11.782 0 0 0 5.897 1.576h.004c6.634 0 12.045-5.411 12.048-12.047a11.77 11.77 0 0 0-3.489-8.452z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-6 text-[13px] opacity-90">
          <div className={`flex flex-wrap items-center gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span>&copy; 2026, Noury Beauty</span>
            <span className="mx-1">|</span>
            <span>All rights reserved. </span>
            <a href="https://www.facebook.com/mohamed.hanafy.10004" target="_blank" rel="noopener noreferrer">Developed by Mohamed Hanafy</a>
          </div>

          <div className="flex items-center gap-10 relative">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-60 transition-opacity"
              >
                <span>{language === 'en' ? 'English' : 'العربية'}</span>
                <svg className={`w-3 h-3 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              {isLangDropdownOpen && (
                <div className="absolute bottom-full mb-2 right-0 bg-white text-black py-2 rounded shadow-lg min-w-[100px] z-50">
                  <button onClick={() => { toggleLanguage('en'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-1 hover:bg-gray-100 text-xs">English</button>
                  <button onClick={() => { toggleLanguage('ar'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-1 hover:bg-gray-100 text-xs">العربية</button>
                </div>
              )}
            </div>

            {/* Spacer for desktop layout */}
            <div className="hidden md:block w-[50px]" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;