import { MetadataRoute } from 'next';
import { APP_NAME } from '@/lib/constants/app.constants';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Florca - ყვავილების აუქციონი',
        short_name: 'Florca',
        description: 'საბითუმო ყვავილები პირდაპირ ჰოლანდიიდან. დაზოგეთ 40%-მდე.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
