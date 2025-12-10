"use client";

import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export type ThemeMode = 'light' | 'dark';

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}

export function useTheme() {
    const { theme, setTheme, systemTheme } = useNextTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const computedTheme = (theme === 'system' ? systemTheme : theme) as ThemeMode;
    // Fallback to light if undefined or not mounted yet
    const currentTheme = mounted && computedTheme ? computedTheme : 'light';

    const toggleTheme = () => {
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    };

    return {
        theme: currentTheme,
        setTheme,
        toggleTheme
    };
}
