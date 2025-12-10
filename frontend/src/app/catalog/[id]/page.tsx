'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductService } from '@/services/product.service';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [customNotes, setCustomNotes] = useState('');
    const [quantity, setQuantity] = useState(1);

    const { addItem } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await ProductService.getProductById(params.id);
                setProduct(data);
            } catch {
                // Fallback to mock data if API fails (common in early dev)
                console.log('Fetching mock product since API failed');
                setProduct(MOCK_PRODUCT_DETAIL);
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

    if (!product) {
        return <div className="text-center py-12">Product not found.</div>;
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
                        {/* Thumbnails would go here */}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
                            <p className="mt-2 text-lg text-gray-500 capitalize">{product.category}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-3xl font-bold tracking-tight text-gray-900">${product.basePrice.toFixed(2)}</p>
                                {/* Rating could go here */}
                            </div>
                        </div>

                        <p className="text-base text-gray-700 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="space-y-6 pt-6 border-t border-gray-100">
                            {/* Configuration */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Size</Label>
                                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {product.availableSizes?.map(size => (
                                                <SelectItem key={size} value={size}>{size}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Color</Label>
                                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {product.availableColors?.map(color => (
                                                <SelectItem key={color} value={color}>{color}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
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
                                >
                                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
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

const MOCK_PRODUCT_DETAIL: Product = {
    id: '1',
    name: 'Floral Embroidered Blouse',
    description: 'Exquisite hand-crafted floral embroidery on premium raw silk fabric. This design features intricate thread work inspired by traditional motifs, perfect for weddings and festive occasions. The blouse is customizable to your exact measurements.',
    category: 'Blouses',
    images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop'],
    basePrice: 49.99,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'],
    availableColors: ['Red', 'Green', 'Royal Blue', 'Black'],
    stockQuantity: 10,
    active: true
};
