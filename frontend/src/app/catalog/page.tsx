'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductService } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { useLocale } from '@/context/LocaleContext';

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // New Filter States
    const [priceRange, setPriceRange] = useState<{ min: string, max: string }>({ min: '', max: '' });
    const [sortBy, setSortBy] = useState<string>('relevance');

    const { currentLocale } = useLocale();

    // Mock categories for now
    const categories = ['All', 'Blouses', 'Kurtis', 'Sarees', 'Accessories'];

    useEffect(() => {
        fetchProducts();
    }, [activeCategory, sortBy, currentLocale]); // Re-fetch/Apply filters when these change

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Try to fetch from backend
            // In a real app, we would pass all filters (price, sort, category) to the backend API here.
            // const data = await ProductService.getProducts({ category: activeCategory, sort: sortBy, ... });

            // For this verified mock-mode:
            const data = await ProductService.getAllProducts(activeCategory && activeCategory !== 'All' ? activeCategory : undefined);

            if (data && data.length > 0) {
                // Even if backend returns data, we might need to apply client-side sorting if API doesn't support it yet
                // But assuming backend does it right, we just set it.
                // If we are strictly in "Mock Mode" because backend is down:
                setProducts(data);
            } else {
                // Backend empty or down, use fully client-side mock logic
                applyMockFilters();
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
            applyMockFilters(); // Fallback on error
        } finally {
            setLoading(false);
        }
    };

    const applyMockFilters = () => {
        let filtered = [...MOCK_PRODUCTS];

        // 1. Category Filter
        if (activeCategory && activeCategory !== 'All') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }

        // 2. Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // 3. Price Filter (Locale Aware)
        const min = parseFloat(priceRange.min) || 0;
        const max = parseFloat(priceRange.max) || Infinity;

        filtered = filtered.filter(p => {
            const priceInCurrency = p.basePrice * currentLocale.rate;
            return priceInCurrency >= min && priceInCurrency <= max;
        });

        // 4. Sorting
        if (sortBy === 'price_asc') {
            filtered.sort((a, b) => (a.basePrice * currentLocale.rate) - (b.basePrice * currentLocale.rate));
        } else if (sortBy === 'price_desc') {
            filtered.sort((a, b) => (b.basePrice * currentLocale.rate) - (a.basePrice * currentLocale.rate));
        }
        // 'relevance' - keep default order or search relevance if implemented

        setProducts(filtered);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(); // Trigger filter chain
    };

    const handleApplyFilters = () => {
        fetchProducts();
    };

    const clearFilters = () => {
        setPriceRange({ min: '', max: '' });
        setSortBy('relevance');
        setActiveCategory(null);
        setSearchQuery('');
        // We need to trigger a fetch/update after clearing. 
        // Since state updates are async, we might not capture reset values immediately if we call fetchProducts() directly.
        // A simple way is to rely on useEffect or manually call applyMockFilters with default values.
        // For simplicity in this mock setup:
        setTimeout(() => {
            // Reset UI and data
            setProducts(MOCK_PRODUCTS);
        }, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-900">Collection</h1>
                            {products.length > 0 && <Badge variant="secondary" className="hidden sm:inline-flex">{products.length} Items</Badge>}
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <form onSubmit={handleSearch} className="relative flex-1 md:w-80">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Search designs..."
                                    className="pl-9 bg-gray-50 search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="shrink-0">
                                        <SlidersHorizontal className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Filters & Sorting</SheetTitle>
                                        <SheetDescription>
                                            Refine your search to find exactly what you need.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="grid gap-6 py-6">
                                        {/* Sort By */}
                                        <div className="space-y-2">
                                            <Label>Sort By</Label>
                                            <Select value={sortBy} onValueChange={setSortBy}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sort option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="relevance">Relevance</SelectItem>
                                                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Price Range */}
                                        <div className="space-y-2">
                                            <Label>Price Range</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={priceRange.min}
                                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                                />
                                                <span className="text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={priceRange.max}
                                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <SheetFooter>
                                        <div className="flex flex-col gap-2 w-full sm:flex-row sm:justify-end">
                                            <Button variant="outline" onClick={clearFilters}>Clear All</Button>
                                            <SheetClose asChild>
                                                <Button onClick={handleApplyFilters}>Apply Filters</Button>
                                            </SheetClose>
                                        </div>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={activeCategory === cat || (cat === 'All' && !activeCategory) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveCategory(cat === 'All' ? null : cat)}
                                className="rounded-full px-6"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-[300px] w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
                        <Button variant="link" onClick={clearFilters} className="mt-4">
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Mock Data for UI Dev
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Floral Embroidered Blouse',
        description: 'Hand-crafted floral embroidery on premium silk.',
        category: 'Blouses',
        images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop'],
        basePrice: 49.99,
        availableSizes: ['S', 'M', 'L'],
        availableColors: ['Red', 'Green'],
        stockQuantity: 10,
        active: true
    },
    {
        id: '2',
        name: 'Peacock Motif Silk Blouse',
        description: 'Traditional peacock design with gold thread work.',
        category: 'Blouses',
        images: ['https://images.unsplash.com/photo-1583391733975-20360252b5b9?q=80&w=1000&auto=format&fit=crop'],
        basePrice: 89.99,
        availableSizes: ['M', 'L', 'XL'],
        availableColors: ['Blue', 'Pink'],
        stockQuantity: 5,
        active: true
    },
    {
        id: '3',
        name: 'Geometric Pattern Kurti',
        description: 'Modern geometric embroidery on cotton fabric.',
        category: 'Kurtis',
        images: ['https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=1000&auto=format&fit=crop'],
        basePrice: 35.50,
        availableSizes: ['S', 'M', 'L', 'XL'],
        availableColors: ['White', 'Black'],
        stockQuantity: 20,
        active: true
    },
    {
        id: '4',
        name: 'Custom Bridal Design',
        description: 'Heavy embroidery work for bridal wear.',
        category: 'Sarees',
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop'],
        basePrice: 199.99,
        availableSizes: ['Custom'],
        availableColors: ['Red', 'Gold'],
        stockQuantity: 2,
        active: true
    }
];
