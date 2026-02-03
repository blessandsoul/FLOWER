'use client';

import { motion } from 'framer-motion';
import { Lock, Unlock, Check, Sparkles, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const PriceUnlock = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);

    return (
        <div className="relative w-full max-w-md mx-auto perspective-1000">
            <motion.div
                className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
                initial={{ rotateX: 2 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Product Image Background */}
                <div className="relative h-64 w-full bg-muted">
                    <Image
                        src="/images/red-naomi.png"
                        alt="Red Naomi Rose"
                        fill
                        className="object-cover opacity-90 grayscale-[10%] hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                    {/* Minimal Badge */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-white/80" />
                        Premium
                    </div>
                </div>

                <div className="relative -mt-12 px-6 pb-8 space-y-6">
                    {/* Header */}
                    <div className="text-foreground">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight">Red Naomi</h3>
                                <p className="text-muted-foreground font-medium text-sm">80სმ • 100 ცალი</p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">წარმომავლობა</span>
                                <span className="font-semibold text-sm">ჰოლანდია</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-background rounded-2xl p-5 shadow-sm space-y-5 border border-border">
                        {/* Market Price */}
                        <div className="flex justify-between items-center pb-4 border-b border-border/50">
                            <span className="text-muted-foreground text-sm font-medium">საცალო ფასი</span>
                            <span className="text-lg font-semibold text-muted-foreground line-through decoration-muted-foreground/50">₾450</span>
                        </div>

                        {/* Florca Price Interaction */}
                        <div className="relative">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                        <TrendingDown className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold text-base text-foreground">აუქციონის ფასი</span>
                                </div>

                                <div className="text-right">
                                    {isUnlocked ? (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0, filter: 'blur(4px)' }}
                                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                                            className="text-3xl font-bold text-primary tracking-tight"
                                        >
                                            ₾280
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setIsUnlocked(true)}
                                            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold shadow-sm flex items-center gap-2 text-sm transition-all"
                                        >
                                            <Unlock className="w-4 h-4" />
                                            ფასის ნახვა
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Savings Notification */}
                    <motion.div
                        initial={false}
                        animate={{
                            height: isUnlocked ? 'auto' : 0,
                            opacity: isUnlocked ? 1 : 0,
                            marginTop: isUnlocked ? 20 : 0
                        }}
                        className="overflow-hidden"
                    >
                        <div className="bg-zinc-900 text-white p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-1.5 rounded-full">
                                    <Check className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">თქვენ ზოგავთ ₾170</p>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-bold text-white hover:bg-white/10 hover:text-white">
                                ყიდვა &rarr;
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.div >
        </div >
    );
};
