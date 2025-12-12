'use client';

import { Address } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';

interface AddressCardProps {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
    return (
        <Card className={`relative ${address.isDefault ? 'border-primary' : ''}`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">{address.fullName}</CardTitle>
                    {address.isDefault && (
                        <span className="flex items-center text-xs text-primary font-medium">
                            <CheckCircle className="w-3 h-3 mr-1" /> Default
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                    <p>{address.streetAddress}</p>
                    {address.aptSuite && <p>{address.aptSuite}</p>}
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p>{address.country}</p>
                    <p className="pt-2">{address.phoneNumber}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(address)} className="h-8">
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(address.id!)} className="h-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
