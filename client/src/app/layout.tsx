import type { Metadata } from 'next';
import { Noto_Sans_Georgian } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/Footer';
import { Agentation } from 'agentation';
import { Providers } from './providers';

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian', 'latin'],
  variable: '--font-georgian',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tourismgeorgia.com'),
  title: {
    default: 'Florca - საბითუმო ყვავილები პირდაპირ ჰოლანდიიდან',
    template: '%s | Florca',
  },
  description: 'დაზოგეთ 40%-მდე ყვავილების შესყიდვაზე. მიიღეთ პირდაპირი წვდომა მსოფლიოს უდიდეს ჰოლანდიურ აუქციონებზე, ტრანსპორტირება და 100% დაზღვევა.',
  keywords: ['ყვავილები', 'საბითუმო', 'ჰოლანდია', 'აუქციონი', 'ვარდები', 'ტიტები', 'ფლორისტიკა', 'florca', 'yvavilebi'],
  authors: [{ name: 'Florca Team' }],
  creator: 'Florca',
  publisher: 'Florca',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ka_GE',
    url: 'https://tourismgeorgia.com',
    title: 'Florca - საბითუმო ყვავილები პირდაპირ ჰოლანდიიდან',
    description: 'დაზოგეთ 40%-მდე ყვავილების შესყიდვაზე. პირდაპირი წვდომა ჰოლანდიურ აუქციონებზე.',
    siteName: 'Florca',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Florca - Flower Auction Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Florca - საბითუმო ყვავილები',
    description: 'დაზოგეთ 40%-მდე ყვავილების შესყიდვაზე. პირდაპირი წვდომა ჰოლანდიურ აუქციონებზე.',
    images: ['/og-image.jpg'],
    creator: '@florca',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Florca',
  url: 'https://tourismgeorgia.com',
  logo: 'https://tourismgeorgia.com/logo.png',
  description: 'საბითუმო ყვავილები პირდაპირ ჰოლანდიიდან. 100% დაზღვევა და სწრაფი ტრანსპორტირება.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tbilisi',
    addressCountry: 'GE'
  },
  sameAs: [
    'https://facebook.com/florca',
    'https://instagram.com/florca'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+995-555-00-00-00',
    contactType: 'customer service',
    areaServed: 'GE',
    availableLanguage: ['ka', 'en']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body className={`${notoSansGeorgian.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="min-h-screen bg-muted/40 pb-20">
            {children}
          </main>
          <Footer />
          <Agentation />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
