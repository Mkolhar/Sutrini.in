import { useState, useEffect } from 'react';
import { Address } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, MapPin } from 'lucide-react';

interface AddressFormProps {
    initialData?: Address | null;
    onSubmit: (data: Partial<Address>) => Promise<void>;
    onCancel: () => void;
}

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [loading, setLoading] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [formData, setFormData] = useState<Partial<Address>>({
        fullName: '',
        streetAddress: '',
        aptSuite: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phoneNumber: '',
        isDefault: false,
        latitude: undefined,
        longitude: undefined,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isDefault: checked }));
    };

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lon
                }));

                try {
                    // Reverse Geocoding using Nominatim (OpenStreetMap)
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
                        headers: {
                            'User-Agent': 'SutriniApp/1.0'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const address = data.address;

                        // Map Apt/Suite
                        const aptSuite = address.house_name ||
                            address.building ||
                            address.apartment ||
                            address.flat ||
                            '';

                        // Construct comprehensive Street Address
                        // Format: "HouseNumber, Road, Quarter, Suburb, CityDistrict"
                        const streetComponents = [
                            address.house_number,
                            address.road || address.street || address.pedestrian || address.path || address.residential,
                            address.neighbourhood || address.quarter,
                            address.suburb || address.hamlet,
                            address.city_district
                        ];

                        let streetAddress = streetComponents
                            .filter(Boolean)
                            .join(', ')
                            .trim();

                        // Fallback: Use display_name part if street address is too short/empty
                        if (!streetAddress && data.display_name) {
                            streetAddress = data.display_name.split(',')[0].trim();
                        }

                        setFormData(prev => ({
                            ...prev,
                            aptSuite: aptSuite,
                            streetAddress: streetAddress || '',
                            city: address.city || address.town || address.village || address.suburb || '',
                            state: address.state || '',
                            postalCode: address.postcode || '',
                            country: address.country || '',
                            // Lat/Lon are already set above
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching address details", error);
                    // We still keep the coordinates even if reverse geocoding fails
                } finally {
                    setDetectingLocation(false);
                }
            },
            (error) => {
                console.error("Error detecting location", error);
                alert('Unable to retrieve your location');
                setDetectingLocation(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden Inputs for GPS persistence */}
            <input type="hidden" name="latitude" value={formData.latitude || ''} />
            <input type="hidden" name="longitude" value={formData.longitude || ''} />

            <div className="flex flex-col gap-2 pb-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={detectLocation}
                    disabled={detectingLocation}
                    className="gap-2 w-full sm:w-auto self-start"
                >
                    {detectingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4 text-primary" />}
                    {detectingLocation ? "Detecting Address..." : "Use Current Location"}
                </Button>
                <p className="text-xs text-muted-foreground italic">
                    Note: Auto-detected addresses may vary in accuracy. Please verify and edit details manually if needed.
                </p>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="aptSuite">Apt / Suite (Optional)</Label>
                <Input id="aptSuite" name="aptSuite" value={formData.aptSuite} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Address
                </Button>
            </div>
        </form>
    );
}
