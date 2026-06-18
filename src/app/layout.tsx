import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
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

// Dynamically determine the site URL from the incoming request headers.
// Works in sandbox, Vercel preview, and production — no hardcoded URL needed.
async function getSiteUrl(): Promise<URL> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return new URL(`${protocol}://${host}`);
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getSiteUrl();
  return {
    title: "Chohan's Style Hub – Premium Salon & Academy",
    description: "Premium multi-branch hair salon: bridal makeup, mehndi, men's & women's styling. Book your appointment today!",
    keywords: ["hair salon", "bridal makeup", "mehndi designs", "beauty courses", "men's salon", "women's salon", "Chohan's Style Hub", "hair styling", "Pakistan salon", "Lahore salon"],
    authors: [{ name: "Chohan's Style Hub" }],
    metadataBase: siteUrl,
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Chohan's Style Hub – Premium Salon & Academy",
      description: "Premium hair salon: bridal makeup, mehndi, men's & women's styling. Book now!",
      siteName: "Chohan's Style Hub",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Chohan's Style Hub – Premium Hair Salon & Beauty Academy",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Chohan's Style Hub – Premium Salon & Academy",
      description: "Premium hair salon: bridal makeup, mehndi, men's & women's styling. Book now!",
      images: ["/og-image.png"],
    },
  };
}

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
