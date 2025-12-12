"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { designAssetService, DesignAsset } from "@/services/design-asset.service";

export default function AdminDesignPage() {
    const [assets, setAssets] = useState<DesignAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [selectedAsset, setSelectedAsset] = useState<Partial<DesignAsset>>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSelectedAsset(prev => ({ ...prev, [id]: value }));
    };

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const data = await designAssetService.getAllAssets();
            setAssets(data);
        } catch (error) {
            toast({ title: "Error", description: "Failed to fetch assets", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedAsset.id) {
                await designAssetService.updateAsset(selectedAsset.id, selectedAsset);
                toast({ title: "Updated", description: "Asset updated successfully" });
            } else {
                await designAssetService.createAsset(selectedAsset);
                toast({ title: "Created", description: "New asset created" });
            }
            setIsDialogOpen(false);
            fetchAssets();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save asset", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this asset?")) return;
        try {
            await designAssetService.deleteAsset(id);
            toast({ title: "Deleted", description: "Asset removed" });
            fetchAssets();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete asset", variant: "destructive" });
        }
    };

    const openEdit = (asset: DesignAsset) => {
        setSelectedAsset(asset);
        setIsDialogOpen(true);
    };

    const openCreate = () => {
        setSelectedAsset({
            name: "",
            basePrice: 0,
            mockupImageUrl: "/mockup-tshirt.png",
            printAreaTop: "20%",
            printAreaLeft: "30%",
            printAreaWidth: "40%",
            printAreaHeight: "40%"
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Design Assets</h1>
                    <p className="text-muted-foreground">Manage garments, mockups, and pricing.</p>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Asset
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Configured Assets</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Preview</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Base Price</TableHead>
                                    <TableHead>Print Config (T/L/W/H)</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets.map((asset) => (
                                    <TableRow key={asset.id}>
                                        <TableCell>
                                            <div className="relative w-12 h-12 border rounded bg-gray-50">
                                                <img src={asset.mockupImageUrl} alt={asset.name} className="w-full h-full object-contain" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{asset.name}</TableCell>
                                        <TableCell>₹{asset.basePrice}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {asset.printAreaTop}, {asset.printAreaLeft}, {asset.printAreaWidth}, {asset.printAreaHeight}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(asset)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(asset.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedAsset.id ? "Edit Asset" : "Create Asset"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={selectedAsset.name || ""} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="basePrice">Base Price (₹)</Label>
                                <Input id="basePrice" type="number" value={selectedAsset.basePrice || 0} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mockupImageUrl">Mockup Image URL</Label>
                            <Input id="mockupImageUrl" value={selectedAsset.mockupImageUrl || ""} onChange={handleInputChange} placeholder="/mockup-tshirt.png" required />
                            <p className="text-xs text-muted-foreground">Upload image to public folder first or use external URL.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Print Area Configuration (CSS %)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input id="printAreaTop" placeholder="Top %" value={selectedAsset.printAreaTop || ""} onChange={handleInputChange} />
                                <Input id="printAreaLeft" placeholder="Left %" value={selectedAsset.printAreaLeft || ""} onChange={handleInputChange} />
                                <Input id="printAreaWidth" placeholder="Width %" value={selectedAsset.printAreaWidth || ""} onChange={handleInputChange} />
                                <Input id="printAreaHeight" placeholder="Height %" value={selectedAsset.printAreaHeight || ""} onChange={handleInputChange} />
                            </div>
                        </div>

                        <Button type="submit" className="w-full">Save Asset</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
