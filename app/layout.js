import { Playfair_Display, Cairo } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import ScrollButton from "@/_Components/ScrollButton";
import Toast from "@/_Components/Toast";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Noury Beauty | مستحضرات التجميل الفاخرة",
    template: "%s | Noury Beauty",
  },
  description: "Noury Beauty — Egyptian luxury cosmetics brand. Shop highlighters, lipsticks, serums, and more. اكتشفي منتجات نوري بيوتي الفاخرة.",
  keywords: ["Noury Beauty", "نوري بيوتي", "Egyptian cosmetics", "highlighter", "lipstick", "beauty Egypt", "مستحضرات تجميل"],
  metadataBase: new URL('https://nourybeauty.com'),
  openGraph: {
    title: "Noury Beauty | مستحضرات التجميل الفاخرة",
    description: "Egyptian luxury cosmetics — Shop highlighters, lipsticks, serums & more.",
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
    siteName: "Noury Beauty",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noury Beauty",
    description: "Egyptian luxury cosmetics brand",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Preconnect to external resources for faster loading
export const links = [
  { rel: 'preconnect', href: 'https://kjillmgoweoixvculqqh.supabase.co' },
  { rel: 'preconnect', href: 'https://images.unsplash.com' },
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <StoreProvider>
          {children}
          <ScrollButton />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
