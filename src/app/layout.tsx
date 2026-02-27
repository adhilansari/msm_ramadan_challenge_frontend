import type { Metadata, Viewport } from "next";
import { Inter, Amiri, Noto_Sans_Malayalam } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

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
  title: "Surah Mulk Challenge",
  description: "Gamified word-ordering challenge to test your memory of Surah Al-Mulk.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mulk Game",
  },
};

export const viewport: Viewport = {
  themeColor: "#052e16", // emerald-950
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Image src="/msm-challenge-logo.png" alt="MSM Sura Al-Mulk Challenge Logo" width={32} height={32} className="w-8 h-8 rounded-full" />
                <Link href="/">
                  <span className="font-bold text-lg tracking-tight text-emerald-500 hidden sm:inline-block">Surah Mulk Challenge</span>
                </Link>
                <Link href="/">
                  <span className="font-bold text-lg tracking-tight text-emerald-500 sm:hidden">SMC</span></Link>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>
          </header>

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
