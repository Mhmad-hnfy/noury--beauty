"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

const translations = {
  en: {
    // Header
    shop_all: "Shop All",
    face_makeup: "Face Makeup",
    body_care: "Body Care",
    lips: "Lips",
    bundles: "Bundles",
    about: "About",
    contact: "Contact",
    search_placeholder: "Search products",
    english: "English",
    arabic: "العربية",
    // Hero
    best_seller: "Shop Our Best Seller",
    all_products: "All Products",
    // Prof
    discover_title: "Discover Noury Beauty",
    prof_desc: "I'm Nourhan, and I believe that beauty is about embracing who you are. With Noury Beauty, I've created a line of cosmetics that enhances your natural features with ease and elegance. Each product is crafted to bring out the best in you, helping you feel confident, radiant, and authentically yourself.",
    learn_more: "Learn More",
    // Card & Modal
    select_options: "Select Options",
    quantity: "Quantity",
    add_to_cart: "Add to Cart",
    buy_now: "Buy it Now",
    in_stock: "In stock",
    out_of_stock: "Out of Stock",
    stock_available: "Stock available",
    color: "Color",
    view_details: "View details",
    // Footer
    quick_links: "Quick Links",
    policies: "Policies",
    keep_touch: "Keep in Touch!",
    rights: "All rights reserved",
    developed_by: "Developed by DISTRICT10",
    // Checkout
    checkout_contact: "Contact",
    checkout_delivery: "Delivery",
    checkout_shipping: "Shipping method",
    checkout_payment: "Payment",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    complete_order: "Complete order",
    login: "Log in",
    // Cart
    cart_title: "My Cart",
    cart_empty: "Your cart is currently empty.",
    cart_product: "Product",
    cart_price: "Price",
    cart_qty: "Quantity",
    cart_total: "Total",
    cart_subtotal: "Subtotal",
    cart_shipping_at_checkout: "Shipping and taxes calculated at checkout",
    cart_checkout: "Check Out",
    cart_continue: "Continue Shopping",
    cart_remove: "Remove",
    // Wishlist
    wishlist_title: "My Wishlist",
    empty_wishlist: "Your wishlist is empty.",
    // Admin Sidebar
    admin_dashboard: "Dashboard",
    admin_products: "Products",
    admin_orders: "Orders",
    admin_settings: "Settings",
    admin_logout: "Logout",
    // Admin Dashboard
    admin_stats_products: "Total Products",
    admin_stats_orders: "Total Orders",
    admin_stats_revenue: "Total Revenue",
    admin_recent_orders: "Recent Orders",
    admin_table_id: "Order ID",
    admin_table_customer: "Customer",
    admin_table_total: "Total",
    admin_table_status: "Status",
    admin_table_date: "Date",
    admin_no_orders: "No orders found yet.",
    // Admin Products
    admin_add_product: "Add Product",
    admin_product_title: "Product Title",
    admin_product_price: "Price",
    admin_product_colors: "Colors",
    admin_product_actions: "Actions",
    admin_delete: "Delete",
    // Admin Settings
    admin_account_settings: "Account Settings",
    admin_credentials_desc: "Manage your administrative credentials",
    admin_change_email: "Change Admin Email",
    admin_change_password: "Change Admin Password",
    admin_new_email: "New Email Address",
    admin_new_password: "New Password",
    admin_update: "Update",
    admin_edit: "Edit",
    admin_reviews: "Reviews",
  },
  ar: {
    // Header
    shop_all: "تسوق الكل",
    face_makeup: "مجموعة الوجه",
    body_care: "عناية بالجسم",
    lips: "مجموعة الشفاه",
    bundles: "مجموعات العناية",
    about: "من نحن",
    contact: "اتصل بنا",
    search_placeholder: "ابحث عن المنتجات...",
    english: "English",
    arabic: "العربية",
    // Hero
    best_seller: "تسوق المنتجات الأكثر مبيعاً",
    all_products: "جميع المنتجات",
    // Prof
    discover_title: "اكتشف نوري بيوتي",
    prof_desc: "أنا نورهان، وأؤمن أن الجمال هو تقبل ذاتك كما هي. مع نوري بيوتي، ابتكرت مجموعة من مستحضرات التجميل التي تبرز ملامحك الطبيعية بكل سهولة وأناقة. تم صياغة كل منتج ليخرج أفضل ما فيك، مما يساعدك على الشعور بالثقة والإشراق.",
    learn_more: "اعرف المزيد",
    // Card & Modal
    select_options: "اختر المواصفات",
    quantity: "الكمية",
    add_to_cart: "أضف للسلة",
    buy_now: "شراء الآن",
    in_stock: "متوفر بالمخزن",
    out_of_stock: "نفد من المخزن",
    stock_available: "الكمية المتوفرة",
    color: "اللون",
    view_details: "عرض التفاصيل",
    // Footer
    quick_links: "روابط سريعة",
    policies: "السياسات",
    keep_touch: "ابقَ على تواصل!",
    rights: "جميع الحقوق محفوظة",
    developed_by: "تطوير بواسطة DISTRICT10",
    // Checkout
    checkout_contact: "بيانات التواصل",
    checkout_delivery: "بيانات التوصيل",
    checkout_shipping: "طريقة الشحن",
    checkout_payment: "طريقة الدفع",
    subtotal: "المجموع الفرعي",
    shipping: "الشحن",
    total: "الإجمالي",
    complete_order: "إتمام الطلب",
    login: "تسجيل الدخول",
    // Cart
    cart_title: "سلة التسوق",
    cart_empty: "سلة التسوق الخاصة بك فارغة حالياً.",
    cart_product: "المنتج",
    cart_price: "السعر",
    cart_qty: "الكمية",
    cart_total: "الإجمالي",
    cart_subtotal: "المجموع الفرعي",
    cart_shipping_at_checkout: "يتم حساب الشحن والضرائب عند الدفع",
    cart_checkout: "إتمام الشراء",
    cart_continue: "مواصلة التسوق",
    cart_remove: "حذف",
    // Wishlist
    wishlist_title: "قائمة أمنياتي",
    empty_wishlist: "قائمة أمنياتك فارغة.",
    // Admin Sidebar
    admin_dashboard: "لوحة التحكم",
    admin_products: "المنتجات",
    admin_orders: "الطلبات",
    admin_settings: "الإعدادات",
    admin_logout: "تسجيل الخروج",
    // Admin Dashboard
    admin_stats_products: "إجمالي المنتجات",
    admin_stats_orders: "إجمالي الطلبات",
    admin_stats_revenue: "إجمالي الإيرادات",
    admin_recent_orders: "الطلبات الأخيرة",
    admin_table_id: "رقم الطلب",
    admin_table_customer: "العميل",
    admin_table_total: "الإجمالي",
    admin_table_status: "الحالة",
    admin_table_date: "التاريخ",
    admin_no_orders: "لا يوجد طلبات حالياً.",
    // Admin Products
    admin_add_product: "إضافة منتج",
    admin_product_title: "اسم المنتج",
    admin_product_price: "السعر",
    admin_product_colors: "الألوان",
    admin_product_actions: "إجراءات",
    admin_delete: "حذف",
    // Admin Settings
    admin_account_settings: "إعدادات الحساب",
    admin_credentials_desc: "إدارة بيانات دخول المدير",
    admin_change_email: "تغيير البريد الإلكتروني",
    admin_change_password: "تغيير كلمة المرور",
    admin_new_email: "البريد الإلكتروني الجديد",
    admin_new_password: "كلمة المرور الجديدة",
    admin_update: "تحديث",
    admin_edit: "تعديل",
    admin_reviews: "الآراء",
    admin_shipping: "أسعار الشحن",
  }
};

const MOCK_PRODUCTS = [
  {
    id: 'mock-1',
    title: "BREEZ GLOW HIGHLIGHTER",
    price: "199.00",
    oldPrice: "400.00",
    colors: ["#ff0080", "#ffd700", "#e0569d"],
    image: "https://images.unsplash.com/photo-1599733594230-6b823276abcc?q=80&w=800"
  },
  {
    id: 'mock-2',
    title: "MATTE LIPSTICK",
    price: "450.00",
    colors: ["#b33939", "#8b0000"],
    image: "https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=800"
  },
  {
    id: 'mock-3',
    title: "GLOW SERUM",
    price: "600.00",
    oldPrice: "750.00",
    colors: ["#f7d794"],
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800"
  },
  {
    id: 'mock-4',
    title: "HYDRATING MIST",
    price: "280.00",
    colors: ["#b2bec3", "#dfe6e9"],
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800"
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 'mock-rev-1',
    name: "Mona bakr",
    stars: 5,
    date: "1 year ago",
    title: "Very shiny without any glitter",
    content: "Best highlighter ever 🥺 💗 💗",
    product: "Compact Powder Highlighter",
    image: "https://images.unsplash.com/photo-1599733594230-6b823276abcc?q=80&w=400"
  },
  {
    id: 'mock-rev-2',
    name: "Sara Ahmed",
    stars: 5,
    date: "6 months ago",
    title: "Amazing Texture!",
    content: "The most natural looking serum I've used. My skin feels so soft.",
    product: "Glow Serum",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400"
  }
];

export const StoreProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);

  const [shippingRates, setShippingRates] = useState([]);
  const [isShippingLoading, setIsShippingLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(!!supabase);

  // Fetch Shipping Rates
  const fetchShippingRates = async () => {
    if (!supabase) {
        setShippingRates([]);
        setIsShippingLoading(false);
        return;
    }
    try {
      setIsShippingLoading(true);
      const { data, error } = await supabase
        .from('shipping_rates')
        .select('*')
        .order('name_ar', { ascending: true });
      if (error) throw error;
      setShippingRates(data || []);
    } catch (err) {
      console.error("Error fetching shipping rates:", err.message);
      setDbConnected(false);
    } finally {
      setIsShippingLoading(false);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('noury_lang');
    if (savedLang) setLanguage(savedLang);

    const savedWishlist = localStorage.getItem('noury_wishlist');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const savedCart = localStorage.getItem('noury_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    // Run all fetches in parallel for faster loading
    Promise.all([fetchProducts(), fetchReviews(), fetchShippingRates()]);
  }, []);

  const fetchProducts = async () => {
    if (!supabase) {
      console.warn('Supabase credentials missing. Checking localStorage.');
      const savedProducts = localStorage.getItem('noury_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(MOCK_PRODUCTS);
        localStorage.setItem('noury_products', JSON.stringify(MOCK_PRODUCTS));
      }
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, variants')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      // Normalize: handle old single-image and new multi-image variants
      const normalizedData = data?.map(p => {
          const variants = (p.variants || []).map(v => ({
              ...v,
              // Normalize: ensure `images` array exists for each variant
              images: v.images && v.images.length > 0
                  ? v.images
                  : v.image ? [v.image] : [],
          }));

          // Rebuild flat images & colors from variants if available
          const colors = variants.length > 0
              ? variants.map(v => v.color)
              : (p.colors || []);
          const images = variants.length > 0
              ? variants.flatMap(v => v.images)
              : (p.images || []);

          return {
              ...p,
              oldPrice: p.oldPrice || p.old_price,
              variants,
              colors,
              images,
              sizes: p.sizes || [],
          };
      });
      setProducts(normalizedData?.length > 0 ? normalizedData : MOCK_PRODUCTS);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product) => {
    const newProducts = [product, ...products];
    setProducts(newProducts);
    if (!supabase) {
        localStorage.setItem('noury_products', JSON.stringify(newProducts));
    }
  };

  const updateProduct = async (id, updatedData) => {
    const newProducts = products.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setProducts(newProducts);
    if (!supabase) {
        localStorage.setItem('noury_products', JSON.stringify(newProducts));
    }
  };

  const deleteProduct = async (id) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    if (!supabase) {
        localStorage.setItem('noury_products', JSON.stringify(newProducts));
    }
  };

  const fetchReviews = async () => {
    if (!supabase) {
      const saved = localStorage.getItem('noury_reviews');
      if (saved) {
        setReviews(JSON.parse(saved));
      } else {
        setReviews(DEFAULT_REVIEWS);
        localStorage.setItem('noury_reviews', JSON.stringify(DEFAULT_REVIEWS));
      }
      setIsReviewsLoading(false);
      return;
    }
    try {
      setIsReviewsLoading(true);
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setReviews(data?.length > 0 ? data : DEFAULT_REVIEWS);
    } catch (error) {
       setReviews(DEFAULT_REVIEWS);
    } finally {
       setIsReviewsLoading(false);
    }
  };

  const addReview = async (review) => {
    const newReviews = [review, ...reviews];
    setReviews(newReviews);
    if (!supabase) {
        localStorage.setItem('noury_reviews', JSON.stringify(newReviews));
    }
  };

  const updateReview = async (id, updatedData) => {
    const newReviews = reviews.map(r => r.id === id ? { ...r, ...updatedData } : r);
    setReviews(newReviews);
    if (!supabase) {
        localStorage.setItem('noury_reviews', JSON.stringify(newReviews));
    }
  };

  const deleteReview = async (id) => {
    const newReviews = reviews.filter(r => r.id !== id);
    setReviews(newReviews);
    if (!supabase) {
        localStorage.setItem('noury_reviews', JSON.stringify(newReviews));
    }
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('noury_lang', lang);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const isExist = prev.find(item => item.id === product.id);
      let updated;
      if (isExist) {
        updated = prev.filter(item => item.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      localStorage.setItem('noury_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const addToast = (message, type = 'success') => {
    console.log("addToast function called. message:", message, "type:", type);
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const cartItemId = product.selectedSize
        ? `${product.id}_${product.selectedSize}`
        : product.id;
      const existingItemIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      
      let updated;
      if (existingItemIndex > -1) {
        updated = [...prev];
        updated[existingItemIndex].qty += qty;
      } else {
        updated = [...prev, { 
          ...product, 
          cartItemId, 
          qty
        }];
      }
      localStorage.setItem('noury_cart', JSON.stringify(updated));
      return updated;
    });
    // Show toast
    const sizePart = product.selectedSize ? ` — ${product.selectedSize}` : '';
    addToast(`${product.title}${sizePart}`, 'cart');
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => {
      const updated = prev.filter(item => item.cartItemId !== cartItemId);
      localStorage.setItem('noury_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQty = (cartItemId, newQty) => {
    if (newQty < 1) return;
    setCart(prev => {
      const updated = prev.map(item => 
        item.cartItemId === cartItemId ? { ...item, qty: newQty } : item
      );
      localStorage.setItem('noury_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('noury_cart');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <StoreContext.Provider value={{ 
      language, 
      toggleLanguage, 
      t, 
      isRTL, 
      searchQuery, 
      setSearchQuery,
      products,
      setProducts,
      wishlist,
      toggleWishlist,
      isLoading,
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      reviews,
      isReviewsLoading,
      fetchReviews,
      addReview,
      updateReview,
      deleteReview,
      shippingRates,
      isShippingLoading,
      fetchShippingRates,
      dbConnected,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      toasts,
      addToast,
      removeToast
    }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-sans-arabic' : ''}>
        {children}
      </div>
    </StoreContext.Provider>
  );
};
