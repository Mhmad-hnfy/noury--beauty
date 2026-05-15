import { Playfair_Display, Cairo } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import ScrollButton from "@/_Components/ScrollButton";

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
  title: "Noury Beauty",
  description: "Best beauty products in Egypt",
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
        </StoreProvider>
      </body>
    </html>
  );
}
