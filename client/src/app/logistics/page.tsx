import { LogisticsHero } from '@/components/logistics/LogisticsHero';
import { RouteMap } from '@/components/logistics/RouteMap';
import { ShippingCalculator } from '@/components/logistics/ShippingCalculator';
import { WarehouseInfo } from '@/components/logistics/WarehouseInfo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Logistics & Shipping | Florca',
    description: 'Fast and secure flower delivery from Holland to Georgia. 100% cold chain protection.',
};

export default function LogisticsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <LogisticsHero />
            <RouteMap />
            <WarehouseInfo />
            <ShippingCalculator />
        </div>
    );
}
