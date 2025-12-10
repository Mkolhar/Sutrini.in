"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'INR' | 'GBP' | 'EUR';

interface Locale {
    country: string;
    code: string; // e.g., 'US', 'IN'
    currency: Currency;
    symbol: string;
    rate: number; // Conversion rate relative to base (USD)
}

const LOCALES: Record<string, Locale> = {
    'US': { country: 'United States', code: 'US', currency: 'USD', symbol: '$', rate: 1 },
    'IN': { country: 'India', code: 'IN', currency: 'INR', symbol: '₹', rate: 83.5 },
    'GB': { country: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£', rate: 0.79 },
    'EU': { country: 'Europe', code: 'EU', currency: 'EUR', symbol: '€', rate: 0.92 },
};

interface LocaleContextType {
    currentLocale: Locale;
    setLocale: (countryCode: string) => void;
    formatPrice: (priceInUSD: number) => string;
    availableLocales: typeof LOCALES;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [currentLocale, setCurrentLocale] = useState<Locale>(LOCALES['US']);

    // Persist preference
    useEffect(() => {
        const saved = localStorage.getItem('sutrini_locale');
        if (saved && LOCALES[saved]) {
            setCurrentLocale(LOCALES[saved]);
        }
    }, []);

    const setLocale = (code: string) => {
        if (LOCALES[code]) {
            setCurrentLocale(LOCALES[code]);
            localStorage.setItem('sutrini_locale', code);
        }
    };

    const formatPrice = (priceInUSD: number) => {
        const converted = priceInUSD * currentLocale.rate;
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currentLocale.currency,
        }).format(converted);
    };

    return (
        <LocaleContext.Provider value={{ currentLocale, setLocale, formatPrice, availableLocales: LOCALES }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
}
