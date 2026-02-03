'use client';

import { CheckCircle2, Truck, Clock, ShieldCheck } from 'lucide-react';

export const LogisticsHero = () => {
    return (
        <section className="relative w-full bg-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            <div className="container relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <Truck className="mr-2 h-4 w-4" />
                    პირდაპირი რეისები კვირაში 2-ჯერ
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6 leading-tight">
                    ჰოლანდიიდან თბილისამდე
                    <span className="block text-primary mt-2">72 საათში</span>
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-10 leading-relaxed">
                    ჩვენ უზრუნველვყოფთ ყვავილების უსაფრთხო და სწრაფ ტრანსპორტირებას სრული ტემპერატურული რეჟიმის დაცვით.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-4">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">სწრაფად</h3>
                        <p className="text-slate-500 text-sm">გამოსვლა ორშაბათს, ჩამოსვლა ოთხშაბათს.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">დაცულად</h3>
                        <p className="text-slate-500 text-sm">100% დაზღვევა და ტემპერატურის კონტროლი.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">მარტივად</h3>
                        <p className="text-slate-500 text-sm">სრული საბაჟო და დოკუმენტური მომსახურება.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
