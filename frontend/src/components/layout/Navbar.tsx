'use client';

import Link from 'next/link';
import { ShoppingBag, User, Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentLocale, setLocale, availableLocales } = useLocale();
    const { user, logout } = useAuth();

    const getUserDisplayName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        if (user?.firstName) {
            return user.firstName;
        }
        if (user?.email) {
            return user.email.split('@')[0];
        }
        return 'User';
    };

    const getUserInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        if (user?.firstName) {
            return user.firstName.substring(0, 2).toUpperCase();
        }
        if (user?.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    return (
        <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-foreground tracking-tight">
                            Sutrini<span className="text-primary">.</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/catalog" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                            Collection
                        </Link>
                        <Link href="/custom" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                            Design Studio
                        </Link>
                        <Link href="/track" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                            Track Order
                        </Link>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Locale Selector */}
                        <div className="w-[100px]">
                            <Select value={currentLocale.code} onValueChange={setLocale}>
                                <SelectTrigger className="h-9 border-none bg-transparent focus:ring-0 px-2 gap-1 text-muted-foreground font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {Object.values(availableLocales).map((locale) => (
                                        <SelectItem key={locale.code} value={locale.code}>
                                            <span className="flex items-center gap-2">
                                                <span>{locale.code === 'US' ? '🇺🇸' : locale.code === 'IN' ? '🇮🇳' : locale.code === 'GB' ? '🇬🇧' : '🇪🇺'}</span>
                                                <span>{locale.currency}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                        </Link>

                        {user ? (
                            // User is logged in - show profile dropdown
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                                            {getUserInitials()}
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="cursor-pointer">
                                            <UserCircle className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            // User is not logged in - show sign in button
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-muted-foreground hover:text-foreground p-2"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-t border-border absolute w-full">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            href="/catalog"
                            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                            Collection
                        </Link>
                        <Link
                            href="/custom"
                            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                            Design Studio
                        </Link>
                        <Link
                            href="/track"
                            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                            Track Order
                        </Link>

                        {user ? (
                            <div className="pt-4 space-y-2">
                                <div className="px-3 py-2 text-sm">
                                    <p className="font-medium text-foreground">{getUserDisplayName()}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <Link
                                    href="/profile"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 flex gap-4">
                                <Button className="w-full bg-primary" asChild>
                                    <Link href="/login">Sign In</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
