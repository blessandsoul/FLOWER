'use client';

import { motion } from 'framer-motion';
import { Users, Truck, ShieldCheck, Star } from 'lucide-react';

const stats = [
    { icon: Users, value: '500+', label: 'პარტნიორი მაღაზია' },
    { icon: Truck, value: '48სთ', label: 'სწრაფ ტრანსპორტირება' },
    { icon: ShieldCheck, value: '100%', label: 'ხარისხის გარანტია' },
    { icon: Star, value: '4.9/5', label: 'მომხმარებლის შეფასება' },
];

export function TrustStats() {
    return (
        <section className="py-12 bg-muted/30 border-y">
            <div className="container px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center text-center space-y-2 group hover:transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="p-3 bg-white rounded-full shadow-sm mb-2">
                                <stat.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                            <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
