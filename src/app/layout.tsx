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
  keywords: ["hair salon", "bridal makeup", "mehndi designs", "beauty courses", "men's salon", "women's salon", "Chohan's Style Hub", "hair styling", "Pakistan salon", "Lahore salon"],
  authors: [{ name: "Chohan's Style Hub" }],
  metadataBase: new URL("https://chohans-style-hub.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Chohan's Style Hub – Premium Hair Salon & Beauty Academy",
    description: "Multi-branch hair salon with men's & women's services, bridal packages, mehndi artistry, and professional beauty courses. Book your appointment today!",
    siteName: "Chohan's Style Hub",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1344,
        height: 768,
        alt: "Chohan's Style Hub – Premium Hair Salon & Beauty Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chohan's Style Hub – Premium Hair Salon & Beauty Academy",
    description: "Multi-branch hair salon with men's & women's services, bridal packages, and professional beauty courses.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HairSalon",
              name: "Chohan's Style Hub",
              description: "Premium multi-branch hair salon and beauty academy offering men's & women's services, bridal makeup, mehndi designs, and professional beauty courses.",
              image: "/og-image.png",
              telephone: "+923205719979",
              priceRange: "$$",
              address: [
                {
                  "@type": "PostalAddress",
                  streetAddress: "123 Main Boulevard, Gulberg III",
                  addressLocality: "Lahore",
                  addressCountry: "PK",
                },
                {
                  "@type": "PostalAddress",
                  streetAddress: "45 Y Block, DHA Phase 5",
                  addressLocality: "Lahore",
                  addressCountry: "PK",
                },
              ],
              openingHours: "Mo-Su 09:00-22:00",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "15000",
              },
            }),
          }}
        />
      </head>
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
