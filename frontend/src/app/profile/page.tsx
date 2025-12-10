'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Mail, Shield, Palette, Globe } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/context/ThemeContext';
import { useLocale } from '@/context/LocaleContext';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { theme } = useTheme();
    const { currentLocale, setLocale, availableLocales } = useLocale();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const getUserDisplayName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        if (user?.firstName) {
            return user.firstName;
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
        <div className="min-h-screen bg-background py-12 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your account information and preferences
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Profile Overview Card */}
                    <Card className="border-border bg-card transition-colors duration-300">
                        <CardHeader>
                            <CardTitle className="text-card-foreground">Account Information</CardTitle>
                            <CardDescription>
                                Your personal details and account settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start space-x-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-2xl shadow-lg">
                                        {getUserInitials()}
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="flex-1 space-y-6">
                                    {/* Name */}
                                    <div className="grid gap-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <UserCircle className="h-4 w-4" />
                                            Full Name
                                        </Label>
                                        <div className="text-lg font-medium text-foreground">
                                            {getUserDisplayName()}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="grid gap-2">
                                        <Label className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </Label>
                                        <div className="text-lg font-medium text-foreground">
                                            {user.email}
                                        </div>
                                    </div>

                                    {/* Roles */}
                                    {user.roles && user.roles.length > 0 && (
                                        <div className="grid gap-2">
                                            <Label className="flex items-center gap-2 text-muted-foreground">
                                                <Shield className="h-4 w-4" />
                                                Account Type
                                            </Label>
                                            <div className="flex gap-2">
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role}
                                                        variant={role === 'ADMIN' ? 'default' : 'secondary'}
                                                        className={role === 'ADMIN' ? 'bg-primary text-primary-foreground' : ''}
                                                    >
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preferences Card */}
                    <Card className="border-border bg-card transition-colors duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-card-foreground">
                                <Palette className="h-5 w-5" />
                                Preferences
                            </CardTitle>
                            <CardDescription>
                                Customize your experience with theme and locale settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Theme Setting */}
                            <div className="flex items-center justify-between pb-4 border-b border-border">
                                <div className="space-y-1">
                                    <Label className="text-base font-medium text-foreground">
                                        Theme
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Currently using {theme === 'light' ? 'Light' : 'Dark'} mode
                                    </p>
                                </div>
                                <ThemeToggle />
                            </div>

                            {/* Locale Setting */}
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base font-medium text-foreground flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        Region & Currency
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {currentLocale.country} ({currentLocale.symbol})
                                    </p>
                                </div>
                                <select
                                    value={currentLocale.code}
                                    onChange={(e) => setLocale(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                >
                                    {Object.values(availableLocales).map((locale) => (
                                        <option key={locale.code} value={locale.code}>
                                            {locale.country} ({locale.symbol})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Status Card */}
                    <Card className="border-border bg-card transition-colors duration-300">
                        <CardHeader>
                            <CardTitle className="text-card-foreground">Account Status</CardTitle>
                            <CardDescription>
                                Your account is active and in good standing
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm text-muted-foreground">Active Account</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
