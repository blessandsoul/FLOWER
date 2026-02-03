'use client';

import { useState } from 'react';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CatalogPage() {
    const [filter, setFilter] = useState('');

    const filteredProducts = MOCK_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.category.toLowerCase().includes(filter.toLowerCase())
    );

    const handleAddToCart = (name: string, qty: number) => {
        // Ideally use Sonner toast here
        console.log(`Added ${qty} of ${name}`);
    };

    return (
        <div className="container py-8 px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">კვირის აუქციონის კატალოგი</h1>
                    <p className="text-muted-foreground mt-2">
                        შეუკვეთეთ ერთად, დაზოგეთ ერთად. შემდეგი ტრანსპორტირება <span className="text-primary font-bold">2 დღეში</span>.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="მოძებნეთ ყვავილები..."
                            className="pl-9 bg-white"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={(qty) => handleAddToCart(product.name, qty)}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4 text-4xl">🥀</div>
                    <h3 className="text-lg font-bold">შედეგები არ მოიძებნა</h3>
                    <p className="text-muted-foreground">სცადეთ სხვა საძიებო სიტყვა.</p>
                </div>
            )}
        </div>
    );
}
