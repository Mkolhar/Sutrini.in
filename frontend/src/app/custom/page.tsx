"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, MessageSquare, Move } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function DesignStudioPage() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { useRouter } = require("next/navigation");
    const routerHook = useRouter();

    // Setup state for dynamic assets
    const [assets, setAssets] = useState<any[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);

    const [formData, setFormData] = useState({
        garmentTypeId: "", // Now using ID or Type Key
        quantity: "",
        notes: ""
    });

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch assets on mount
    const { designAssetService } = require("@/services/design-asset.service");
    useEffect(() => {
        async function loadAssets() {
            try {
                const data = await designAssetService.getAllAssets();
                setAssets(data);
                if (data.length > 0) {
                    // Default to first item
                    setFormData(prev => ({ ...prev, garmentTypeId: data[0].id }));
                    setSelectedAsset(data[0]);
                }
            } catch (err) {
                console.error("Failed to load design assets", err);
            }
        }
        loadAssets();
    }, []);

    const handleAssetChange = (val: string) => {
        const asset = assets.find(a => a.id === val);
        setFormData(p => ({ ...p, garmentTypeId: val }));
        setSelectedAsset(asset);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUploadedImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!selectedAsset) return;

            const orderPayload = {
                items: [
                    {
                        productId: "custom-" + selectedAsset.type,
                        quantity: parseInt(formData.quantity),
                        unitPrice: selectedAsset.basePrice,
                        productName: `Custom ${selectedAsset.name} (${formData.notes})`,
                        designImageUrl: uploadedImage || undefined
                    }
                ],
                totalAmount: parseInt(formData.quantity) * selectedAsset.basePrice
            };

            const { orderService } = require("@/services/order.service");
            const newOrder = await orderService.createOrder(orderPayload);

            toast({
                title: "Order Placed Successfully",
                description: `Order #${newOrder.id} created. Redirecting to tracker...`,
            });

            routerHook.push(`/track?id=${newOrder.id}`);

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to place order. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Side: Mockup Preview */}
                <div className="flex-1 lg:max-w-2xl">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Preview Mockup</CardTitle>
                            <CardDescription>Visualizing on {selectedAsset?.name || 'Garment'}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center min-h-[400px] bg-muted/20 relative overflow-hidden rounded-md border-2 border-dashed p-0">

                            {/* Dynamic Garment Image */}
                            <div className="relative w-full h-[500px] bg-white flex items-center justify-center">
                                {selectedAsset ? (
                                    <Image
                                        src={selectedAsset.mockupImageUrl}
                                        alt={selectedAsset.name}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                ) : (
                                    <div className="text-muted-foreground">Loading Assets...</div>
                                )}

                                {/* Dynamic Printable Area Overlay */}
                                {selectedAsset && (
                                    <div
                                        className="absolute border-2 border-dashed border-primary/30 transition-all duration-300"
                                        style={{
                                            top: selectedAsset.printAreaTop,
                                            left: selectedAsset.printAreaLeft,
                                            width: selectedAsset.printAreaWidth,
                                            height: selectedAsset.printAreaHeight
                                        }}
                                    >
                                        {!uploadedImage && (
                                            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/50 font-medium uppercase tracking-widest pointer-events-none">
                                                Print Area
                                            </div>
                                        )}
                                        {uploadedImage && (
                                            <div className="relative w-full h-full cursor-move group">
                                                <Image
                                                    src={uploadedImage}
                                                    alt="Design"
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Controls */}
                <div className="w-full lg:w-1/3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Design Controls</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="space-y-2">
                                    <Label htmlFor="garment">Garment Type</Label>
                                    <Select
                                        value={formData.garmentTypeId}
                                        onValueChange={handleAssetChange}
                                        disabled={assets.length === 0}
                                    >
                                        <SelectTrigger id="garment">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {assets.map((asset) => (
                                                <SelectItem key={asset.id} value={asset.id}>
                                                    {asset.name} - ₹{asset.basePrice}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Upload Artwork</Label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            {uploadedImage ? (
                                                <div className="relative h-16 w-16">
                                                    <Image src={uploadedImage} alt="Preview" fill className="object-cover rounded" />
                                                </div>
                                            ) : (
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                {uploadedImage ? "Click to change file" : "Click to upload design"}
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 50"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData(p => ({ ...p, quantity: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Specific instructions..."
                                        className="min-h-[80px]"
                                        value={formData.notes}
                                        onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Request Quote
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
