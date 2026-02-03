'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function SavingsCalculator() {
    const [spend, setSpend] = useState([2000]); // Monthly spend in GEL
    const [formattedSavings, setFormattedSavings] = useState('');
    const [formattedSpend, setFormattedSpend] = useState('');

    // Assumption: Florca saves ~30% compared to local wholesalers
    const yearlySavings = (spend[0] * 0.30) * 12;

    useEffect(() => {
        setFormattedSavings(yearlySavings.toLocaleString('ka-GE', { style: 'currency', currency: 'GEL', maximumFractionDigits: 0 }));
        setFormattedSpend(spend[0].toLocaleString());
    }, [yearlySavings, spend]);

    if (!formattedSavings) return null; // Avoid render until hydrated

    return (
        <section className="py-24 container px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        გამოთვალეთ თქვენი ეკონომია
                    </h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        ნახეთ რამდენის დაზოგვა შეგიძლიათ Florca-სთან ერთად პირდაპირი ტარიფებით.
                    </p>

                    <Card className="border-2 border-primary/10 shadow-lg">
                        <CardContent className="p-8">
                            <div className="mb-8">
                                <label className="text-sm font-medium text-muted-foreground mb-4 block">
                                    ყოველთვიური შესყიდვები
                                </label>
                                <div className="text-4xl font-bold text-slate-900 mb-6">
                                    {formattedSpend} ₾
                                </div>
                                <Slider
                                    value={spend}
                                    onValueChange={setSpend}
                                    max={20000}
                                    step={100}
                                    className="py-4"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>500 ₾</span>
                                    <span>20,000 ₾+</span>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
                                <p className="text-green-600 font-medium mb-1">წლიური დანაზოგი</p>
                                <motion.div
                                    key={yearlySavings}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl font-black text-green-700"
                                >
                                    {formattedSavings}
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6 lg:pl-10">
                    <h3 className="text-xl font-bold">რატომ არის ჩვენი ფასი დაბალი?</h3>
                    <ul className="space-y-4">
                        {[
                            "არანაირი ფარული გადასახადი",
                            "პირდაპირი წვდომა აუქციონზე",
                            "ოპტიმიზირებული ლოჯისტიკა",
                            "ჯგუფური შესყიდვის ძალა"
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <span className="text-green-600 text-xs font-bold">✓</span>
                                </div>
                                <span className="font-medium text-slate-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <Button size="lg" className="mt-6" asChild>
                        <Link href="/register">
                            დაიწყეთ დაზოგვა <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
