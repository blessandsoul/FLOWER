'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        name: 'ვარდები',
        image: '/images/cat-roses.png',
        count: '120+ სახეობა',
        slug: 'roses',
        size: 'lg'
    },
    {
        name: 'ტიტები',
        image: '/images/cat-tulips.png',
        count: '50+ სახეობა',
        slug: 'tulips',
        size: 'sm'
    },
    {
        name: 'პიონები',
        image: '/images/cat-peonies.png',
        count: '30+ სახეობა',
        slug: 'peonies',
        size: 'sm'
    },
    {
        name: 'მწვანე',
        image: '/images/cat-greenery.png',
        count: '80+ სახეობა',
        slug: 'greenery',
        size: 'md'
    },
];

export function CategoryGrid() {
    return (
        <section className="py-16 container px-4">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">პოპულარული კატეგორიები</h2>
                    <p className="text-muted-foreground mt-2">აღმოაჩინეთ სეზონის საუკეთესო ყვავილები</p>
                </div>
                <Link href="/catalog" className="text-primary font-medium hover:underline flex items-center">
                    ყველას ნახვა <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[600px] auto-rows-[280px] md:auto-rows-auto">
                {/* Main Feature - Roses */}
                <Link href="/catalog?cat=roses" className="group relative col-span-1 md:col-span-2 row-span-2 overflow-hidden rounded-3xl">
                    <Image
                        src={categories[0].image}
                        alt={categories[0].name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                        <span className="text-white/80 text-sm font-medium mb-2 block">{categories[0].count}</span>
                        <h3 className="text-white text-4xl font-bold">{categories[0].name}</h3>
                    </div>
                </Link>

                {/* Tulips */}
                <Link href="/catalog?cat=tulips" className="group relative col-span-1 row-span-1 overflow-hidden rounded-3xl">
                    <Image
                        src={categories[1].image}
                        alt={categories[1].name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-white text-xl font-bold">{categories[1].name}</h3>
                        <span className="text-white/70 text-xs">{categories[1].count}</span>
                    </div>
                </Link>

                {/* Peonies */}
                <Link href="/catalog?cat=peonies" className="group relative col-span-1 row-span-1 overflow-hidden rounded-3xl">
                    <Image
                        src={categories[2].image}
                        alt={categories[2].name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-white text-xl font-bold">{categories[2].name}</h3>
                        <span className="text-white/70 text-xs">{categories[2].count}</span>
                    </div>
                </Link>

                {/* Greenery - Wide */}
                <Link href="/catalog?cat=greenery" className="group relative col-span-1 md:col-span-2 row-span-1 overflow-hidden rounded-3xl">
                    <Image
                        src={categories[3].image}
                        alt={categories[3].name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 flex justify-between items-end w-full">
                        <div>
                            <h3 className="text-white text-2xl font-bold">{categories[3].name}</h3>
                            <span className="text-white/70 text-sm">{categories[3].count}</span>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
