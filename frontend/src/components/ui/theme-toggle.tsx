'use client';

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex h-11 w-20 items-center rounded-full bg-secondary transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Toggle theme"
        >
            <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-primary"
                initial={false}
                animate={{
                    x: theme === 'light' ? 2 : 38,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                }}
                style={{
                    width: '38px',
                    height: '38px',
                }}
            >
                {theme === 'light' ? (
                    <Sun className="h-5 w-5 text-primary-foreground" />
                ) : (
                    <Moon className="h-5 w-5 text-primary-foreground" />
                )}
            </motion.div>
        </button>
    );
}
