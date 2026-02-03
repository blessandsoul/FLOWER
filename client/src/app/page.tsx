'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Components
import { AuctionTicker } from '@/components/home/AuctionTicker';
import { TrustStats } from '@/components/home/TrustStats';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { SavingsCalculator } from '@/components/home/SavingsCalculator';
import { CountdownTimer } from '@/components/home/CountdownTimer';
import { PartnerLogos } from '@/components/home/PartnerLogos';
import { FAQ } from '@/components/home/FAQ';
import { Hero } from '@/components/home/Hero';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                name: 'Florca',
                url: 'https://tourismgeorgia.com',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://tourismgeorgia.com/catalog?q={search_term_string}'
                  },
                  'query-input': 'required name=search_term_string'
                }
              },
              {
                '@type': 'Service',
                name: 'ყვავილების საბითუმო აუქციონი',
                provider: {
                  '@type': 'Organization',
                  name: 'Florca'
                },
                areaServed: {
                  '@type': 'Country',
                  name: 'Georgia'
                },
                description: 'პირდაპირი წვდომა ჰოლანდიურ აუქციონებზე. დაზოგეთ 40%-მდე საბითუმო შესყიდვებზე.',
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'GEL',
                  price: '0',
                  description: 'უფასო რეგისტრაცია და წვდომა კატალოგზე'
                }
              },
              {
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'როდის მივიღებ ყვავილებს?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'შეკვეთის დახურვიდან 48 საათში. ჩვეულებრივ, პარასკევს საღამოს გამოგზავნილი შეკვეთა კვირას დილით თბილისშია.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'როგორ ხდება ანგარიშსწორება?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'ანგარიშსწორება ხდება ინვოისის საფუძველზე, საბანკო გადარიცხვით (GEL). VIP კლიენტებისთვის მოქმედებს გადავადებული გადახდა.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'რა არის მინიმალური შეკვეთა?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'მინიმალური შეკვეთა არ არის შეზღუდული. შეგიძლიათ შეიძინოთ თუნდაც 10 ცალი ვარდი ჩვენი ჯგუფური შესყიდვის სისტემით.'
                    }
                  },
                  {
                    '@type': 'Question',
                    name: 'გვაქვს თუ არა გარანტია?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'დიახ, ყველა ყვავილი შემოწმდება აუქციონზე და ტრანსპორტირების წინ. წუნის შემთხვევაში თანხა გინაზღაურდებათ.'
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
      {/* 1. Ticker */}
      <AuctionTicker />

      {/* Hero Section */}
      <Hero />

      {/* 3. Category Grid - Promoted to follow Hero directly */}
      <CategoryGrid />

      {/* 4. How It Works */}
      <HowItWorks />


      {/* 5. Countdown Timer */}
      <CountdownTimer />

      {/* 6. Featured Carousel */}
      <FeaturedCarousel />

      {/* 7. Savings Calculator */}
      <SavingsCalculator />

      {/* 8. FAQ */}
      <FAQ />

      {/* 9. Partner Logos */}
      <PartnerLogos />
    </div>
  );
}
