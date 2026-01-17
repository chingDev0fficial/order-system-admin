import { router, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Logo } from './logo';

interface AuthUser {
    name: string;
    email: string;
    // add other user properties if needed
}

interface PageProps {
    auth: {
        user: AuthUser;
    };
    [key: string]: unknown; // Add index signature to satisfy Inertia PageProps constraint
}

interface AccountOptionsProps {
    open: boolean;
    onClose: () => void;
    user: AuthUser;
}

function AccountOptions({ open, onClose, user }: AccountOptionsProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleProfile = () => {
        router.visit('/profile');
        onClose();
    };

    const handleSettings = () => {
        router.visit('/settings');
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="absolute top-13 right-1 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
        >
            {/* User Info */}
            <div className="border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F96901] text-xl font-bold text-white">
                        {user?.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                            {user?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                            {user?.email}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
                <button
                    onClick={handleProfile}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100"
                >
                    <User size={18} />
                    <span>Profile</span>
                </button>
                <button
                    onClick={handleSettings}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100"
                >
                    <Settings size={18} />
                    <span>Settings</span>
                </button>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-200 py-2">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-red-600 transition-colors hover:bg-red-50"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export function NavBar() {
    const { auth } = usePage<PageProps>().props;
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    // Access the admin user data
    const user = auth.user;

    const handleClickAccount = () => {
        setIsAccountOpen(!isAccountOpen);
    };

    return (
        <div className="flex items-center justify-between bg-[#F96901]">
            <Logo />
            <div className="relative">
                <div
                    className="cursor-pointer p-3 transition-colors hover:bg-[#FFA559]"
                    onClick={handleClickAccount}
                >
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-[#F96901]">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="hidden items-center gap-1 text-[#fff] sm:flex">
                            <span className="text-sm">
                                Welcome, {user?.name}
                            </span>
                            <ChevronDown
                                size={16}
                                className={`transition-transform ${isAccountOpen ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </div>
                </div>
                <AccountOptions
                    open={isAccountOpen}
                    onClose={() => setIsAccountOpen(false)}
                    user={user}
                />
            </div>
        </div>
    );
}
