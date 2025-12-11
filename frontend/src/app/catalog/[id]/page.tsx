'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductService } from '@/services/product.service';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Heart, Share2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [customNotes, setCustomNotes] = useState('');
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await ProductService.getProductById(params.id);
                setProduct(data);
                // Pre-select first options if available
                if (data.availableSizes?.length > 0) setSelectedSize(data.availableSizes[0]);
                if (data.availableColors?.length > 0) setSelectedColor(data.availableColors[0]);
            } catch (err) {
                console.error('Failed to fetch product details', err);
                setError('Product not found or unable to load details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    const handleAddToCart = () => {
        if (!product) return;

        addItem({
            productId: product.id,
            product: product,
            quantity: quantity,
            size: selectedSize || product.availableSizes?.[0] || 'M',
            color: selectedColor || product.availableColors?.[0] || 'Default',
            customNotes: customNotes
        });

        // Optional: Add toast notification here
        alert('Added to cart!');
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <Skeleton className="h-[500px] w-full rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                    <h2 className="text-2xl font-bold text-gray-900">{error || 'Product Not Found'}</h2>
                    <p className="text-gray-500">The product you are looking for does not exist or has been moved.</p>
                    <Button onClick={() => router.push('/catalog')} variant="outline">
                        Back to Catalog
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                            <AspectRatio ratio={3 / 4}>
                                <img
                                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1551488852-080175b92749?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            </AspectRatio>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
                            <p className="mt-2 text-lg text-gray-500 capitalize">{product.category}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-3xl font-bold tracking-tight text-gray-900">${product.basePrice.toFixed(2)}</p>
                            </div>
                        </div>

                        <p className="text-base text-gray-700 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="space-y-6 pt-6 border-t border-gray-100">
                            {/* Configuration */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {product.availableSizes && product.availableSizes.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Size</Label>
                                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {product.availableSizes.map(size => (
                                                    <SelectItem key={size} value={size}>{size}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {product.availableColors && product.availableColors.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Color</Label>
                                        <Select value={selectedColor} onValueChange={setSelectedColor}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select color" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {product.availableColors.map(color => (
                                                    <SelectItem key={color} value={color}>{color}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Customization Notes (Optional)</Label>
                                <Textarea
                                    placeholder="Specific instructions for embroidery, placement, or custom measurements..."
                                    className="min-h-[100px]"
                                    value={customNotes}
                                    onChange={(e) => setCustomNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-24">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    />
                                </div>
                                <Button
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 h-12 text-lg"
                                    onClick={handleAddToCart}
                                    disabled={!product.active || product.stockQuantity === 0}
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                                <Button variant="outline" size="icon" className="h-12 w-12">
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex justify-center">
                                <Button variant="ghost" size="sm" className="text-gray-500">
                                    <Share2 className="mr-2 h-4 w-4" /> Share Design
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
