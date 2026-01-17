import { NavBar } from '@/custom/components/nav-bar';
import {
    CheckCircle,
    Clock,
    LayoutDashboard,
    Package,
    RefreshCw,
    ShoppingCart,
    XCircle,
} from 'lucide-react';
import { ReactNode } from 'react';
import { SideBar } from './side-bar';

interface AppLayoutProps {
    children: ReactNode;
}

interface Tab {
    name: string;
    icon: React.ReactNode;
    href?: string | null;
    children?: Tab[];
}

export function AppLayout({ children }: AppLayoutProps) {
    const tabs: Tab[] = [
        {
            name: 'Dashboard',
            icon: <LayoutDashboard size={20} />,
            href: '/',
        },
        {
            name: 'Orders',
            icon: <ShoppingCart size={20} />,
            href: null,
            children: [
                {
                    name: 'Pending',
                    icon: <Clock size={20} />,
                    href: '/orders/pending',
                },
                {
                    name: 'Processings',
                    icon: <RefreshCw size={20} />,
                    href: '/orders/processing',
                },
                {
                    name: 'Completed',
                    icon: <CheckCircle size={20} />,
                    href: '/orders/completed',
                },
                {
                    name: 'Canceled',
                    icon: <XCircle size={20} />,
                    href: '/orders/canceled',
                },
            ],
        },
        { name: 'Products', icon: <Package size={20} />, href: '/products' },
        // { name: 'Customers', icon: <Users size={20} />, href: '/customers' },
    ];

    return (
        <div className="flex h-screen flex-col">
            <NavBar />
            <div className="flex flex-1 overflow-hidden">
                <SideBar tabs={tabs} />
                <main className="scrollbar-thin flex-1 overflow-y-auto bg-gray-50 p-2 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
