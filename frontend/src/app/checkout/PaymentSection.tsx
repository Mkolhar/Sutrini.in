'use client';

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function PaymentSection({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/track`, // Redirect after payment
            },
            redirect: 'if_required'
        });

        if (error) {
            setErrorMessage(error.message || 'Payment failed');
            setLoading(false);
        } else {
            // Success
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="bg-white p-4 rounded-md border border-gray-200">
                <PaymentElement />
            </div>
            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
            <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-lg" disabled={!stripe || loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Pay ₹${(amount / 100).toFixed(2)}`}
            </Button>
        </form>
    );
}
