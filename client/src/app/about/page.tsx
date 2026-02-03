import { AboutHero } from '@/components/about/AboutHero';
import { PartnersLogos } from '@/components/about/PartnersLogos';
import { TeamGrid } from '@/components/about/TeamGrid';
import { Timeline } from '@/components/about/Timeline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Florca',
    description: 'Connecting Georgian florists with Dutch flower auctions. Learn about our history, team, and logistics network.',
};

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <AboutHero />
            <Timeline />
            <TeamGrid />
            <PartnersLogos />
        </div>
    );
}
