'use client';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trash2, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCartStore();

    const subtotal = items.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);
    const shipping = 0; // Free for now
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any designs yet.</p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link href="/catalog">Go to Collection</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
                                <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                        src={item.product.images?.[0]}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</h3>
                                            <p className="font-medium text-gray-900">${(item.product.basePrice * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 capitalize">{item.color} / {item.size}</p>
                                        {item.customNotes && (
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">Note: {item.customNotes}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                className="rounded border border-gray-300 py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-600 p-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between font-bold text-gray-900 text-base">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button className="w-full mt-8 bg-purple-600 hover:bg-purple-700 h-12">
                                Checkout <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
