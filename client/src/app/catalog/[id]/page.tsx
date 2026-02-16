'use client';

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useProduct } from '@/features/products/hooks';
import { mapServerProductDetailToClient } from '@/features/products/utils/productMapper';
import { useCart } from '@/store/useCart';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  ImageOff,
  MapPin,
  Flower2,
  Palette,
  Package,
  Boxes,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useProduct(id);
  const addItem = useCart((state) => state.addItem);

  const product = useMemo(() => {
    if (!data?.data) return null;
    return mapServerProductDetailToClient(data.data);
  }, [data?.data]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [qty, setQty] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Reset qty when product loads
  const minBoxSize = product?.minBoxSize ?? 10;
  if (qty === 0 && product) {
    setQty(minBoxSize);
  }

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, qty);
    toast.success(`${qty} ცალი ${product.name} დაემატა კალათაში`);
    setQty(minBoxSize);
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const images = product?.images ?? [];
  const validImages = images.filter((_, i) => !imageErrors.has(i));
  const hasImages = validImages.length > 0;
  const currentImageUrl = images[selectedImageIndex];
  const currentImageValid = currentImageUrl && !imageErrors.has(selectedImageIndex);

  const navigateImage = (dir: 'prev' | 'next') => {
    if (images.length <= 1) return;
    setSelectedImageIndex((prev) =>
      dir === 'next'
        ? (prev + 1) % images.length
        : (prev - 1 + images.length) % images.length
    );
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="container py-20 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">პროდუქტი ვერ მოიძებნა</h2>
          <p className="text-muted-foreground mb-6">
            სამწუხაროდ, მოთხოვნილი პროდუქტი ვერ მოიძებნა ან წაშლილია.
          </p>
          <Button onClick={() => router.push('/catalog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            კატალოგში დაბრუნება
          </Button>
        </div>
      </div>
    );
  }

  const isInStock = product.stock > 0;

  return (
    <div className="container py-6 px-4 md:px-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/catalog" className="hover:text-foreground transition-colors">
          კატალოგი
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[300px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ============ LEFT: Image Gallery ============ */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border/50">
            {currentImageValid ? (
              <>
                <Image
                  src={currentImageUrl}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-contain p-4"
                  onError={() => handleImageError(selectedImageIndex)}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage('prev')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigateImage('next')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                <ImageOff className="h-16 w-16 mb-3" />
                <span className="text-sm font-medium">სურათი არ არის</span>
              </div>
            )}

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
                {selectedImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  {!imageErrors.has(index) ? (
                    <Image
                      src={url}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      unoptimized
                      className="object-contain p-1"
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <ImageOff className="h-4 w-4 text-slate-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ============ RIGHT: Product Info ============ */}
        <div className="flex flex-col">
          {/* Tags & badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {isInStock ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                მარაგშია
              </Badge>
            ) : (
              <Badge variant="destructive">
                არ არის მარაგში
              </Badge>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-2">
            {product.name}
          </h1>

          {/* Color tag */}
          {product.color && product.color !== 'Unknown' && (
            <p className="text-sm text-muted-foreground mb-4">
              {product.color}
            </p>
          )}

          {/* Price */}
          <div className="mb-6">
            <div className="text-3xl font-bold text-primary">
              {product.price.toFixed(2)} ₾
            </div>
            {product.priceTiers.length > 1 && (
              <p className="text-sm text-muted-foreground mt-1">
                ფასი დამოკიდებულია რაოდენობაზე
              </p>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Product Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {product.origin && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">წარმოშობა</p>
                  <p className="text-sm font-semibold">{product.origin}</p>
                </div>
              </div>
            )}
            {product.grower && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Flower2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">მწარმოებელი</p>
                  <p className="text-sm font-semibold">{product.grower}</p>
                </div>
              </div>
            )}
            {product.color && product.color !== 'Unknown' && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ფერი</p>
                  <p className="text-sm font-semibold">{product.color}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Boxes className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">მარაგი</p>
                <p className="text-sm font-semibold">{product.stock} ცალი</p>
              </div>
            </div>
          </div>

          {/* Price Tiers */}
          {product.priceTiers.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">საფასო სეგმენტები</h3>
              <div className="rounded-xl border border-border/50 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
                        რაოდენობა
                      </th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">
                        ფასი (ცალი)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.priceTiers
                      .sort((a, b) => a.minQuantity - b.minQuantity)
                      .map((tier, index) => (
                        <tr
                          key={tier.minQuantity}
                          className={index % 2 === 0 ? '' : 'bg-muted/30'}
                        >
                          <td className="px-4 py-2.5">
                            {tier.minQuantity}+ ცალი
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold">
                            {tier.price.toFixed(2)} ₾
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Min box size info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Package className="h-4 w-4" />
            <span>
              მინ. შეკვეთა: <strong className="text-foreground">{product.minBoxSize} ცალი</strong> (ყუთი)
            </span>
          </div>

          <Separator className="mb-6" />

          {/* Add to Cart Section */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <div className="flex items-center border rounded-xl overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-none"
                onClick={() => setQty(Math.max(minBoxSize, qty - 10))}
                disabled={!isInStock}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="w-16 text-center text-base font-semibold">{qty}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-none"
                onClick={() => setQty(qty + 10)}
                disabled={!isInStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1 h-12 text-base font-semibold"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isInStock ? 'კალათაში დამატება' : 'არ არის მარაგში'}
            </Button>
          </div>

          {isInStock && qty > minBoxSize && (
            <p className="text-sm text-muted-foreground mt-3">
              სულ:{' '}
              <span className="font-semibold text-foreground">
                {(product.price * qty).toFixed(2)} ₾
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container py-6 px-4 md:px-6 lg:py-10">
      <Skeleton className="h-4 w-48 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg shrink-0" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-px w-full" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
