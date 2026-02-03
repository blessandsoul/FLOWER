import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plane, Box, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Hero Visual
import { PriceUnlock } from './hero-variants/PriceUnlock';

export const Hero = () => {
    return (
        <section className="relative w-full overflow-hidden bg-background pt-10 pb-20 lg:pt-16 lg:pb-32">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Left Column: Text & CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex flex-col space-y-10"
                    >
                        <div className="space-y-6">
                            <div className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-foreground/80 bg-background">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                                #1 ყვავილების აუქციონი საქართველოში
                            </div>

                            <h1 className="flex flex-col gap-2 text-4xl font-bold tracking-tighter lg:text-6xl xl:text-7xl text-foreground">
                                <span>ყვავილები</span>
                                <span className="text-primary">
                                    პირდაპირ
                                </span>
                                <span>ჰოლანდიიდან</span>
                            </h1>

                            <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                                დაემშვიდობეთ "გადამყიდველებს". მიიღეთ წვდომა მსოფლიოს უდიდეს აუქციონებზე, დაზოგეთ 40%-მდე და მართეთ შეკვეთები ონლაინ.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-xl transition-all hover:scale-[1.02]" asChild>
                                <Link href="/catalog">
                                    დაწყება უფასოდ <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-xl hover:bg-muted" asChild>
                                <Link href="/how-it-works">
                                    როგორ მუშაობს?
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-6 border-t border-border/50 max-w-md">
                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-bold text-foreground">3 დღე</span>
                                <p className="text-sm text-muted-foreground font-medium">ჩამოტანა</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-bold text-foreground">-40%</span>
                                <p className="text-sm text-muted-foreground font-medium">დაზოგვა</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-2xl font-bold text-foreground">100%</span>
                                <p className="text-sm text-muted-foreground font-medium">დაზღვევა</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Visuals */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative mx-auto lg:mr-0 lg:ml-auto w-full max-w-[500px]"
                    >
                        <PriceUnlock />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

