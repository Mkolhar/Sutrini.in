'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { QrCode, Search } from 'lucide-react';

export default function ScanPage() {
    const [orderId, setOrderId] = useState('');
    const router = useRouter();

    const handleManualLookup = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId) {
            // In a real app, this would check if valid
            router.push(`/admin/orders/${orderId}`);
        }
    };

    return (
        <div className="flex h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-xl rounded-2xl border border-gray-100 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                    <QrCode className="h-10 w-10 text-purple-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">Scan Factory Order</h2>
                <p className="text-gray-500">Scan the QR code on the order ticket or enter the ID manually.</p>

                <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 mb-8 border-2 border-dashed border-gray-700">
                    {/* Camera View Placeholder */}
                    <div className="text-center">
                        <p>Camera Feed Area</p>
                        <p className="text-xs mt-2">(Use react-qr-reader in production)</p>
                    </div>
                </div>

                <form onSubmit={handleManualLookup} className="flex gap-2">
                    <Input
                        placeholder="Enter Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="text-lg"
                    />
                    <Button type="submit" size="icon">
                        <Search className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
