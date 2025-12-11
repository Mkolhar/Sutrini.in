'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrderService } from '@/services/order.service';
import { Loader2 } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import PaymentSection from './PaymentSection';
import api from '@/lib/api';

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);

    const subtotal = items.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order
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
            setOrderId(order.id);
            setAmount(order.totalAmount * 100); // converting to paise

            // 2. Create Payment Intent
            const res = await api.post('/payments/create-payment-intent', {
                orderId: order.id,
                amount: Math.round(order.totalAmount * 100) // Ensure integer
            });

            setClientSecret(res.data.clientSecret);
            setStep('payment');

        } catch (error) {
            console.error('Order creation failed', error);
            alert('Failed to initiate checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        clearCart();
        router.push(`/track?orderId=${orderId}`);
    };

    if (items.length === 0 && step === 'shipping') {
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
                                    <span>₹{(item.product.basePrice * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {step === 'shipping' ? (
                            <form onSubmit={handleCreateOrder} className="space-y-6">
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

                                <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-lg" disabled={loading}>
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing Payment...</> : `Proceed to Payment`}
                                </Button>
                            </form>
                        ) : (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Payment</h3>
                                {clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <PaymentSection amount={amount} onSuccess={handlePaymentSuccess} />
                                    </Elements>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
