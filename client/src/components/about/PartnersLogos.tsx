'use client';

// Placeholder logos - in prod would use actual SVGs/Images
const partners = [
    { name: 'Royal FloraHolland', color: 'bg-orange-500' },
    { name: 'Plantion', color: 'bg-green-600' },
    { name: 'EuroFlorist', color: 'bg-blue-600' },
    { name: 'Dutch Flower Group', color: 'bg-purple-600' },
    { name: 'VGB', color: 'bg-red-600' },
    { name: 'Florint', color: 'bg-yellow-500' },
];

export const PartnersLogos = () => {
    return (
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="container">
                <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-12">
                    ჩვენი ოფიციალური პარტნიორები
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {partners.map((partner) => (
                        <div key={partner.name} className="flex flex-col items-center justify-center gap-3 group">
                            {/* Logo Placeholder */}
                            <div className={`w-12 h-12 rounded-lg ${partner.color} flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:scale-110 transition-transform`}>
                                {partner.name[0]}
                            </div>
                            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-900 transition-colors text-center">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
