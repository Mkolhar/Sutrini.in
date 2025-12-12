"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ArrowRight } from "lucide-react";
import { orderService, Order } from "@/services/order.service";
import { useToast } from "@/hooks/use-toast";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                // Sort by date descending
                const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setOrders(sorted);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Failed to load your orders. Please try again.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [toast]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <p className="text-muted-foreground">View and track your past orders.</p>
                </div>

                {orders.length === 0 ? (
                    <Card className="text-center py-10">
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="bg-muted p-4 rounded-full">
                                <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">No orders yet</h3>
                                <p className="text-muted-foreground">Start by creating your first custom design.</p>
                            </div>
                            <Button asChild>
                                <Link href="/custom">Go to Design Studio</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                            <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                                        </div>
                                        <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                                            {order.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                                        <div className="flex-1 space-y-1">
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="text-sm">
                                                    <span className="font-medium">{item.quantity}x</span> {item.productName || "Custom Item"}
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-xs text-muted-foreground">+{order.items.length - 2} more items</p>
                                            )}
                                        </div>
                                        <div className="text-right min-w-[100px]">
                                            <p className="font-bold text-lg">₹{order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/track?id=${order.id}`}>
                                                Track <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
