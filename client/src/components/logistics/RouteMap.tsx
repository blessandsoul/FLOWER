'use client';

import { MapPin, ArrowRight } from 'lucide-react';

export const RouteMap = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">logistics route</h2>
                <p className="text-lg text-muted-foreground">ამსტერდამიდან თბილისამდე - გარანტირებული 72 საათი</p>
            </div>

            <div className="max-w-5xl mx-auto">
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
                    {/* Connecting Line (Mobile: Hidden, Desktop: Visible) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2">
                        <div className="absolute top-0 left-0 h-full bg-primary/20 w-full animate-pulse" />
                    </div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center bg-white p-4">
                        <div className="w-16 h-16 rounded-full bg-blue-50 border-4 border-white shadow-lg flex items-center justify-center text-blue-600 mb-4 z-10">
                            <span className="font-bold text-lg">NL</span>
                        </div>
                        <h3 className="text-lg font-bold">ამსტერდამი</h3>
                        <p className="text-sm text-slate-500 font-medium">გამოსვლა: ორშაბათი</p>
                        <p className="text-xs text-slate-400 mt-1">Royal FloraHolland</p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center bg-white p-4">
                        <div className="w-12 h-12 rounded-full bg-slate-50 border-4 border-white shadow flex items-center justify-center text-slate-400 mb-4 z-10">
                            <ArrowRight className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest">ტრანზიტი</h3>
                        <p className="text-xs text-slate-400 mt-1">3,500 კმ</p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center bg-white p-4">
                        <div className="w-16 h-16 rounded-full bg-green-50 border-4 border-white shadow-lg flex items-center justify-center text-green-600 mb-4 z-10">
                            <span className="font-bold text-lg">GE</span>
                        </div>
                        <h3 className="text-lg font-bold">თბილისი</h3>
                        <p className="text-sm text-slate-500 font-medium">ჩამოსვლა: ოთხშაბათი</p>
                        <p className="text-xs text-slate-400 mt-1">Florca Warehouse</p>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-6 bg-slate-50 rounded-xl">
                        <div className="text-3xl font-bold text-primary mb-1">100%</div>
                        <div className="text-sm font-medium text-slate-600">დაზღვევა</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-xl">
                        <div className="text-3xl font-bold text-primary mb-1 pl-2">2-4<span className="text-lg">°C</span></div>
                        <div className="text-sm font-medium text-slate-600">ტემპერატურა</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-xl">
                        <div className="text-3xl font-bold text-primary mb-1">GPS</div>
                        <div className="text-sm font-medium text-slate-600">მონიტორინგი</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
