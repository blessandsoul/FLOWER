'use client';

const milestones = [
    { year: '2005', title: 'დაარსება', description: 'პირველი ყვავილების მაღაზია თბილისის ცენტრში.' },
    { year: '2012', title: 'ექსპანსია', description: 'პირდაპირი კონტაქტების დამყარება ჰოლანდიელ ფერმერებთან.' },
    { year: '2019', title: 'ლოგისტიკა', description: 'საკუთარი სატრანსპორტო ქსელის შექმნა ევროპაში.' },
    { year: '2023', title: 'ციფრული ერა', description: 'Florca.ge პლატფორმის გაშვება და ონლაინ აუქციონები.' },
];

export const Timeline = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">განვითარების გზა</h2>
                    <p className="text-muted-foreground">მცირე ოჯახური ბიზნესიდან ტექნოლოგიურ ლიდერამდე</p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-slate-200" />

                    <div className="space-y-12">
                        {milestones.map((item, index) => (
                            <div key={item.year} className={`relative flex items-center justify-between ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                                {/* Empty space for alignment */}
                                <div className="w-5/12" />

                                {/* Connector Dot */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-primary shadow-sm z-10 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                </div>

                                {/* Content Card */}
                                <div className="w-5/12">
                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                                        <span className="text-2xl font-bold text-primary block mb-2">{item.year}</span>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-600">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
