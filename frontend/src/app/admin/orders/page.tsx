"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, RefreshCw, QrCode } from "lucide-react";
import { orderService, Order, OrderStatus } from "@/services/order.service";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // In a real app, this would be an admin-specific endpoint with pagination
            // For now we reuse the consumer endpoint but assume the user has admin rights or we mock it
            // actually we added getAllOrders to the service which hits /api/orders/all
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast({
                title: "Error",
                description: "Failed to load orders. Ensure you have admin privileges.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await orderService.updateStatus(orderId, newStatus);
            toast({ title: "Status Updated", description: `Order ${orderId} is now ${newStatus}` });
            // Refresh valid orders
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            toast({ title: "Update Failed", description: "Could not update status.", variant: "destructive" });
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
                    <p className="text-muted-foreground">Manage production flow and update statuses.</p>
                </div>
                <Button variant="outline" onClick={fetchOrders} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>View and manage all customer orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && orders.length === 0 ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>QR</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24">No orders found.</TableCell>
                                    </TableRow>
                                )}
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{order.customerEmail || "N/A"}</span>
                                                <span className="text-xs text-muted-foreground">{order.customerId}</span>
                                                {order.items[0]?.designImageUrl && (
                                                    <div className="mt-1">
                                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">Custom Design</span>
                                                        <img
                                                            src={order.items[0].designImageUrl}
                                                            alt="Design"
                                                            className="w-16 h-16 object-contain border rounded-sm bg-gray-50 dark:bg-gray-800"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>₹{order.totalAmount}</TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <QrCode className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Order QR Code</DialogTitle>
                                                        <DialogDescription>
                                                            Order ID: {order.id}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="flex justify-center p-4">
                                                        {order.qrCodeUrl ? (
                                                            <img src={order.qrCodeUrl} alt="Order QR" className="w-64 h-64 border rounded" />
                                                        ) : (
                                                            <p className="text-muted-foreground">No QR code generated.</p>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                order.status === OrderStatus.DELIVERED ? "border-green-500 text-green-500" :
                                                    order.status === OrderStatus.PENDING ? "border-yellow-500 text-yellow-500" :
                                                        ""
                                            }>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={order.status}
                                                onValueChange={(val) => handleStatusChange(order.id, val as OrderStatus)}
                                            >
                                                <SelectTrigger className="w-[140px] h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(OrderStatus).map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status.replace("_", " ")}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
