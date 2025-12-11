'use client';

import { useState, useEffect } from 'react';
import { ProductService } from '@/services/product.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        basePrice: 0,
        stockQuantity: 0,
        images: '', // Comma separated for now
        availableSizes: '', // Comma separated
        availableColors: '', // Comma separated
        active: true
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await ProductService.getProductById(params.id);
                setFormData({
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    basePrice: product.basePrice,
                    stockQuantity: product.stockQuantity,
                    images: product.images.join(', '),
                    availableSizes: product.availableSizes.join(', '),
                    availableColors: product.availableColors.join(', '),
                    active: product.active
                });
            } catch (error) {
                console.error('Failed to fetch product', error);
                alert('Failed to load product details');
                router.push('/admin/products');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
                availableSizes: formData.availableSizes.split(',').map(s => s.trim()).filter(Boolean),
                availableColors: formData.availableColors.split(',').map(s => s.trim()).filter(Boolean),
            };

            await ProductService.updateProduct(params.id, payload);
            router.push('/admin/products');
        } catch (error) {
            console.error('Failed to update product', error);
            alert('Failed to update product.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="basePrice">Price ($)</Label>
                                    <Input
                                        id="basePrice"
                                        name="basePrice"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={formData.basePrice}
                                        onChange={handleNumberChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                                    <Input
                                        id="stockQuantity"
                                        name="stockQuantity"
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.stockQuantity}
                                        onChange={handleNumberChange}
                                    />
                                </div>
                                <div className="flex items-center space-x-2 pt-8">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <Label htmlFor="active">Active (Visible in store)</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="images">Image URLs (comma separated)</Label>
                                <Input
                                    id="images"
                                    name="images"
                                    value={formData.images}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="availableSizes">Sizes (comma separated)</Label>
                                    <Input
                                        id="availableSizes"
                                        name="availableSizes"
                                        value={formData.availableSizes}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="availableColors">Colors (comma separated)</Label>
                                    <Input
                                        id="availableColors"
                                        name="availableColors"
                                        value={formData.availableColors}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full" disabled={submitting}>
                                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Product
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
