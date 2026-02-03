'use client';

import { User } from 'lucide-react';

const team = [
    { name: 'გიორგი ბერიძე', role: 'დამფუძნებელი & CEO', image: null },
    { name: 'ანა მაისურაძე', role: 'მთავარი ფლორისტი', image: null },
    { name: 'დავით კვარაცხელია', role: 'ლოგისტიკის მენეჯერი', image: null },
    { name: 'მარიამ ნინიძე', role: 'გაყიდვების დეპარტამენტი', image: null },
];

export const TeamGrid = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">ჩვენი გუნდი</h2>
                    <p className="text-muted-foreground">ადამიანები, რომლებიც ზრუნავენ თქვენს ბიზნესზე</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {team.map((member) => (
                        <div key={member.name} className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all text-center">
                            <div className="mx-auto w-32 h-32 rounded-full overflow-hidden mb-4 bg-slate-100 flex items-center justify-center border-4 border-white shadow-sm group-hover:scale-105 transition-transform">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="h-12 w-12 text-slate-300" />
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                            <p className="text-sm text-primary font-medium mb-4">{member.role}</p>

                            {/* Social/Contact Placeholder */}
                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
