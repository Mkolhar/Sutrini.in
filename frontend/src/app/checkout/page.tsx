'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrderService } from '@/services/order.service';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    productName: item.product.name,
                    quantity: item.quantity,
                    unitPrice: item.product.basePrice,
                    size: item.size,
                    color: item.color,
                    customNotes: item.customNotes
                })),
                totalAmount: subtotal
            };

            const order = await OrderService.createOrder(orderData);

            clearCart();
            router.push(`/track?orderId=${order.id}`); // Redirect to tracking or success page
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return <div className="p-8 text-center">Your cart is empty.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-semibold">Order Summary</h2>
                        <div className="mt-4 space-y-2">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.product.name} ({item.size})</span>
                                    <span>${(item.product.basePrice * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" required placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" required placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" required placeholder="123 Main St" />
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">ZIP Code</Label>
                                    <Input id="zip" required />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-semibold mb-4">Payment</h3>
                                {/* Placeholder for Stripe Element */}
                                <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center text-gray-500 text-sm">
                                    Stripe Payment Form Placeholder
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-lg" disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Pay $${subtotal.toFixed(2)}`}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
