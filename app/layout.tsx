import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Analytics from "@/components/Analytics";
import { KitBuilderProvider } from "@/context/KitBuilderContext";
import { ToastProvider } from "@/components/kit-builder/Toast";
import { FloatingBuilderBar, KitDrawer } from "@/components/kit-builder";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Sozo | Infraestructura de Swag y Merch Corporativo",
  description: "Diseña, produce y almacena kits de bienvenida y regalos corporativos. Logística on-demand desde CDMX.",
  keywords: [
    "swag corporativo",
    "merch empresarial",
    "kits de bienvenida",
    "regalos corporativos",
    "onboarding kits",
    "promotional products mexico",
    "serigrafía",
    "bordado corporativo",
    "impresión 3D",
    "grabado láser",
  ],
  authors: [{ name: "Sozo Inc" }],
  creator: "Sozo Inc",
  publisher: "Sozo Inc",
  metadataBase: new URL("https://sozo.mx"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://sozo.mx",
    siteName: "Sozo Corporate Labs",
    title: "Sozo | Infraestructura de Swag y Merch Corporativo",
    description: "Diseña, produce y almacena kits de bienvenida y regalos corporativos. Logística on-demand desde CDMX.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sozo - Manufactura Híbrida de Swag Corporativo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sozo | Infraestructura de Swag y Merch Corporativo",
    description: "Diseña, produce y almacena kits de bienvenida y regalos corporativos. Logística on-demand desde CDMX.",
    images: ["/og-image.jpg"],
    creator: "@sozo_mx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <Analytics />
        <KitBuilderProvider>
          <ToastProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <FloatingBuilderBar />
            <KitDrawer />
          </ToastProvider>
        </KitBuilderProvider>
      </body>
    </html>
  );
}
