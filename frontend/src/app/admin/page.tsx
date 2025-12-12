'use client';

import { useState, useEffect } from 'react';

import api from '@/lib/api'; // Using raw api for admin endpoints not yet in service
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock checking admin role could be done here or via protected route wrapper

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders/all'); // Admin endpoint
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch admin orders', error);
            // Mock data for demo if backend auth fails or empty
            setOrders(MOCK_ADMIN_ORDERS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await api.put(`/orders/${orderId}/status`, JSON.stringify(newStatus), {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchOrders(); // Refresh
        } catch (e) {
            console.error('Update failed', e);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.location.href = '/admin/products'}>
                            Manage Products
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = '/admin/design'}>
                            Manage Design Studio
                        </Button>
                        <Button onClick={fetchOrders} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <span className="text-2xl font-bold">$45,231.89</span>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'PENDING').length}</div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Production</CardTitle>
                            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'IN_PRODUCTION').length}</div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
                            <div className="text-2xl font-bold">12</div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-[200px] w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.id.slice(-6)}</TableCell>
                                            <TableCell>{order.customerEmail || 'Guest'}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{order.items?.length || 0} items</TableCell>
                                            <TableCell className="text-right">${order.totalAmount}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <Select
                                                        defaultValue={order.status}
                                                        onValueChange={(val: string) => updateStatus(order.id, val)}
                                                    >
                                                        <SelectTrigger className="w-[140px] h-8">
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PENDING">Pending</SelectItem>
                                                            <SelectItem value="IN_PRODUCTION">In Production</SelectItem>
                                                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                                                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const MOCK_ADMIN_ORDERS = [
    { id: 'ord_12345678', customerEmail: 'jane@example.com', status: 'PENDING', items: [{}, {}], totalAmount: 129.50 },
    { id: 'ord_98765432', customerEmail: 'bob@example.com', status: 'IN_PRODUCTION', items: [{}], totalAmount: 49.99 },
    { id: 'ord_56473829', customerEmail: 'alice@corp.com', status: 'SHIPPED', items: [{}, {}, {}], totalAmount: 345.00 },
];
