'use client';

import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';

import { useLocale } from '@/context/LocaleContext';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { formatPrice } = useLocale();
    return (
        <Card className="group overflow-hidden border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardHeader className="p-0">
                <Link href={`/catalog/${product.id}`}>
                    <div className="overflow-hidden">
                        <AspectRatio ratio={3 / 4}>
                            <Image
                                src={product.images?.[0] || 'https://images.unsplash.com/photo-1551488852-080175b92749?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </AspectRatio>
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-sm text-gray-500 mb-1 capitalize">{product.category}</p>
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-900">
                        {formatPrice(product.basePrice)}
                    </Badge>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-gray-900 hover:bg-purple-600 transition-colors" asChild>
                    <Link href={`/catalog/${product.id}`}>
                        Customize & Buy
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
