'use client';

import { Button } from '@/components/ui/button';
import { Gavel, Timer } from 'lucide-react';
import Link from 'next/link';

export const AuctionHero = () => {
    return (
        <section className="relative w-full bg-slate-900 overflow-hidden py-24 md:py-32">
            <div className="absolute inset-0 bg-[url('/flower-auction-bg.jpg')] bg-cover bg-center opacity-20" />
            <div className="container relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 inline-flex items-center rounded-full bg-red-600/10 px-3 py-1 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-600/20">
                    <span className="mr-2 relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    LIVE ახლა
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6">
                    <span className="block text-primary">FloraHolland</span>
                    პირდაპირი აუქციონი
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-slate-300 mb-8">
                    მიიღეთ წვდომა მსოფლიოს უდიდეს ყვავილების აუქციონზე რეალურ დროში.
                    შეიძინეთ ვარდები, ტიტები და სხვა ექსკლუზიური მცენარეები საბითუმო ფასად.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white min-w-[200px] h-14 text-lg">
                        <Gavel className="mr-2 h-5 w-5" />
                        ბიდის განთავსება
                    </Button>
                    <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 min-w-[200px] h-14 text-lg">
                        <Timer className="mr-2 h-5 w-5" />
                        განრიგი
                    </Button>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 text-white/80">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">125+</span>
                        <span className="text-sm">აქტიური ლოტი</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">40%</span>
                        <span className="text-sm">საშ. დანაზოგი</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">24სთ</span>
                        <span className="text-sm">მიწოდება</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">100%</span>
                        <span className="text-sm">გარანტია</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
