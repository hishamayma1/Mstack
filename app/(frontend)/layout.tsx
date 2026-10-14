import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StoreHydrator } from '@/components/providers/store-hydrator'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

// Only Geist — the body and headline face — is preloaded. The other three
// are used for code, labels and below-the-fold sections; preloading them put
// ~75 KB of High-priority font downloads in front of every page's LCP image
// on mobile. They still load the moment a page uses them, with `swap` and
// next/font's metric-matched fallback so the swap doesn't shift layout.
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });
const courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-courier-prime", display: "swap", preload: false });
const ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"], variable: "--font-ibm-plex-sans", display: "swap", preload: false });

export const metadata: Metadata = {
  title: 'MStack360 - Expert Microsoft 365 Solutions | Security, SharePoint, Power Platform',
  description: 'Expert Microsoft 365 consulting: security hardening, SharePoint setup, Power Platform automation & managed IT support.',
  keywords: ['Microsoft 365 consulting', 'SharePoint', 'Power Platform', 'Microsoft 365 security', 'Zero Trust', 'managed IT support'],
  authors: [{ name: 'MStack360' }],
  openGraph: {
    title: 'MStack360 - Expert Microsoft 365 Solutions',
    description: 'Expert Microsoft 365 consulting: security hardening, SharePoint setup, Power Platform automation & managed IT support.',
    type: 'website',
    url: 'https://mstack360.com',
    siteName: 'MStack360',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MStack360 - Expert Microsoft 365 Solutions',
    description: 'Expert Microsoft 365 consulting: security hardening, SharePoint setup, Power Platform automation & managed IT support.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${courierPrime.variable} ${ibmPlexSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <StoreHydrator />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
