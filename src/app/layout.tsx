import type { Metadata, Viewport } from "next";
import { Inter, Amiri, Noto_Sans_Malayalam } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: 'swap'
});

const malayalam = Noto_Sans_Malayalam({
  weight: ["400", "600"],
  subsets: ["malayalam"],
  variable: "--font-malayalam",
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://salafimadrasaportal.vercel.app"),
  title: "Salafi Madrasa Attanikkal - Learning Portal",
  description: "Dynamic learning portal for Salafi Madrasa Attanikkal students to test and build their Quran recitation and memorization skills.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quran Game",
  },
  openGraph: {
    title: "Salafi Madrasa Attanikkal - Learning Portal",
    description: "Dynamic learning portal for Salafi Madrasa Attanikkal students to test and build their Quran recitation and memorization skills.",
    url: "/",
    siteName: "Salafi Madrasa Attanikkal Quran Challenge",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Salafi Madrasa Attanikkal Quran Challenge App Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Salafi Madrasa Attanikkal - Learning Portal",
    description: "Dynamic learning portal for Salafi Madrasa Attanikkal students to test and build their Quran recitation and memorization skills.",
    images: ["/favicon.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#052e16", // emerald-950
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  let profile = null;

  if (token) {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        profile = await res.json();
      }
    } catch (err) {
      console.error("Failed to fetch user in layout", err);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${amiri.variable} ${malayalam.variable} antialiased font-sans flex flex-col min-h-screen bg-background text-foreground`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill-rule='evenodd' stroke='%2310b981' stroke-width='1' stroke-opacity='0.05' fill='none'%3E%3Cpolygon points='40,0 48,32 80,40 48,48 40,80 32,48 0,40 32,32' /%3E%3Cpolygon points='10,10 40,30 70,10 50,40 70,70 40,50 10,70 30,40' /%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar user={profile} />

          <main className="flex-1 flex flex-col">
            {children}
          </main>

          <Toaster />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
