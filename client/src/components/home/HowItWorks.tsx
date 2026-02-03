'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, UserPlus, Truck, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        title: 'შეკვეთა',
        desc: 'აირჩიეთ ყვავილები კატალოგიდან და დაამატეთ კალათაში.',
    },
    {
        icon: ShoppingCart,
        title: 'ჯგუფური შესყიდვა',
        desc: 'ჩვენ ვაერთიანებთ შეკვეთებს და ვყიდულობთ აუქციონზე.',
    },
    {
        icon: Truck,
        title: 'ტრანსპორტირება',
        desc: 'სწრაფი ლოჯისტიკა სპეციალური მაცივრებით.',
    },
    {
        icon: CheckCircle,
        title: 'მიღება',
        desc: 'მიიღეთ ახალი ყვავილები თქვენს მისამართზე.',
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-4">როგორ მუშაობს Florca?</h2>
                <p className="text-muted-foreground mb-16 max-w-2xl mx-auto">
                    მარტივი პროცესი შეკვეთიდან მიღებამდე. ჩვენ ვზრუნავთ ყველა დეტალზე.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connector Line (Hidden on Mobile) */}
                    <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -z-10" />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center relative bg-slate-50"
                        >
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-slate-50 z-10">
                                <step.icon className="h-10 w-10 text-primary" />
                            </div>
                            <div className="absolute top-0 right-0 -mr-4 text-6xl font-black text-slate-200 -z-20 opacity-50 select-none">
                                0{idx + 1}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm px-4">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
