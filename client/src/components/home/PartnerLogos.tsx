'use client';

import { motion } from 'framer-motion';

// Using simple text placeholders for logos to avoid external image deps for now
const partners = ["გარდენია", "ფლაუერ ლაბი", "უცხოური ბაღი", "თბილისი ფლორა", "ბლუმი", "მწვანე სივრცე"];

export function PartnerLogos() {
    return (
        <section className="py-12 border-t">
            <div className="container px-4 text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8 font-medium">
                    ენდობა 500+ წამყვანი ფლორისტი საქართველოში
                </p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {partners.map((partner, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.1, opacity: 1 }}
                            className="text-xl font-bold font-serif text-slate-800"
                        >
                            {partner}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
