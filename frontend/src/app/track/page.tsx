"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, CheckCircle2, Circle, Truck, MapPin, Clock } from "lucide-react";
import { orderService, Order, OrderStatus } from "@/services/order.service";

// Order of steps for timeline
const STATUS_STEPS = [
    { status: OrderStatus.PENDING, label: "Order Placed", icon: Package },
    { status: OrderStatus.CONFIRMED, label: "Confirmed", icon: CheckCircle2 },
    { status: OrderStatus.IN_PRODUCTION, label: "In Production", icon: Clock },
    { status: OrderStatus.QUALITY_CHECK, label: "Quality Check", icon: CheckCircle2 },
    { status: OrderStatus.SHIPPED, label: "Shipped", icon: Truck },
    { status: OrderStatus.DELIVERED, label: "Delivered", icon: MapPin },
];

export default function TrackOrderPage() {
    const searchParams = useSearchParams();
    const initialId = searchParams.get("id") || "";

    const [orderId, setOrderId] = useState(initialId);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOrder = async (id: string) => {
        if (!id) return;
        setLoading(true);
        setError("");
        setOrder(null);
        try {
            const data = await orderService.getOrderById(id);
            setOrder(data);
        } catch (err: any) {
            console.error(err);
            setError("Order not found or access denied.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialId) {
            fetchOrder(initialId);
        }
    }, [initialId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrder(orderId);
    };

    const getStepStatus = (stepStatus: OrderStatus, currentStatus: OrderStatus) => {
        const stepIndex = STATUS_STEPS.findIndex(s => s.status === stepStatus);
        const currentIndex = STATUS_STEPS.findIndex(s => s.status === currentStatus);

        if (stepStatus === currentStatus) return "current";
        if (stepIndex < currentIndex) return "completed";
        return "upcoming";
    };

    return (
        <div className="container mx-auto py-10 px-4 min-h-[70vh]">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header & Search */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Track Your Order</h1>
                    <p className="text-muted-foreground">Enter your Order ID to see real-time updates.</p>

                    <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mt-4">
                        <Input
                            placeholder="Order ID (e.g. order123)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="bg-background"
                        />
                        <Button type="submit" disabled={loading}>
                            <Search className="h-4 w-4 mr-2" />
                            Track
                        </Button>
                    </form>
                </div>

                {/* Error State */}
                {error && (
                    <Card className="border-destructive/50 bg-destructive/10">
                        <CardContent className="pt-6 text-center text-destructive">
                            {error}
                        </CardContent>
                    </Card>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Order Details & Timeline */}
                {order && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle>Order #{order.id}</CardTitle>
                                    <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                                </div>
                                <Badge variant={order.status === OrderStatus.DELIVERED ? 'default' : 'secondary'} className="text-sm">
                                    {order.status.replace("_", " ")}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col md:flex-row justify-between gap-6 pt-4">
                                    <div>
                                        <h4 className="font-semibold mb-1">Items</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.quantity}x {item.productName || `Product ${item.productId}`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <h4 className="font-semibold mb-1">Total Amount</h4>
                                            <p className="text-lg font-bold">₹{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        {order.items[0]?.designImageUrl && (
                                            <div>
                                                <h4 className="font-semibold mb-1">Your Design</h4>
                                                <img
                                                    src={order.items[0].designImageUrl}
                                                    alt="Design"
                                                    className="w-24 h-24 object-contain border rounded-md bg-gray-50 dark:bg-gray-800"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tracking Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative border-l-2 border-muted ml-4 md:ml-6 space-y-8 py-2">
                                    {STATUS_STEPS.map((step, index) => {
                                        const statusState = getStepStatus(step.status, order.status);
                                        const Icon = step.icon;

                                        return (
                                            <div key={step.status} className="relative pl-8 md:pl-10">
                                                {/* Dot/Icon on timeline */}
                                                <div className={`absolute -left-[9px] top-0 p-1 rounded-full border-2 bg-background 
                                        ${statusState === 'completed' || statusState === 'current'
                                                        ? 'border-primary text-primary'
                                                        : 'border-muted text-muted-foreground'}`
                                                }>
                                                    <Icon className="h-3 w-3" />
                                                </div>

                                                <div className={`flex flex-col ${statusState === 'upcoming' ? 'opacity-50' : ''}`}>
                                                    <h4 className={`text-sm font-semibold ${statusState === 'current' ? 'text-primary' : ''}`}>
                                                        {step.label}
                                                    </h4>
                                                    {statusState === 'current' && (
                                                        <p className="text-xs text-muted-foreground mt-1 animate-pulse">
                                                            Current Stage
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div >
    );
}
