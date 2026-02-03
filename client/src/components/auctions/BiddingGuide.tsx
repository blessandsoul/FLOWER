'use client';

import { UserPlus, MonitorPlay, Truck } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        title: 'რეგისტრაცია',
        description: 'გაიარეთ ავტორიზაცია და დაადასტურეთ თქვენი ბიზნეს სტატუსი წვდომის მისაღებად.',
    },
    {
        icon: MonitorPlay,
        title: 'მონაწილეობა',
        description: 'უყურეთ ლაივ აუქციონს, შეარჩიეთ სასურველი ლოტები და განათავსეთ ბიდი რეალურ დროში.',
    },
    {
        icon: Truck,
        title: 'ტრანსპორტირება',
        description: 'მოგებულ ლოტებს ჩვენი ლოგისტიკის გუნდი დაუყოვნებლივ ამზადებს საქართველოსკენ გამოსაგზავნად.',
    },
];

export const BiddingGuide = () => {
    return (
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">როგორ მუშაობს?</h2>
                    <p className="text-muted-foreground">3 მარტივი ნაბიჯი აუქციონში მონაწილეობისთვის</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="relative mb-6">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm transition-all group-hover:border-primary group-hover:shadow-md">
                                    <step.icon className="h-10 w-10 text-primary" />
                                </div>
                                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-bold shadow-lg">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground max-w-xs">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
