'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { OrderService } from '@/services/order.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            OrderService.getOrder(orderId)
                .then(data => setOrder(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [orderId]);

    if (!orderId) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>
                <p className="text-gray-500 mb-6">Enter your Order ID to see real-time updates.</p>
                {/* Add form here if needed */}
            </div>
        );
    }

    if (loading) return <div className="p-12"><Skeleton className="h-48 w-full max-w-2xl mx-auto" /></div>;

    if (!order) return <div className="p-12 text-center">Order not found.</div>;

    const steps = [
        { status: 'PENDING', label: 'Order Placed', icon: CheckCircle2 },
        { status: 'IN_PRODUCTION', label: 'In Production', icon: Package },
        { status: 'SHIPPED', label: 'Shipped', icon: Truck },
        { status: 'DELIVERED', label: 'Delivered', icon: Home },
    ];

    // This logic is simple; real logic would check history or index
    const currentStepIndex = steps.findIndex(s => s.status === order.status) !== -1
        ? steps.findIndex(s => s.status === order.status)
        : 0;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</h1>
                        <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>

                    {order.qrCodeUrl && (
                        <div className="mb-8 flex justify-center relative w-32 h-32 mx-auto">
                            <Image src={order.qrCodeUrl} alt="Order QR" fill className="object-contain" />
                        </div>
                    )}

                    <div className="relative flex justify-between items-center mb-12">
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-0"></div>
                        <div
                            className="absolute left-0 top-1/2 h-1 bg-green-500 -z-0 transition-all duration-500"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isCompleted = idx <= currentStepIndex;
                            return (
                                <div key={step.status} className="relative z-10 flex flex-col items-center bg-white px-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className={`mt-2 text-xs font-medium ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-left border-t border-gray-100 pt-8">
                        <h2 className="font-semibold mb-4">Items</h2>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {order.items.map((item: any) => (
                            <div key={item.productId} className="flex justify-between py-2 text-sm">
                                <span>{item.quantity}x {item.productName} ({item.size})</span>
                                <span>${item.unitPrice}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold mt-4 text-lg">
                            <span>Total</span>
                            <span>${order.totalAmount}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button asChild variant="outline">
                            <Link href="/catalog">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center">Loading tracker...</div>}>
            <TrackOrderContent />
        </Suspense>
    );
}
