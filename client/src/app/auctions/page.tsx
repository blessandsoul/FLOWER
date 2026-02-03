import { AuctionHero } from '@/components/auctions/AuctionHero';
import { AuctionSchedule } from '@/components/auctions/AuctionSchedule';
import { BiddingGuide } from '@/components/auctions/BiddingGuide';
import { LiveTicker } from '@/components/auctions/LiveTicker';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Live Auctions | Florca',
    description: 'Join live flower auctions directly from Holland. Bid in real-time on premium roses, tulips, and more.',
};

export default function AuctionsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <AuctionHero />
            <LiveTicker />
            <BiddingGuide />
            <AuctionSchedule />
        </div>
    );
}
