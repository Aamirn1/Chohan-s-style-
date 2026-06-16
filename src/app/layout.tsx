import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Chohan's Style Hub – Premium Hair Salon & Beauty Academy",
  description: "Chohan's Style Hub – Multi-branch hair salon offering men's & women's services, bridal makeup, mehndi designs, and professional beauty courses. Book your appointment today!",
  keywords: ["hair salon", "bridal makeup", "mehndi designs", "beauty courses", "men's salon", "women's salon", "Chohan's Style Hub", "hair styling", "Pakistan salon"],
  authors: [{ name: "Chohan's Style Hub" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Chohan's Style Hub – Premium Hair Salon & Beauty Academy",
    description: "Multi-branch hair salon with men's & women's services, bridal packages, and professional courses.",
    siteName: "Chohan's Style Hub",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
