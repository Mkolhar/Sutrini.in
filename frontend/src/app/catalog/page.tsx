'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { ProductService } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { useLocale } from '@/context/LocaleContext';

export default function CatalogPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all fetched prodcuts
    const [visibleProducts, setVisibleProducts] = useState<Product[]>([]); // Store filtered products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // New Filter States
    const [priceRange, setPriceRange] = useState<{ min: string, max: string }>({ min: '', max: '' });
    const [sortBy, setSortBy] = useState<string>('relevance');

    const { currentLocale } = useLocale();

    // Mock categories for now - in a real app these should come from an API
    const categories = ['All', 'Blouses', 'Kurtis', 'Sarees', 'Accessories'];

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Always fetch from backend
            const data = await ProductService.getAllProducts(activeCategory && activeCategory !== 'All' ? activeCategory : undefined);
            setAllProducts(data || []);
        } catch (error) {
            console.error('Failed to fetch products', error);
            setError('Failed to load products. Please try again.');
            setAllProducts([]);
        } finally {
            setLoading(false);
        }
    }, [activeCategory]);

    const applyClientSideFilters = useCallback(() => {
        let filtered = [...allProducts];

        // 1. Search Filter (Client side for now, can be server side if needed)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // 2. Price Filter (Locale Aware)
        const min = parseFloat(priceRange.min) || 0;
        const max = parseFloat(priceRange.max) || Infinity;

        filtered = filtered.filter(p => {
            const priceInCurrency = p.basePrice * currentLocale.rate;
            return priceInCurrency >= min && priceInCurrency <= max;
        });

        // 3. Sorting
        if (sortBy === 'price_asc') {
            filtered.sort((a, b) => (a.basePrice * currentLocale.rate) - (b.basePrice * currentLocale.rate));
        } else if (sortBy === 'price_desc') {
            filtered.sort((a, b) => (b.basePrice * currentLocale.rate) - (a.basePrice * currentLocale.rate));
        }
        // 'relevance' - default order

        setVisibleProducts(filtered);
    }, [allProducts, searchQuery, priceRange, sortBy, currentLocale]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        applyClientSideFilters();
    }, [applyClientSideFilters]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // Triggered via useEffect
    };

    const clearFilters = () => {
        setPriceRange({ min: '', max: '' });
        setSortBy('relevance');
        setSearchQuery('');
        // Category is separate, maybe keep it or reset it?
        // setActiveCategory(null); 
    };

    return (
        <div className="min-h-screen bg-background/50">
            {/* Header Section */}
            <div className="bg-card border-b border-border sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-foreground">Collection</h1>
                            {visibleProducts.length > 0 && <Badge variant="secondary" className="hidden sm:inline-flex">{visibleProducts.length} Items</Badge>}
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <form onSubmit={handleSearch} className="relative flex-1 md:w-80">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search designs..."
                                    className="pl-9 bg-secondary/50 search-input"
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
                                                <span className="text-muted-foreground">-</span>
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
                                            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                                            <SheetClose asChild>
                                                <Button>Apply</Button>
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
                {error ? (
                    <div className="text-center py-20">
                        <h3 className="text-lg font-medium text-red-500">Error Loading Products</h3>
                        <p className="mt-1 text-muted-foreground">{error}</p>
                        <Button variant="outline" onClick={fetchProducts} className="mt-4">
                            <RefreshCw className="mr-2 h-4 w-4" /> Retry
                        </Button>
                    </div>
                ) : loading ? (
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
                ) : visibleProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-lg font-medium text-foreground">No products found</h3>
                        <p className="mt-1 text-muted-foreground">Try adjusting your search or filters.</p>
                        <Button variant="link" onClick={clearFilters} className="mt-4">
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
